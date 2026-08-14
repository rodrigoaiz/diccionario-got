import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const reviewPath = path.join(projectRoot, 'scripts/import/fixtures/characters.review.json');
const contentPath = path.join(projectRoot, 'src/content/entries');
const reviews = JSON.parse(await readFile(reviewPath, 'utf8'));

function yaml(value) {
  return JSON.stringify(value);
}

function replaceField(content, field, value) {
  const line = `${field}: ${yaml(value)}`;
  const pattern = new RegExp(`^${field}:.*$`, 'm');
  if (pattern.test(content)) return content.replace(pattern, line);
  return content.replace(/^accent:.*$/m, (accent) => `${accent}\n${line}`);
}

for (const review of reviews) {
  const filePath = path.join(contentPath, `${review.slug}.md`);
  let content = await readFile(filePath, 'utf8');
  for (const [field, value] of Object.entries(review)) {
    if (field !== 'slug') content = replaceField(content, field, value);
  }
  const body = `\n---\n\n## Resumen\n\n${review.summary}\n\n## Referencias iniciales\n\n${review.references.map((reference) => `- ${reference.kind}: ${reference.work}. ${reference.detail}`).join('\n')}\n`;
  content = content.replace(/\n---\n\n## Resumen[\s\S]*$/, body);
  await writeFile(filePath, content, 'utf8');
}

console.log(`Reviewed ${reviews.length} character entries`);
