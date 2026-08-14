export type EntryType = 'Lugar' | 'Personaje' | 'Casa' | 'Dragon' | 'Evento';

export type DictionaryEntry = {
  slug: string;
  id: string;
  nameEs: string;
  nameEn: string;
  type: EntryType;
  continuity: string;
  region: string;
  aliases: string[];
  summary: string;
  accent: 'rust' | 'ochre' | 'moss';
};
