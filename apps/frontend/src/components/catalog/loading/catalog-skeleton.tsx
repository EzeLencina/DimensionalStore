import { cn } from '@lib/helpers/cn';
import { Skeleton } from '@tienda/ui';

type CatalogSkeletonProps = {
  viewMode?: 'grid' | 'list';
  className?: string;
};

function ProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  const isGrid = viewMode === 'grid';

  return (
    <div className={cn(
      'rounded-xl border border-border bg-background overflow-hidden',
      isGrid ? 'flex flex-col' : 'flex flex-row',
    )}>
      <div className={cn('shrink-0', isGrid ? 'w-full aspect-square' : 'w-36 sm:w-48 md:w-56')}>
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className={cn('flex flex-col flex-1 gap-2', isGrid ? 'p-3 sm:p-4' : 'p-3 sm:p-4 justify-center')}>
        <Skeleton className="h-3 w-16" />
        <Skeleton className={cn('h-4', isGrid ? 'w-full' : 'w-3/4')} />
        <Skeleton className="h-3 w-20" />
        <Skeleton className={cn('h-5', isGrid ? 'w-24' : 'w-32')} />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-20" />
        {isGrid && (
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-9" />
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1.5 pl-1">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-3.5 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <Skeleton className="h-9 w-44" />
    </div>
  );
}

export function CatalogSkeleton({ viewMode = 'grid', className }: CatalogSkeletonProps) {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Cargando productos...">
      <span className="sr-only">Cargando productos...</span>
      <ToolbarSkeleton />

      <div className="flex gap-6">
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <SidebarSkeleton />
        </div>

        <div className={cn(
          'flex-1',
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
            : 'flex flex-col gap-3',
        )}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
}
