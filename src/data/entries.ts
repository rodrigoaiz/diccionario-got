export type EntryType = 'Lugar' | 'Personaje' | 'Casa' | 'Dragon' | 'Evento';

export type DictionaryEntry = {
  slug: string;
  nameEs: string;
  nameEn: string;
  type: EntryType;
  continuity: string;
  region: string;
  aliases: string[];
  summary: string;
  accent: 'rust' | 'ochre' | 'moss';
};

export const entries: DictionaryEntry[] = [
  {
    slug: 'invernalia',
    nameEs: 'Invernalia',
    nameEn: 'Winterfell',
    type: 'Lugar',
    continuity: 'Libros · GOT',
    region: 'Norte',
    aliases: ['Winterfell'],
    summary: 'Sede ancestral de la Casa Stark y puerta del Norte.',
    accent: 'moss',
  },
  {
    slug: 'desembarco-del-rey',
    nameEs: 'Desembarco del Rey',
    nameEn: "King's Landing",
    type: 'Lugar',
    continuity: 'Libros · GOT · HOTD',
    region: 'Tierras de la Corona',
    aliases: ["King's Landing", 'King Landing'],
    summary: 'Capital de los Siete Reinos y centro cambiante del poder.',
    accent: 'rust',
  },
  {
    slug: 'rhaenyra-targaryen',
    nameEs: 'Rhaenyra Targaryen',
    nameEn: 'Rhaenyra Targaryen',
    type: 'Personaje',
    continuity: 'Fuego y sangre · HOTD',
    region: 'Tierras de la Corona',
    aliases: ['La reina que nunca fue', 'The Realm\'s Delight'],
    summary: 'Heredera disputada del Trono de Hierro durante la Danza de los Dragones.',
    accent: 'rust',
  },
  {
    slug: 'aegon-targaryen',
    nameEs: 'Aegon Targaryen',
    nameEn: 'Aegon Targaryen',
    type: 'Personaje',
    continuity: 'Libros · Fuego y sangre · HOTD',
    region: 'Varias regiones',
    aliases: ['Aegon I', 'Aegon II', 'Aegon III', 'Aegon IV', 'Aegon V'],
    summary: 'Nombre compartido por varios reyes y principes Targaryen.',
    accent: 'ochre',
  },
  {
    slug: 'casa-stark',
    nameEs: 'Casa Stark',
    nameEn: 'House Stark',
    type: 'Casa',
    continuity: 'Libros · GOT',
    region: 'Norte',
    aliases: ['Stark de Invernalia', 'The Starks of Winterfell'],
    summary: 'Casa noble del Norte, vinculada a Invernalia y al lema El invierno se acerca.',
    accent: 'moss',
  },
  {
    slug: 'balerion',
    nameEs: 'Balerion',
    nameEn: 'Balerion the Black Dread',
    type: 'Dragon',
    continuity: 'Fuego y sangre · HOTD',
    region: 'Tierras de la Corona',
    aliases: ['El Terror Negro', 'The Black Dread'],
    summary: 'El dragon de Aegon el Conquistador y una de las criaturas mas grandes de la historia.',
    accent: 'ochre',
  },
  {
    slug: 'la-danza-de-los-dragones',
    nameEs: 'La Danza de los Dragones',
    nameEn: 'The Dance of the Dragons',
    type: 'Evento',
    continuity: 'Fuego y sangre · HOTD',
    region: 'Siete Reinos',
    aliases: ['Danza de los Dragones', 'The Dance'],
    summary: 'Guerra civil Targaryen que divide el reino y enfrenta a dos reclamantes.',
    accent: 'rust',
  },
];

export const featuredEntries = entries.slice(0, 4);
