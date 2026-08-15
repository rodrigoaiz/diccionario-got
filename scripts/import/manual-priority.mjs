import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const sourcePath = path.join(root, 'scripts/import/fixtures/manual-priority.json');
const targetPath = path.join(root, 'src/content/entries');
const entries = JSON.parse(await readFile(sourcePath, 'utf8'));

function sourceUrl(title) {
  return `https://awoiaf.westeros.org/index.php/${title.replaceAll(' ', '_')}`;
}

function yaml(value) {
  return JSON.stringify(value);
}

function toMarkdown(entry) {
  const fields = {
    id: entry.id,
    slug: entry.slug,
    nameEs: entry.nameEs,
    nameEn: entry.nameEn,
    type: entry.type,
    continuity: entry.continuity,
    region: entry.region,
    aliases: entry.aliases,
    summary: entry.summary,
    accent: entry.accent,
    editorialStatus: entry.editorialStatus,
    mapStatus: entry.mapStatus,
    spoilerLevel: entry.spoilerLevel,
    references: [],
    sources: [{ name: 'A Wiki of Ice and Fire', url: sourceUrl(entry.source), consulted: '2026-08-14', confidence: 'secundario' }],
  };
  const frontmatter = Object.entries(fields).map(([key, value]) => `${key}: ${yaml(value)}`).join('\n');
  return `---\n${frontmatter}\n---\n\n## Resumen\n\n${entry.summary}\n`;
}

await mkdir(targetPath, { recursive: true });
await Promise.all(entries.map((entry) => writeFile(path.join(targetPath, `${entry.slug}.md`), toMarkdown(entry), 'utf8')));
console.log(`Generated ${entries.length} manual priority entries`);
