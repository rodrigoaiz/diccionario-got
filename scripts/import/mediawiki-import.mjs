import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const apiUrl = process.env.WIKI_API_URL ?? 'https://es.wikipedia.org/w/api.php';
const category = process.env.WIKI_CATEGORY ?? 'Categoría:Personajes de Canción de hielo y fuego';
const requestedTitles = (process.env.WIKI_TITLES ?? '')
  .split(',')
  .map((title) => title.trim())
  .filter(Boolean);
const importType = process.env.IMPORT_TYPE ?? 'Personaje';
const importLabel = process.env.IMPORT_LABEL ?? (requestedTitles.length > 0 ? 'lugares' : 'personajes');
const overwrite = process.env.IMPORT_OVERWRITE === 'true';
const limit = Math.max(1, Math.min(Number(process.env.IMPORT_LIMIT ?? 10), 50));
const sourceSlug = 'wikipedia-es';
const sourceName = 'Wikipedia en español';
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
  const englishTitle = page.langlinks?.find((link) => link.lang === 'en')?.title ?? '';
  const source = {
    name: sourceName,
    url: page.fullurl ?? `https://es.wikipedia.org/?curid=${page.pageid}`,
    consulted: fetchedAt,
    confidence: 'pendiente-de-verificar',
  };
  const fields = {
    id: `mediawiki-es-${page.pageid}`,
    slug,
    nameEs: page.title,
    nameEn: englishTitle,
    type: importType,
    continuity: 'Pendiente de asignar',
    region: 'Pendiente de asignar',
    aliases: [],
    summary: `Entrada importada desde MediaWiki. Falta redactar el resumen y verificar la continuidad de este ${importType.toLocaleLowerCase('es')}.`,
    accent: importType === 'Lugar' ? 'moss' : 'ochre',
    wikidataId: page.pageprops?.wikibase_item ?? '',
    sourceCategories: (page.categories ?? []).map((item) => item.title),
    sources: [source],
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
  const url = new URL(apiUrl);
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', titles.slice(0, limit).join('|'));
  url.searchParams.set('prop', 'info');
  url.searchParams.set('inprop', 'url');
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');

  const response = await fetch(url, {
    headers: { 'User-Agent': 'diccionario-got-import/0.1 (local editorial tool)' },
  });
  if (!response.ok) throw new Error(`MediaWiki title API responded with ${response.status}`);

  const payload = await response.json();
  return (payload.query?.pages ?? []).filter((page) => page.ns === 0 && !page.missing);
}

async function fetchPageMetadata(pages) {
  if (pages.length === 0) return [];

  const url = new URL(apiUrl);
  url.searchParams.set('action', 'query');
  url.searchParams.set('pageids', pages.map((page) => page.pageid).join('|'));
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
  return payload.query?.pages ?? [];
}

const pages = requestedTitles.length > 0 ? await fetchTitles(requestedTitles) : await fetchCategoryMembers();
const enrichedPages = await fetchPageMetadata(pages);
await mkdir(path.dirname(rawPath), { recursive: true });
await mkdir(contentPath, { recursive: true });

await writeFile(
  rawPath,
  `${JSON.stringify({ source: sourceName, api: apiUrl, category, titles: requestedTitles, type: importType, fetchedAt, pages: enrichedPages }, null, 2)}\n`,
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

const sourceDescription = requestedTitles.length > 0 ? `${requestedTitles.length} requested titles` : category;
console.log(`Imported ${imported} MediaWiki pages with metadata from ${sourceDescription}; skipped ${skipped}`);
