import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const entriesPath = path.join(root, 'src/content/entries');
const reviews = {
  'casa-frey': ['Tierras de los Ríos', 'Libros · GOT', 'Casa noble que controla Los Gemelos y el cruce del Forca Verde.', 'La Casa Frey domina un paso estratégico de las Tierras de los Ríos desde Los Gemelos. Su posición convierte el peaje y el tránsito en instrumentos de poder.'],
  'casa-bolton': ['Norte', 'Libros · GOT', 'Casa del Norte asentada en Fuerte Terror y rival histórica de los Stark.', 'La Casa Bolton gobierna desde Fuerte Terror y representa una tradición de violencia y ambición dentro del Norte.'],
  'casa-tully': ['Tierras de los Ríos', 'Libros · GOT', 'Casa principal de las Tierras de los Ríos y señores de Aguasdulces.', 'La Casa Tully gobierna Aguasdulces y articula alianzas entre las casas de los ríos, el Norte y el sur de Poniente.'],
  'casa-dayne': ['Dorne', 'Libros · GOT', 'Casa dorniense asociada a Campoestrella y a la espada Alba.', 'La Casa Dayne es una casa noble de Dorne vinculada a Campoestrella y a una de las tradiciones caballerescas más conocidas del continente.'],
  'casa-mormont': ['Norte', 'Libros · GOT', 'Casa de la Isla del Oso, conocida por su lealtad y su tradición guerrera.', 'La Casa Mormont gobierna la Isla del Oso y conserva una reputación de independencia, dureza y lealtad hacia el Norte.'],
  'casa-manderly': ['Norte', 'Libros · GOT', 'Casa de origen sureño asentada en Puerto Blanco, la gran ciudad portuaria del Norte.', 'La Casa Manderly gobierna Puerto Blanco y aporta riqueza, flota y peso político al Norte.'],
  'casa-redwyne': ['El Dominio', 'Libros · GOT', 'Casa del Dominio vinculada a Arbor y a una de las mayores flotas de Poniente.', 'La Casa Redwyne controla Arbor y sus viñedos, y su poder naval la convierte en una aliada relevante del Dominio.'],
  'casa-royce': ['El Valle', 'Libros · GOT', 'Casa noble del Valle con dominios en Runestone y vínculos con la Casa Arryn.', 'La Casa Royce es una de las principales casas del Valle y mantiene una presencia histórica junto a la Casa Arryn.'],
  'casa-tarth': ['Tierras de la Tormenta', 'Libros · GOT', 'Casa de la isla de Tarth, situada frente a la costa oriental de Poniente.', 'La Casa Tarth gobierna una isla estratégica de las Tierras de la Tormenta y está asociada a la tradición caballeresca de Brienne.'],
  'casa-hightower': ['El Dominio', 'Libros · Fuego y sangre · HOTD', 'Casa de Antigua, vinculada a la Ciudadela y a la política de la corte.', 'La Casa Hightower gobierna desde Antigua y combina riqueza urbana, influencia religiosa y presencia política en la corona.'],
  'casa-blackwood': ['Tierras de los Ríos', 'Libros · Fuego y sangre · GOT', 'Casa de Árbol de Cuervos, enfrentada históricamente a la Casa Bracken.', 'La Casa Blackwood es una casa de las Tierras de los Ríos cuya rivalidad con los Bracken atraviesa generaciones.'],
  'casa-bracken': ['Tierras de los Ríos', 'Libros · Fuego y sangre · GOT', 'Casa de Seto de Piedra y rival tradicional de la Casa Blackwood.', 'La Casa Bracken mantiene una rivalidad histórica con los Blackwood y ocupa un lugar recurrente en la política de las Tierras de los Ríos.'],
  'wyman-manderly': ['Norte', 'Libros · GOT', 'Señor de Puerto Blanco y cabeza de la Casa Manderly.', 'Wyman Manderly gobierna Puerto Blanco y utiliza su posición, su riqueza y su memoria política para proteger los intereses del Norte.'],
  'walder-frey': ['Tierras de los Ríos', 'Libros · GOT', 'Señor de Los Gemelos y patriarca de la Casa Frey.', 'Walder Frey controla el cruce de Los Gemelos y construye su influencia a través de una extensa red de matrimonios y alianzas.'],
  'brynden-tully': ['Tierras de los Ríos', 'Libros · GOT', 'Caballero de la Casa Tully conocido como el Pez Negro.', 'Brynden Tully es un comandante experimentado y una de las figuras militares más capaces de la Casa Tully.'],
  'edmure-tully': ['Tierras de los Ríos', 'Libros · GOT', 'Señor de Aguasdulces y heredero de la Casa Tully.', 'Edmure Tully hereda Aguasdulces en medio de la guerra y debe equilibrar lealtad familiar, estrategia y responsabilidad regional.'],
  'roose-bolton': ['Norte', 'Libros · GOT', 'Señor de Fuerte Terror y miembro de la Casa Bolton.', 'Roose Bolton es un estratega frío cuya alianza con los vencedores de la guerra altera el equilibrio político del Norte.'],
  'ramsay-bolton': ['Norte', 'Libros · GOT', 'Heredero de la Casa Bolton, conocido por su crueldad y sus métodos de terror.', 'Ramsay Bolton convierte la violencia y la intimidación en herramientas de poder durante la lucha por el control del Norte.'],
  'jeor-mormont': ['Norte', 'Libros · GOT', 'Lord Comandante de la Guardia de la Noche y antiguo señor de la Isla del Oso.', 'Jeor Mormont dirige la Guardia de la Noche durante una etapa de creciente amenaza más allá del Muro.'],
  'lyanna-mormont': ['Norte', 'Libros · GOT', 'Joven señora de la Isla del Oso y representante de la Casa Mormont.', 'Lyanna Mormont encarna la voz política del Norte y la determinación de su casa durante la guerra.'],
  'brienne-de-tarth': ['Tierras de la Tormenta', 'Libros · GOT', 'Guerrera y heredera de la Casa Tarth, conocida por su compromiso con los votos caballerescos.', 'Brienne de Tarth desafía las expectativas de su época y convierte sus votos, su lealtad y su habilidad marcial en el centro de su identidad.'],
  'alicent-hightower': ['Tierras de la Corona', 'Fuego y sangre · HOTD', 'Reina consorte Targaryen e hija de la Casa Hightower.', 'Alicent Hightower ocupa una posición central en la corte Targaryen y en la disputa sucesoria que conduce a la Danza de los Dragones.'],
  'otto-hightower': ['Tierras de la Corona', 'Fuego y sangre · HOTD', 'Mano del Rey y principal representante político de la Casa Hightower.', 'Otto Hightower utiliza la administración, la corte y las alianzas familiares para orientar la sucesión Targaryen.'],
};

function yaml(value) {
  return JSON.stringify(value);
}

function replaceField(content, field, value) {
  const line = `${field}: ${yaml(value)}`;
  const pattern = new RegExp(`^${field}:.*$`, 'm');
  if (pattern.test(content)) return content.replace(pattern, line);
  return content.replace(/^accent:.*$/m, (accent) => `${accent}\n${line}`);
}

for (const [slug, [region, continuity, summary, bodySummary]] of Object.entries(reviews)) {
  const filePath = path.join(entriesPath, `${slug}.md`);
  let content = await readFile(filePath, 'utf8');
  content = replaceField(content, 'region', region);
  content = replaceField(content, 'continuity', continuity);
  content = replaceField(content, 'summary', summary);
  content = replaceField(content, 'editorialStatus', 'revisada');
  content = replaceField(content, 'mapStatus', 'pendiente');
  content = replaceField(content, 'spoilerLevel', 'spoiler-total');
  content = replaceField(content, 'references', []);
  content = content.replace(/\n---\n\n## Resumen[\s\S]*$/, `\n---\n\n## Resumen\n\n${bodySummary}\n`);
  await writeFile(filePath, content, 'utf8');
}

console.log(`Reviewed ${Object.keys(reviews).length} secondary entries`);
