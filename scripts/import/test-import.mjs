import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const sourcePath = path.join(projectRoot, 'scripts/import/fixtures/entries.sample.json');
const targetPath = path.join(projectRoot, 'src/content/entries');
const entries = JSON.parse(await readFile(sourcePath, 'utf8'));

const toYamlValue = (value) => JSON.stringify(value);

const toMarkdown = (entry) => {
  const fields = ['id', 'slug', 'nameEs', 'nameEn', 'type', 'continuity', 'region', 'aliases', 'summary', 'accent', 'sources'];
  const frontmatter = fields.map((field) => `${field}: ${toYamlValue(entry[field])}`).join('\n');
  return `---\n${frontmatter}\n---\n\n## Resumen\n\n${entry.summary}\n`;
};

await mkdir(targetPath, { recursive: true });

await Promise.all(
  entries.map((entry) => writeFile(path.join(targetPath, `${entry.slug}.md`), toMarkdown(entry), 'utf8')),
);

console.log(`Imported ${entries.length} sample entries to src/content/entries/`);
