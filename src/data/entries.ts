export type EntryType = 'Lugar' | 'Personaje' | 'Casa' | 'Dragon' | 'Evento' | 'Organizacion';

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
  editorialStatus?: 'revisada' | 'pendiente-de-verificar';
  mapStatus?: 'aproximada' | 'pendiente';
  spoilerLevel?: 'sin-spoiler' | 'inicio-de-la-obra' | 'intermedio' | 'final-de-la-obra' | 'spoiler-total';
  references?: Array<{
    kind: 'libro' | 'serie';
    work: string;
    detail: string;
    spoilerLevel: 'sin-spoiler' | 'inicio-de-la-obra' | 'intermedio' | 'final-de-la-obra' | 'spoiler-total';
  }>;
  wikidataId?: string;
  sourceCategories?: string[];
};
