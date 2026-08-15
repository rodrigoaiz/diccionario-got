import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const contentPath = path.join(projectRoot, 'src/content/entries');
const fixturePath = path.join(projectRoot, 'scripts/import/fixtures/resolve-pending.json');
const rawPaths = [
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/candidatos-personajes.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/candidatos-fuego-sangre.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/personajes-masivo.json'),
  path.join(projectRoot, 'src/data/import/raw/wikipedia-es/personajes-got-masivo.json'),
];
const consulted = new Date().toISOString().slice(0, 10);

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

const promotions = JSON.parse(await readFile(fixturePath, 'utf8'));
const pages = new Map();
for (const rawPath of rawPaths) {
  const raw = JSON.parse(await readFile(rawPath, 'utf8'));
  for (const page of raw.pages ?? []) pages.set(slugify(page.title), page);
}

let promoted = 0;
for (const promotion of promotions) {
  const targetPath = path.join(contentPath, `${promotion.slug}.md`);
  const existing = await readFile(targetPath, 'utf8').catch(() => null);
  if (!existing?.includes('type: "Pendiente"')) continue;

  const page = pages.get(promotion.slug);
  const nameEs = page?.title ?? existing.match(/^nameEs: "([^"]+)"$/m)?.[1] ?? promotion.slug;
  const wikidataId = page?.wikidataId || page?.pageprops?.wikibase_item || existing.match(/^wikidataId: "([^"]*)"$/m)?.[1] || '';
  const aliases = page?.wikidataAliases ?? [];
  const sources = [{
    name: 'Wikipedia en español',
    url: page?.fullurl ?? existing.match(/"url":"([^"]+)"/)?.[1] ?? `https://es.wikipedia.org/wiki/${encodeURIComponent(nameEs.replaceAll(' ', '_'))}`,
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
    id: page?.pageid ? `mediawiki-es-${page.pageid}` : existing.match(/^id: "([^"]+)"$/m)?.[1] ?? `pending-${promotion.slug}`,
    slug: promotion.slug,
    nameEs,
    nameEn: promotion.nameEn,
    type: promotion.type,
    continuity: promotion.continuity,
    region: promotion.region,
    aliases: [...new Set(aliases)].filter((alias) => alias !== nameEs && alias !== promotion.nameEn),
    summary: promotion.summary,
    accent: promotion.type === 'Lugar' || promotion.type === 'Concepto' ? 'moss' : 'ochre',
    editorialStatus: 'revisada',
    spoilerLevel: 'spoiler-total',
    wikidataId,
    sourceCategories: (page?.categories ?? []).map((item) => item.title),
    sources,
  };
  const frontmatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${yaml(value)}`)
    .join('\n');
  await writeFile(targetPath, `---\n${frontmatter}\n---\n\n## Resumen\n\n${promotion.summary}\n`, 'utf8');
  promoted += 1;
}

let discarded = 0;
for (const filename of await readdir(contentPath)) {
  if (!filename.endsWith('.md')) continue;
  const targetPath = path.join(contentPath, filename);
  const content = await readFile(targetPath, 'utf8');
  if (!content.includes('type: "Pendiente"')) continue;
  await unlink(targetPath);
  discarded += 1;
}

console.log(`Promoted ${promoted} valid entries; discarded ${discarded} unresolved candidates; raw imports preserved.`);
