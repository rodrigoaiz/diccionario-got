import { useState } from 'react';
import type { DictionaryEntry, EntryType } from '../../data/entries';

const filterOptions: Array<{ label: string; value: 'Todos' | EntryType }> = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Personajes', value: 'Personaje' },
  { label: 'Lugares', value: 'Lugar' },
  { label: 'Casas', value: 'Casa' },
  { label: 'Dragones', value: 'Dragon' },
  { label: 'Eventos', value: 'Evento' },
];

function normalize(value: string) {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

type Props = {
  entries: DictionaryEntry[];
};

export default function SearchExplorer({ entries }: Props) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'Todos' | EntryType>('Todos');
  const normalizedQuery = normalize(query.trim());

  const visibleEntries = entries.filter((entry) => {
    const matchesType = activeType === 'Todos' || entry.type === activeType;
    const searchableText = normalize(
      [entry.nameEs, entry.nameEn, ...entry.aliases, entry.region, entry.continuity].join(' '),
    );
    return matchesType && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  const hasQueryOrFilter = Boolean(normalizedQuery) || activeType !== 'Todos';

  return (
    <div className="dictionary-explorer">
      <div className="explorer-toolbar">
        <div className="search-field-wrap">
          <label className="sr-only" htmlFor="dictionary-search">
            Buscar en el diccionario
          </label>
          <span className="search-mark" aria-hidden="true">⌕</span>
          <input
            id="dictionary-search"
            className="search-field"
            type="search"
            placeholder="Busca en español, inglés o por alias..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>/</kbd>
        </div>
        <p className="search-count" aria-live="polite">
          {visibleEntries.length} {visibleEntries.length === 1 ? 'entrada' : 'entradas'}
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
                  <span className="result-english">{entry.nameEn}</span>
                </span>
                <span className="result-summary">{entry.summary}</span>
                <span className="result-meta">
                  <span>{entry.type}</span>
                  <span>{entry.continuity}</span>
                  <span>{entry.region}</span>
                </span>
              </span>
              <span className="result-arrow" aria-hidden="true">↗</span>
            </a>
          ))
        ) : (
          <div className="empty-results">
            <span className="empty-symbol" aria-hidden="true">∅</span>
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
          Mostrando una selección inicial. El índice completo crecerá con cada carga editorial.
        </p>
      )}
    </div>
  );
}
