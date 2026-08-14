export type Relationship = {
  source: string;
  sourceLabel: string;
  type: string;
  target: string;
  targetLabel: string;
};

export const relationships: Relationship[] = [
  { source: 'eddard-stark', sourceLabel: 'Eddard Stark', type: 'pertenece_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'catelyn-stark', sourceLabel: 'Catelyn Stark', type: 'vinculada_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'robb-stark', sourceLabel: 'Robb Stark', type: 'pertenece_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'sansa-stark', sourceLabel: 'Sansa Stark', type: 'pertenece_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'bran-stark', sourceLabel: 'Bran Stark', type: 'pertenece_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'arya-stark', sourceLabel: 'Arya Stark', type: 'pertenece_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'jon-snow', sourceLabel: 'Jon Snow', type: 'vinculado_a', target: 'casa-stark', targetLabel: 'Casa Stark' },
  { source: 'daenerys-targaryen', sourceLabel: 'Daenerys Targaryen', type: 'pertenece_a', target: 'casa-targaryen', targetLabel: 'Casa Targaryen' },
  { source: 'tywin-lannister', sourceLabel: 'Tywin Lannister', type: 'pertenece_a', target: 'casa-lannister', targetLabel: 'Casa Lannister' },
  { source: 'jaime-lannister', sourceLabel: 'Jaime Lannister', type: 'pertenece_a', target: 'casa-lannister', targetLabel: 'Casa Lannister' },
  { source: 'cersei-lannister', sourceLabel: 'Cersei Lannister', type: 'pertenece_a', target: 'casa-lannister', targetLabel: 'Casa Lannister' },
  { source: 'tyrion-lannister', sourceLabel: 'Tyrion Lannister', type: 'pertenece_a', target: 'casa-lannister', targetLabel: 'Casa Lannister' },
  { source: 'joffrey-baratheon', sourceLabel: 'Joffrey Baratheon', type: 'pertenece_a', target: 'casa-baratheon', targetLabel: 'Casa Baratheon' },
  { source: 'renly-baratheon', sourceLabel: 'Renly Baratheon', type: 'pertenece_a', target: 'casa-baratheon', targetLabel: 'Casa Baratheon' },
  { source: 'rhaenyra-targaryen', sourceLabel: 'Rhaenyra Targaryen', type: 'pertenece_a', target: 'casa-targaryen', targetLabel: 'Casa Targaryen' },
  { source: 'aegon-targaryen', sourceLabel: 'Aegon Targaryen', type: 'vinculado_a', target: 'casa-targaryen', targetLabel: 'Casa Targaryen' },
  { source: 'casa-stark', sourceLabel: 'Casa Stark', type: 'sede_en', target: 'invernalia', targetLabel: 'Invernalia' },
  { source: 'casa-arryn', sourceLabel: 'Casa Arryn', type: 'sede_en', target: 'nido-de-aguilas', targetLabel: 'Nido de Águilas' },
  { source: 'casa-tyrell', sourceLabel: 'Casa Tyrell', type: 'sede_en', target: 'altojardin', targetLabel: 'Altojardín' },
  { source: 'casa-greyjoy', sourceLabel: 'Casa Greyjoy', type: 'domina', target: 'islas-del-hierro', targetLabel: 'Islas del Hierro' },
  { source: 'casa-martell', sourceLabel: 'Casa Martell', type: 'gobierna', target: 'dorne', targetLabel: 'Dorne' },
  { source: 'casa-targaryen', sourceLabel: 'Casa Targaryen', type: 'sede_historica_en', target: 'rocadragon', targetLabel: 'Rocadragón' },
  { source: 'guardia-de-la-noche', sourceLabel: 'Guardia de la Noche', type: 'custodia', target: 'el-muro', targetLabel: 'El Muro' },
];
