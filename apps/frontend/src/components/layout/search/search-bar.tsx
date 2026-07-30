'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, Mic, Image as ImageIcon } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { popularSearches } from '@lib/layout/navigation';

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
};

export function SearchBar({ className, placeholder = 'Buscar productos, marcas y más...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState<string[]>(['RTX 5090', 'Ryzen 7 9800X3D', 'SSD 2TB']);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch?.(query.trim());
        setIsFocused(false);
      }
    },
    [query, onSearch],
  );

  const showPanel = isFocused && (query.length >= 2 || isFocused);

  return (
    <div className={cn('relative w-full max-w-2xl', className)} role="search">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-muted/50 pl-10 pr-10 text-sm',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background',
              'hover:border-foreground/20',
              'transition-all duration-200',
            )}
            aria-label="Search products"
            aria-expanded={showPanel}
            aria-controls="search-panel"
            aria-autocomplete="list"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {showPanel && (
        <div
          id="search-panel"
          ref={panelRef}
          role="listbox"
          className={cn(
            'absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-popover p-4 shadow-lg',
            'animate-in fade-in-0 slide-in-from-top-2 duration-200',
            'z-50',
          )}
        >
          {query.length >= 2 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sugerencias</span>
              </div>
              <ul className="space-y-1">
                {popularSearches
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 6)
                  .map((suggestion) => (
                    <li key={suggestion}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(suggestion);
                          onSearch?.(suggestion);
                          setIsFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        role="option"
                        aria-selected={false}
                      >
                        {suggestion}
                      </button>
                    </li>
                  ))}
              </ul>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Voice search"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Buscar por voz</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Image search"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Buscar por imagen</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {recentSearches.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recientes</span>
                  </div>
                  <ul className="space-y-1">
                    {recentSearches.map((search) => (
                      <li key={search}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(search);
                            onSearch?.(search);
                            setIsFocused(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          role="option"
                        >
                          {search}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="flex items-center gap-2 mb-3 mt-4">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tendencias</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 8).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      onSearch?.(term);
                      setIsFocused(false);
                    }}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Voice search"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>Buscar por voz</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Image search"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Buscar por imagen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
