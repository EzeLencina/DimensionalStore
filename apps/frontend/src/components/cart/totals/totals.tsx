import { cn } from '@lib/helpers/cn';
import { formatPrice } from '@tienda/ui';
import type { CartSummary } from '../mock-data';

type TotalsProps = {
  summary: CartSummary;
  className?: string;
};

export function Totals({ summary, className }: TotalsProps) {
  const estimatedInstallments = [
    { count: 3, price: Math.round(summary.total / 3) },
    { count: 6, price: Math.round(summary.total / 6) },
    { count: 12, price: Math.round(summary.total / 12) },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({summary.itemCount} {summary.itemCount === 1 ? 'producto' : 'productos'})</span>
          <span className="text-foreground">{formatPrice(summary.subtotal)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-success">Descuento</span>
            <span className="text-success">-{formatPrice(summary.discount)}</span>
          </div>
        )}

        {summary.couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-success">Cupón de descuento</span>
            <span className="text-success">-{formatPrice(summary.couponDiscount)}</span>
          </div>
        )}

        {summary.giftCardAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-primary">Gift Card</span>
            <span className="text-primary">-{formatPrice(summary.giftCardAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Envío</span>
          <span className={cn(summary.shipping === 0 ? 'text-success font-medium' : 'text-foreground')}>
            {summary.shipping === 0 ? 'Gratis' : formatPrice(summary.shipping)}
          </span>
        </div>

        {summary.taxes > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Impuestos</span>
            <span className="text-foreground">{formatPrice(summary.taxes)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">{formatPrice(summary.total)}</span>
        </div>

        {summary.savings > 0 && (
          <p className="text-xs text-success mt-1">
            Ahorrá {formatPrice(summary.savings)} en esta compra
          </p>
        )}
      </div>

      {estimatedInstallments.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cuotas estimadas
          </p>
          <div className="flex flex-wrap gap-2">
            {estimatedInstallments.map((inst) => (
              <div key={inst.count} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{inst.count}x</span> {formatPrice(inst.price)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
