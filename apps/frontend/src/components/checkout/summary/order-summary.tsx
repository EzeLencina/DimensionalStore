import { cn } from '@lib/helpers/cn';
import { formatPrice } from '@tienda/ui';
import { Totals } from '@components/cart';
import { mockCartItems, defaultCartSummary } from '@components/cart';
import { SecurityBadge } from '../security';
import type { CheckoutShippingMethod, CheckoutPaymentMethod } from '../mock-data';

type OrderSummaryProps = {
  shippingMethod?: CheckoutShippingMethod | null;
  paymentMethod?: CheckoutPaymentMethod | null;
  className?: string;
};

export function OrderSummary({ shippingMethod, paymentMethod, className }: OrderSummaryProps) {
  const summary = {
    ...defaultCartSummary,
    shipping: shippingMethod?.price ?? defaultCartSummary.shipping,
    total: defaultCartSummary.subtotal - defaultCartSummary.discount + (shippingMethod?.price ?? 0),
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-base font-semibold text-foreground">Resumen de compra</h2>

      <div className="space-y-3">
        {mockCartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="shrink-0 w-14 h-14 rounded-lg bg-muted overflow-hidden">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" draggable={false} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
              <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
              <p className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <Totals summary={summary} />
      </div>

      {(shippingMethod || paymentMethod) && (
        <div className="border-t border-border pt-4 space-y-3">
          {shippingMethod && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-foreground text-right">{shippingMethod.name}</span>
            </div>
          )}
          {paymentMethod && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pago</span>
              <span className="text-foreground text-right">{paymentMethod.name}</span>
            </div>
          )}
        </div>
      )}

      <SecurityBadge />
    </div>
  );
}
