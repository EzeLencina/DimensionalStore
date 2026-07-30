import { Skeleton } from '@tienda/ui';
import { cn } from '@lib/helpers/cn';

type AccountLoadingProps = { className?: string };

export function AccountLoading({ className }: AccountLoadingProps) {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Cargando">
      <div className="sr-only">Cargando...</div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
