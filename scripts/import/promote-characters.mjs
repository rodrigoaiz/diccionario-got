import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const fixturePath = path.join(projectRoot, 'scripts/import/fixtures/promote-characters.json');
const contentPath = path.join(projectRoot, 'src/content/entries');
const rawPaths = [
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/candidatos-personajes.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/candidatos-fuego-sangre.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/personajes-masivo.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/personajes-got-masivo.json'),
];
const consulted = new Date().toISOString().slice(0, 10);
const wikidataApiUrl = 'https://www.wikidata.org/w/api.php';

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

async function fetchWikidataEntities(ids) {
  const entities = new Map();
  for (let index = 0; index < ids.length; index += 50) {
    const url = new URL(wikidataApiUrl);
    url.searchParams.set('action', 'wbgetentities');
    url.searchParams.set('ids', ids.slice(index, index + 50).join('|'));
    url.searchParams.set('props', 'labels|aliases');
    url.searchParams.set('languages', 'en|es');
    url.searchParams.set('format', 'json');
    const response = await fetch(url, {
      headers: { 'User-Agent': 'diccionario-got-promote/0.1 (local editorial tool)' },
    });
    if (!response.ok) throw new Error(`Wikidata API responded with ${response.status}`);
    const payload = await response.json();
    for (const [id, entity] of Object.entries(payload.entities ?? {})) entities.set(id, entity);
  }
  return entities;
}

const promotions = JSON.parse(await readFile(fixturePath, 'utf8'));
const pages = new Map();
for (const rawPath of rawPaths) {
  const raw = JSON.parse(await readFile(rawPath, 'utf8'));
  for (const page of raw.pages ?? []) pages.set(slugify(page.title), page);
}
const wikidataIds = [...pages.values()]
  .map((page) => page.wikidataId ?? page.pageprops?.wikibase_item)
  .filter(Boolean);
const wikidataEntities = await fetchWikidataEntities([...new Set(wikidataIds)]);

let promoted = 0;
let skipped = 0;
const missing = [];

for (const promotion of promotions) {
  const page = pages.get(promotion.slug);
  if (!page) {
    missing.push(promotion.slug);
    continue;
  }

  const targetPath = path.join(contentPath, `${promotion.slug}.md`);
  const existing = await readFile(targetPath, 'utf8').catch(() => null);
  const isUnreviewed = existing?.includes('type: "Pendiente"') || existing?.includes('continuity: "Pendiente de asignar"');
  const needsEnglishLabel = existing?.includes('nameEn: ""');
  if (!isUnreviewed && !needsEnglishLabel) {
    skipped += 1;
    continue;
  }

  const englishTitle = page.langlinks?.find((link) => link.lang === 'en')?.title ?? page.wikidataLabelEn ?? '';
  const wikidataId = page.wikidataId || page.pageprops?.wikibase_item || '';
  const wikidataEntity = wikidataEntities.get(wikidataId);
  const resolvedEnglishTitle = englishTitle || wikidataEntity?.labels?.en?.value || '';
  const resolvedAliases = [
    ...(page.wikidataAliases ?? []),
    ...(wikidataEntity?.aliases?.es ?? []).map((alias) => alias.value),
    ...(wikidataEntity?.aliases?.en ?? []).map((alias) => alias.value),
  ];
  const sources = [{
    name: 'Wikipedia en español',
    url: page.fullurl ?? `https://es.wikipedia.org/?curid=${page.pageid}`,
    consulted,
    confidence: 'revisada',
  }];
  if (wikidataId) {
    sources.push({
      name: 'Wikidata',
      url: `https://www.wikidata.org/wiki/${wikidataId}`,
      consulted,
      confidence: 'estructurado',
    });
  }

  const fields = {
    id: `mediawiki-es-${page.pageid}`,
    slug: promotion.slug,
    nameEs: page.title,
    nameEn: resolvedEnglishTitle,
    type: 'Personaje',
    continuity: 'Libros',
    region: promotion.region,
    aliases: [...new Set(resolvedAliases)].filter((alias) => alias !== page.title && alias !== resolvedEnglishTitle),
    summary: promotion.summary,
    accent: 'ochre',
    editorialStatus: 'revisada',
    spoilerLevel: 'spoiler-total',
    wikidataId,
    sourceCategories: (page.categories ?? []).map((item) => item.title),
    sources,
  };
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${yaml(value)}`)
    .join('\n');
  await writeFile(targetPath, `---\n${frontmatter}\n---\n\n## Resumen\n\n${promotion.summary}\n`, 'utf8');
  promoted += 1;
}

console.log(`Promoted ${promoted} character entries; skipped ${skipped}; missing ${missing.length}`);
if (missing.length > 0) console.log(`Missing slugs: ${missing.join(', ')}`);
