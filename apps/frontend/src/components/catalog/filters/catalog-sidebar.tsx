'use client';

import { useState } from 'react';
import { X, ChevronDown, Minus, Plus } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { filterDefinitions, type FilterDefinition } from '@lib/catalog/mock-data';
import { Button, Checkbox, Rating } from '@tienda/ui';

type CatalogSidebarProps = {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

function FilterSection({ def }: { def: FilterDefinition }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2 py-2"
        aria-expanded={expanded}
      >
        {def.label}
        {expanded ? <Minus className="h-3.5 w-3.5 text-muted-foreground" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 px-1">
          {def.type === 'checkbox' && def.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox value={opt.value} />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{opt.label}</span>
              <span className="text-xs text-muted-foreground">({opt.count})</span>
            </label>
          ))}

          {def.type === 'rating' && def.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox value={opt.value} />
              <Rating value={Number(opt.value)} size="sm" className="flex-1" />
              <span className="text-xs text-muted-foreground">({opt.count})</span>
            </label>
          ))}

          {def.type === 'range' && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={`$${def.min?.toLocaleString()}`}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${def.label} mínimo`}
                />
                <span className="text-muted-foreground text-xs">a</span>
                <input
                  type="number"
                  placeholder={`$${def.max?.toLocaleString()}`}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${def.label} máximo`}
                />
              </div>
              <Button size="sm" variant="outline" fullWidth>Aplicar</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CatalogSidebar({ className, isMobileOpen, onMobileClose }: CatalogSidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} aria-hidden="true" />
      )}

      <aside
        className={cn(
          'w-full lg:w-64 shrink-0',
          'fixed lg:sticky top-0 lg:top-24 left-0 z-50 lg:z-0',
          'h-full lg:h-auto',
          'bg-background lg:bg-transparent',
          'overflow-y-auto lg:overflow-visible',
          'transform transition-transform duration-300 lg:transform-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className,
        )}
        aria-label="Product filters"
      >
        <div className="flex items-center justify-between p-4 lg:p-0 lg:mb-4 border-b lg:border-b-0 border-border">
          <span className="text-sm font-semibold">Filtros</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 lg:px-0">
          {filterDefinitions.map((def) => (
            <FilterSection key={def.id} def={def} />
          ))}
        </div>

        <div className="p-4 lg:p-0 lg:pt-4 space-y-2 lg:sticky lg:bottom-0 lg:bg-background">
          <Button size="sm" variant="outline" fullWidth>
            Limpiar filtros
          </Button>
          <Button size="sm" fullWidth className="lg:hidden" onClick={onMobileClose}>
            Ver resultados
          </Button>
        </div>
      </aside>
    </>
  );
}
