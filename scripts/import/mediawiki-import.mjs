import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const apiUrl = process.env.WIKI_API_URL ?? 'https://es.wikipedia.org/w/api.php';
const category = process.env.WIKI_CATEGORY ?? 'Categoría:Personajes de Canción de hielo y fuego';
const linksFrom = process.env.WIKI_LINKS_FROM ?? '';
const requestedTitles = (process.env.WIKI_TITLES ?? '')
  .split(',')
  .map((title) => title.trim())
  .filter(Boolean);
const importType = process.env.IMPORT_TYPE ?? 'Personaje';
const importLabel = process.env.IMPORT_LABEL ?? (requestedTitles.length > 0 ? 'lugares' : 'personajes');
const overwrite = process.env.IMPORT_OVERWRITE === 'true';
const skipWikidata = process.env.SKIP_WIKIDATA === 'true';
const limit = Math.max(1, Math.min(Number(process.env.IMPORT_LIMIT ?? 10), 250));
const sourceSlug = 'wikipedia-es';
const sourceName = 'Wikipedia en español';
const wikidataApiUrl = 'https://www.wikidata.org/w/api.php';
const fetchedAt = new Date().toISOString().slice(0, 10);
const rawPath = path.join(projectRoot, 'src/data/import/raw', sourceSlug, `${importLabel}.json`);
const contentPath = path.join(projectRoot, 'src/content/entries');

function slugify(title) {
  return title
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function yaml(value) {
  return JSON.stringify(value);
}

function toMarkdown(page) {
  const slug = slugify(page.title);
  const englishTitle = page.langlinks?.find((link) => link.lang === 'en')?.title ?? page.wikidataLabelEn ?? '';
  const source = {
    name: sourceName,
    url: page.fullurl ?? `https://es.wikipedia.org/?curid=${page.pageid}`,
    consulted: fetchedAt,
    confidence: 'pendiente-de-verificar',
  };
  const sources = [source];
  if (page.wikidataId) {
    sources.push({
      name: 'Wikidata',
      url: `https://www.wikidata.org/wiki/${page.wikidataId}`,
      consulted: fetchedAt,
      confidence: 'estructurado',
    });
  }
  const fields = {
    id: `mediawiki-es-${page.pageid}`,
    slug,
    nameEs: page.title,
    nameEn: englishTitle,
    type: importType,
    continuity: 'Pendiente de asignar',
    region: 'Pendiente de asignar',
    aliases: (page.wikidataAliases ?? []).filter((alias) => alias !== page.title && alias !== englishTitle),
    summary: `Entrada importada desde MediaWiki. Falta redactar el resumen y verificar la continuidad de este ${importType.toLocaleLowerCase('es')}.`,
    accent: importType === 'Lugar' ? 'moss' : 'ochre',
    wikidataId: page.wikidataId ?? page.pageprops?.wikibase_item ?? '',
    sourceCategories: (page.categories ?? []).map((item) => item.title),
    sources,
  };
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${yaml(value)}`)
    .join('\n');
  return `---\n${frontmatter}\n---\n\n## Resumen\n\n${fields.summary}\n`;
}

async function fetchCategoryMembers() {
  const pages = [];
  let continuation;

  do {
    const url = new URL(apiUrl);
    url.searchParams.set('action', 'query');
    url.searchParams.set('list', 'categorymembers');
    url.searchParams.set('cmtitle', category);
    url.searchParams.set('cmtype', 'page');
    url.searchParams.set('cmlimit', String(Math.min(limit, 50)));
    url.searchParams.set('format', 'json');
    url.searchParams.set('formatversion', '2');
    if (continuation) url.searchParams.set('cmcontinue', continuation);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
    });
    if (!response.ok) throw new Error(`MediaWiki API responded with ${response.status}`);

    const payload = await response.json();
    pages.push(...(payload.query?.categorymembers ?? []).filter((page) => page.ns === 0));
    continuation = payload.continue?.cmcontinue;
  } while (pages.length < limit && continuation);

  return pages.slice(0, limit);
}

async function fetchTitles(titles) {
  const pages = [];
  for (let index = 0; index < Math.min(titles.length, limit); index += 50) {
    const url = new URL(apiUrl);
    url.searchParams.set('action', 'query');
    url.searchParams.set('titles', titles.slice(index, index + 50).join('|'));
    url.searchParams.set('prop', 'info');
    url.searchParams.set('inprop', 'url');
    url.searchParams.set('format', 'json');
    url.searchParams.set('formatversion', '2');

    const response = await fetch(url, {
      headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
    });
    if (!response.ok) throw new Error(`MediaWiki title API responded with ${response.status}`);

    const payload = await response.json();
    pages.push(...(payload.query?.pages ?? []).filter((page) => page.ns === 0 && !page.missing));
  }
  return pages;
}

async function fetchLinkedTitles(title) {
  const links = [];
  let continuation;

  do {
    const url = new URL(apiUrl);
    url.searchParams.set('action', 'query');
    url.searchParams.set('titles', title);
    url.searchParams.set('prop', 'links');
    url.searchParams.set('plnamespace', '0');
    url.searchParams.set('pllimit', 'max');
    url.searchParams.set('format', 'json');
    url.searchParams.set('formatversion', '2');
    if (continuation) url.searchParams.set('plcontinue', continuation);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
    });
    if (!response.ok) throw new Error(`MediaWiki links API responded with ${response.status}`);

    const payload = await response.json();
    links.push(...(payload.query?.pages?.[0]?.links ?? []).map((link) => link.title));
    continuation = payload.continue?.plcontinue;
  } while (links.length < limit && continuation);

  return [...new Set(links)].slice(0, limit);
}

