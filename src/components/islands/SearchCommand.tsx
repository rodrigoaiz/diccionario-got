import { useEffect, useRef, useState } from 'react';
import type { DictionaryEntry } from '../../data/entries';
import { getContinuityLabel } from '../../data/entryPresentation';
import Icon from '../ui/Icon';

type Props = {
  entries: DictionaryEntry[];
};

function normalize(value: string) {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export default function SearchCommand({ entries }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = normalize(query.trim());
  const results = entries
    .filter((entry) => {
      const isVisible = entry.type !== 'Pendiente';
      const searchableText = normalize(
        [entry.nameEs, entry.nameEn, ...entry.aliases, entry.region, entry.continuity].join(' '),
      );
      return isVisible && (!normalizedQuery || searchableText.includes(normalizedQuery));
    })
    .slice(0, 6);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add('search-command-open');
    inputRef.current?.focus();

    return () => {
      document.body.classList.remove('search-command-open');
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="header-search"
        type="button"
        aria-label="Abrir búsqueda"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setIsOpen(true)}
      >
        <Icon name="search" size={17} />
        <span className="header-search-label">Buscar</span>
        <kbd>Ctrl K</kbd>
      </button>

      {isOpen && (
        <div
          className="search-command-layer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section className="search-command" role="dialog" aria-modal="true" aria-labelledby="global-search-command-title">
            <div className="search-command-header">
              <div>
                <span className="eyebrow">Atajo de búsqueda</span>
                <h2 id="global-search-command-title">Encuentra una entrada</h2>
              </div>
              <button className="search-command-close" type="button" aria-label="Cerrar búsqueda" onClick={() => setIsOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="search-command-field-wrap">
              <span className="search-mark"><Icon name="search" size={22} /></span>
              <label className="sr-only" htmlFor="global-search-command-input">Buscar en el diccionario</label>
              <input
                id="global-search-command-input"
                ref={inputRef}
                className="search-command-field"
                type="search"
                placeholder="Escribe un personaje, lugar, casa o alias..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd>Esc</kbd>
            </div>

            <div className="search-command-results" aria-label="Resultados rápidos">
              {results.length > 0 ? (
                results.map((entry, index) => (
                  <a className="command-result" href={`/diccionario/${entry.slug}/`} key={entry.slug} onClick={() => setIsOpen(false)}>
                    <span className={`result-index accent-${entry.accent}`}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="command-result-copy">
                      <span className="command-result-name">
                        <strong>{entry.nameEs}</strong>
                        {entry.nameEn && <small>{entry.nameEn}</small>}
                      </span>
                      <span className="command-result-meta">{entry.type} · {getContinuityLabel(entry.continuity)}</span>
                    </span>
                    <span className="result-arrow"><Icon name="arrow-up-right" size={18} /></span>
                  </a>
                ))
              ) : (
                <p className="search-command-empty">No encontramos una entrada con ese nombre.</p>
              )}
            </div>

            <div className="search-command-footer">
              <span>Escribe para filtrar resultados</span>
              <span><kbd>Esc</kbd> cerrar</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
