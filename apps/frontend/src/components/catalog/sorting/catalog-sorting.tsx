'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { sortOptions } from '@lib/catalog/mock-data';

type CatalogSortingProps = {
  className?: string;
  defaultValue?: string;
};

export function CatalogSorting({ className, defaultValue = 'relevance' }: CatalogSortingProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const current = sortOptions.find((o) => o.value === selected);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="hidden sm:inline text-muted-foreground">Ordenar por:</span>
        <span className="font-medium">{current?.label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} role="presentation" />
          <div
            className="absolute right-0 top-full mt-1 z-20 min-w-[200px] rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 slide-in-from-top-1"
            role="listbox"
            aria-label="Sort options"
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setSelected(opt.value); setOpen(false); }}
                className={cn(
                  'flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors',
                  selected === opt.value ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent text-muted-foreground',
                )}
                role="option"
                aria-selected={selected === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
