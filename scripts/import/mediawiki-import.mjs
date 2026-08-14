import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const apiUrl = process.env.WIKI_API_URL ?? 'https://es.wikipedia.org/w/api.php';
const category = process.env.WIKI_CATEGORY ?? 'Categoría:Personajes de Canción de hielo y fuego';
const limit = Math.max(1, Math.min(Number(process.env.IMPORT_LIMIT ?? 10), 50));
const sourceSlug = 'wikipedia-es';
const sourceName = 'Wikipedia en español';
const fetchedAt = new Date().toISOString().slice(0, 10);
const rawPath = path.join(projectRoot, 'src/data/import/raw', sourceSlug, 'personajes.json');
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
  const source = {
    name: sourceName,
    url: `https://es.wikipedia.org/?curid=${page.pageid}`,
    consulted: fetchedAt,
    confidence: 'pendiente-de-verificar',
  };
  const fields = {
    id: `mediawiki-es-${page.pageid}`,
    slug,
    nameEs: page.title,
    nameEn: '',
    type: 'Personaje',
    continuity: 'Pendiente de asignar',
    region: 'Pendiente de asignar',
    aliases: [],
    summary: 'Entrada importada desde una categoria de MediaWiki. Falta redactar el resumen y verificar la continuidad.',
    accent: 'ochre',
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

const pages = await fetchCategoryMembers();
await mkdir(path.dirname(rawPath), { recursive: true });
await mkdir(contentPath, { recursive: true });

await writeFile(
  rawPath,
  `${JSON.stringify({ source: sourceName, api: apiUrl, category, fetchedAt, pages }, null, 2)}\n`,
  'utf8',
);

await Promise.all(
  pages.map((page) => writeFile(path.join(contentPath, `${slugify(page.title)}.md`), toMarkdown(page), 'utf8')),
);

console.log(`Imported ${pages.length} MediaWiki pages from ${category}`);
