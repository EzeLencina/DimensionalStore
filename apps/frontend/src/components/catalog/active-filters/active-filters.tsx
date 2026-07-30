import { X } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';

type ActiveFilter = {
  id: string;
  label: string;
};

type ActiveFiltersProps = {
  filters?: ActiveFilter[];
  className?: string;
};

export function ActiveFilters({ filters = defaultFilters, className }: ActiveFiltersProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs text-muted-foreground font-medium">Filtros activos:</span>
      {filters.map((f) => (
        <span
          key={f.id}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-accent/50 px-2.5 py-1 text-xs font-medium"
        >
          {f.label}
          <button
            type="button"
            className="ml-0.5 rounded-sm p-1 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Remove ${f.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <Button variant="ghost" size="xs" className="text-xs text-muted-foreground">
        Limpiar todos
      </Button>
    </div>
  );
}

const defaultFilters: ActiveFilter[] = [
  { id: 'cat-1', label: 'Cerraduras Inteligentes' },
  { id: 'brand-1', label: 'Yale' },
  { id: 'disc-1', label: '20% o más' },
];
