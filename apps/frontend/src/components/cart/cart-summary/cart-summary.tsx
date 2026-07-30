import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { Coupon } from '../coupon';
import { GiftCard } from '../gift-card';
import { ShippingCalculator } from '../shipping';
import { Totals } from '../totals';
import { defaultCartSummary } from '../mock-data';
import type { CartSummary as CartSummaryType } from '../mock-data';

type CartSummaryProps = {
  summary?: CartSummaryType;
  className?: string;
};

export function CartSummary({ summary = defaultCartSummary, className }: CartSummaryProps) {
  return (
    <div className={cn('space-y-5', className)}>
      <h2 className="text-base font-semibold text-foreground">Resumen del pedido</h2>

      <Coupon />
      <GiftCard />
      <ShippingCalculator />

      <div className="border-t border-border pt-4">
        <Totals summary={summary} />
      </div>

      <div className="space-y-2 pt-2">
        <Button size="lg" fullWidth asChild>
          <a href="/checkout" onClick={(e) => e.preventDefault()}>
            Continuar compra
          </a>
        </Button>
        <Button variant="outline" size="md" fullWidth asChild>
          <a href="/catalogo">
            Seguir comprando
          </a>
        </Button>
      </div>
    </div>
  );
}
