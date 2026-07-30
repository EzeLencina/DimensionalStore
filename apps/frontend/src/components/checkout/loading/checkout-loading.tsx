import { cn } from '@lib/helpers/cn';
import { Skeleton } from '@tienda/ui';

type CheckoutLoadingProps = { className?: string };

function FieldSkeleton() {
  return (
    <div className="space-y-1.5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

export function CheckoutLoading({ className }: CheckoutLoadingProps) {
  return (
    <div className={cn('space-y-6', className)} role="status" aria-label="Cargando checkout">
      <div className="sr-only">Cargando...</div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-20 sm:w-28 rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 rounded-xl border border-border p-4 sm:p-5">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FieldSkeleton key={i} />
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-3 rounded-xl border border-border p-4 sm:p-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
