import { cn } from '@lib/helpers/cn';
import { Skeleton } from '@tienda/ui';

type CartLoadingProps = {
  className?: string;
};

function ItemSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 py-4 sm:py-5 border-b border-border last:border-b-0">
      <Skeleton className="shrink-0 w-20 sm:w-24 aspect-square rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-5 w-20 ml-auto" />
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg mt-4" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function CartLoading({ className }: CartLoadingProps) {
  return (
    <div className={cn('space-y-6', className)} aria-label="Cargando carrito" role="status">
      <div className="sr-only">Cargando carrito de compras...</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-1">
          {[1, 2, 3].map((i) => (
            <ItemSkeleton key={i} />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border p-4 sm:p-5">
            <SummarySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
