import { Package } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { formatPrice, Badge } from '@tienda/ui';
import { statusLabels } from '../mock-data';
import type { AccountOrder } from '../mock-data';

type OrderCardProps = {
  order: AccountOrder;
  className?: string;
};

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  delivered: 'success', transit: 'info', shipped: 'info',
  confirmed: 'default', preparing: 'warning', cancelled: 'danger',
};

export function OrderCard({ order, className }: OrderCardProps) {
  return (
    <a
      href={`/account/orders/${order.id}`}
      className={cn(
        'block rounded-xl border border-border bg-background p-4 sm:p-5 transition-all hover:shadow-sm hover:border-primary/30',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{order.number}</span>
            <Badge variant={statusVariants[order.status] ?? 'default'} size="sm">
              {statusLabels[order.status] ?? order.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
        </div>
        <span className="text-sm font-bold text-foreground shrink-0">{formatPrice(order.total)}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i} className="shrink-0 w-10 h-10 rounded-lg bg-muted overflow-hidden">
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" draggable={false} />
          </div>
        ))}
        {order.items.length > 3 && (
          <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{order.paymentMethod}</span>
        <span>{order.shippingMethod}</span>
      </div>
    </a>
  );
}
