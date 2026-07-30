'use client';

import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { CatalogSorting } from '../sorting/catalog-sorting';
import { ActiveFilters } from '../active-filters/active-filters';

type CatalogToolbarProps = {
  totalProducts: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onToggleFilters: () => void;
  className?: string;
};

export function CatalogToolbar({
  totalProducts,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  className,
}: CatalogToolbarProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex lg:hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Catálogo</h1>
            <p className="text-sm text-muted-foreground">
              {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CatalogSorting />

          <div className="hidden sm:flex items-center rounded-lg border border-border">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'rounded-l-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'rounded-r-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ActiveFilters />
    </div>
  );
}
