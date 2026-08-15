import type { DictionaryEntry } from './entries';

export function isPendingEntry(entry: Pick<DictionaryEntry, 'summary' | 'continuity' | 'region'>) {
  return (
    entry.summary.startsWith('Entrada importada desde MediaWiki') ||
    entry.continuity === 'Pendiente de asignar' ||
    entry.region === 'Pendiente de asignar'
  );
}

export function getEntrySummary(entry: DictionaryEntry) {
  if (!isPendingEntry(entry)) return entry.summary;

  return 'Ficha pendiente de revisión editorial. El nombre y su equivalencia ya están registrados; el contexto se completará más adelante.';
}

export function getContinuityLabel(value: string) {
  return value === 'Pendiente de asignar' ? 'Continuidad pendiente' : value;
}

export function getRegionLabel(value: string) {
  return value === 'Pendiente de asignar' ? 'Región pendiente' : value;
}
