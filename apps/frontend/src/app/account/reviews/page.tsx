import type { Metadata } from 'next';
import { Star, ShieldCheck } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Rating, Badge } from '@tienda/ui';
import { AccountEmptyState, accountReviews, statusLabels } from '@components/account';

export const metadata: Metadata = {
  title: 'Reseñas — Tienda',
  robots: { index: false, follow: false },
};

export default function ReviewsPage() {
  if (accountReviews.length === 0) {
    return (
      <AccountEmptyState
        icon={Star}
        title="Sin reseñas"
        description="Tus reseñas de productos comprados aparecerán acá."
        actionLabel="Ver pedidos"
        actionHref="/account/orders"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Mis reseñas</h1>
      <div className="space-y-3">
        {accountReviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-background p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="shrink-0 w-14 h-14 rounded-lg bg-muted overflow-hidden">
                <img src={review.productImage} alt={review.productName} className="h-full w-full object-cover" draggable={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{review.productName}</p>
                    <Rating value={review.rating} size="sm" className="mt-1" />
                  </div>
                  <Badge variant={review.status === 'approved' ? 'success' : review.status === 'pending' ? 'warning' : 'danger'} size="sm">
                    {statusLabels[review.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
