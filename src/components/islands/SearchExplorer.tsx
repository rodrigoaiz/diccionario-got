import { useEffect, useRef, useState } from 'react';
import type { DictionaryEntry, EntryType } from '../../data/entries';
import { getContinuityLabel, getEntrySummary, getRegionLabel } from '../../data/entryPresentation';
import Icon from '../ui/Icon';

const filterOptions: Array<{ label: string; value: 'Todos' | EntryType }> = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Personajes', value: 'Personaje' },
  { label: 'Lugares', value: 'Lugar' },
  { label: 'Casas', value: 'Casa' },
  { label: 'Dragones', value: 'Dragon' },
  { label: 'Eventos', value: 'Evento' },
  { label: 'Organizaciones', value: 'Organizacion' },
  { label: 'Conceptos', value: 'Concepto' },
  { label: 'Pendientes', value: 'Pendiente' },
];

const INITIAL_RESULT_LIMIT = 8;

function normalize(value: string) {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

type Props = {
  entries: DictionaryEntry[];
};

export default function SearchExplorer({ entries }: Props) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'Todos' | EntryType>('Todos');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalize(query.trim());

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]');

      if (event.key !== '/' || isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const matchingEntries = entries.filter((entry) => {
    const isVisibleByStatus = entry.type !== 'Pendiente' || activeType === 'Pendiente';
    const matchesType = activeType === 'Todos' || entry.type === activeType;
    const searchableText = normalize(
      [entry.nameEs, entry.nameEn, ...entry.aliases, entry.region, entry.continuity].join(' '),
    );
    return isVisibleByStatus && matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  const hasQueryOrFilter = Boolean(normalizedQuery) || activeType !== 'Todos';
  const visibleEntries = hasQueryOrFilter ? matchingEntries : matchingEntries.slice(0, INITIAL_RESULT_LIMIT);

  const formatEntryCount = (count: number) => `${count} ${count === 1 ? 'entrada' : 'entradas'}`;

  return (
    <div className="dictionary-explorer">
      <div className="explorer-toolbar">
        <div className="search-field-wrap">
          <label className="sr-only" htmlFor="dictionary-search">
            Buscar en el diccionario
          </label>
          <span className="search-mark"><Icon name="search" size={22} /></span>
          <input
            id="dictionary-search"
            className="search-field"
            type="search"
            placeholder="Busca en español, inglés o por alias..."
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>/</kbd>
        </div>
        <p className="search-count" aria-live="polite">
          {hasQueryOrFilter
            ? formatEntryCount(visibleEntries.length)
            : `${visibleEntries.length} de ${formatEntryCount(matchingEntries.length)}`}
        </p>
      </div>

      <div className="filter-row" aria-label="Filtrar por tipo">
        <span className="filter-label">Explorar por tipo</span>
        <div className="filter-buttons">
          {filterOptions.map((filter) => (
            <button
              className={`filter-button ${activeType === filter.value ? 'selected' : ''}`}
              type="button"
              key={filter.value}
              aria-pressed={activeType === filter.value}
              onClick={() => setActiveType(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="result-list" aria-live="polite">
        {visibleEntries.length > 0 ? (
          visibleEntries.map((entry, index) => (
            <a className={`result-row ${index === 0 ? 'first' : ''}`} href={`/diccionario/${entry.slug}/`} key={entry.slug}>
              <span className={`result-index accent-${entry.accent}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className="result-main">
                <span className="result-name-line">
                  <strong>{entry.nameEs}</strong>
                  {entry.nameEn && <span className="result-english">{entry.nameEn}</span>}
                </span>
                <span className="result-summary">{getEntrySummary(entry)}</span>
                <span className="result-meta">
                  <span>{entry.type}</span>
                  <span>{getContinuityLabel(entry.continuity)}</span>
                  <span>{getRegionLabel(entry.region)}</span>
                </span>
              </span>
            <span className="result-arrow"><Icon name="arrow-up-right" size={18} /></span>
            </a>
          ))
        ) : (
          <div className="empty-results">
            <span className="empty-symbol"><Icon name="empty" size={28} /></span>
            <div>
              <strong>No encontramos esa entrada todavía.</strong>
              <p>Prueba con otro nombre, una traducción inglesa o un alias.</p>
            </div>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setQuery('');
                setActiveType('Todos');
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {!hasQueryOrFilter && (
        <p className="explorer-footnote">
          Mostrando las primeras {visibleEntries.length} entradas. Escribe para buscar en el índice completo.
        </p>
      )}
    </div>
  );
}