async function fetchPageMetadata(pages) {
  if (pages.length === 0) return [];
  const metadata = [];

  for (let index = 0; index < pages.length; index += 50) {
    const chunk = pages.slice(index, index + 50);
    const url = new URL(apiUrl);
    url.searchParams.set('action', 'query');
    url.searchParams.set('pageids', chunk.map((page) => page.pageid).join('|'));
    url.searchParams.set('prop', 'info|pageprops|langlinks|categories');
    url.searchParams.set('inprop', 'url');
    url.searchParams.set('lllang', 'en');
    url.searchParams.set('cllimit', 'max');
    url.searchParams.set('format', 'json');
    url.searchParams.set('formatversion', '2');

    const response = await fetch(url, {
      headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
    });
    if (!response.ok) throw new Error(`MediaWiki metadata API responded with ${response.status}`);

    const payload = await response.json();
    metadata.push(...(payload.query?.pages ?? []));
  }

  return metadata;
}

async function searchWikidataId(title) {
  const url = new URL(wikidataApiUrl);
  url.searchParams.set('action', 'wbsearchentities');
  url.searchParams.set('search', title);
  url.searchParams.set('language', 'es');
  url.searchParams.set('uselang', 'es');
  url.searchParams.set('limit', '5');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  const response = await fetch(url, {
    headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
  });
  if (!response.ok) return '';

  const payload = await response.json();
  const expected = slugify(title);
  const result = (payload.search ?? []).find((item) => {
    const label = item.label ?? item.match?.text ?? '';
    const description = (item.description ?? '').toLocaleLowerCase('es');
    const exact = slugify(label) === expected || slugify(item.match?.text ?? '') === expected;
    return exact && !/(episodio|temporada|episode|season)/.test(description);
  });
  return result?.id ?? '';
}

async function fetchWikidataEntities(ids) {
  if (ids.length === 0) return new Map();

  const url = new URL(wikidataApiUrl);
  url.searchParams.set('action', 'wbgetentities');
  url.searchParams.set('ids', ids.join('|'));
  url.searchParams.set('props', 'labels|aliases');
  url.searchParams.set('languages', 'en|es');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  const response = await fetch(url, {
    headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
  });
  if (!response.ok) return new Map();

  const payload = await response.json();
  return new Map(Object.entries(payload.entities ?? {}));
}

async function enrichWithWikidata(pages) {
  if (skipWikidata) {
    return pages.map((page) => ({
      ...page,
      wikidataId: page.pageprops?.wikibase_item ?? '',
      wikidataLabelEn: '',
      wikidataAliases: [],
    }));
  }

  const matches = await Promise.all(
    pages.map(async (page) => [page.pageid, page.pageprops?.wikibase_item ?? await searchWikidataId(page.title)]),
  );
  const ids = matches.map(([, id]) => id).filter(Boolean);
  const entities = await fetchWikidataEntities(ids);

  return pages.map((page) => {
    const wikidataId = matches.find(([pageid]) => pageid === page.pageid)?.[1] ?? '';
    const entity = entities.get(wikidataId);
    const englishLabel = entity?.labels?.en?.value ?? '';
    const aliases = [
      ...(entity?.aliases?.es ?? []).map((alias) => alias.value),
      ...(entity?.aliases?.en ?? []).map((alias) => alias.value),
    ];
    return { ...page, wikidataId, wikidataLabelEn: englishLabel, wikidataAliases: [...new Set(aliases)] };
  });
}

const linkedTitles = linksFrom ? await fetchLinkedTitles(linksFrom) : [];
const pages = requestedTitles.length > 0
  ? await fetchTitles(requestedTitles)
  : linkedTitles.length > 0
    ? await fetchTitles(linkedTitles)
    : await fetchCategoryMembers();
const enrichedPages = await enrichWithWikidata(await fetchPageMetadata(pages));
await mkdir(path.dirname(rawPath), { recursive: true });
await mkdir(contentPath, { recursive: true });

await writeFile(
  rawPath,
  `${JSON.stringify({ source: sourceName, api: apiUrl, category, linksFrom, titles: requestedTitles, type: importType, fetchedAt, pages: enrichedPages }, null, 2)}\n`,
  'utf8',
);

let imported = 0;
let skipped = 0;

for (const page of enrichedPages) {
  const targetFile = path.join(contentPath, `${slugify(page.title)}.md`);
  const existing = await readFile(targetFile, 'utf8').catch(() => null);
  if (existing && !overwrite) {
    skipped += 1;
    continue;
  }
  await writeFile(targetFile, toMarkdown(page), 'utf8');
  imported += 1;
}

const sourceDescription = requestedTitles.length > 0 ? `${requestedTitles.length} requested titles` : linksFrom || category;
console.log(`Imported ${imported} MediaWiki pages with metadata from ${sourceDescription}; skipped ${skipped}`);
