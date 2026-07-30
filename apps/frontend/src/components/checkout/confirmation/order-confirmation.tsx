import { CheckCircle, Package, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { mockCartItems, defaultCartSummary } from '@components/cart';
import { mockOrderNumber } from '../mock-data';
import type { CheckoutShippingMethod, CheckoutPaymentMethod } from '../mock-data';

type OrderConfirmationProps = {
  shippingMethod?: CheckoutShippingMethod | null;
  paymentMethod?: CheckoutPaymentMethod | null;
  onContinueShopping?: () => void;
  className?: string;
};

export function OrderConfirmation({
  shippingMethod,
  paymentMethod,
  onContinueShopping,
  className,
}: OrderConfirmationProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div className="flex flex-col items-center text-center py-6 sm:py-8">
        <div className="mb-4 rounded-full bg-success/10 p-4">
          <CheckCircle className="h-10 w-10 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          ¡Pedido confirmado!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Recibimos tu pedido correctamente. Te enviamos un email con los detalles a tu correo electrónico.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono font-medium text-foreground">{mockOrderNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4 space-y-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Método de pago</p>
          <p className="text-sm font-semibold text-foreground">{paymentMethod?.name ?? 'Tarjeta de crédito'}</p>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Envío</p>
          <p className="text-sm font-semibold text-foreground">{shippingMethod?.name ?? 'Envío estándar'}</p>
          <p className="text-xs text-muted-foreground">{shippingMethod?.estimatedDays ?? '5-7 días hábiles'}</p>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Productos</p>
          <p className="text-sm font-semibold text-foreground">{mockCartItems.length} {mockCartItems.length === 1 ? 'producto' : 'productos'}</p>
          <p className="text-xs text-muted-foreground">Total: {formatPrice(defaultCartSummary.total)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Resumen del pedido</h3>
        {mockCartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-muted overflow-hidden">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" draggable={false} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-1">{item.name}</p>
              <p className="text-xs text-muted-foreground">Cant: {item.quantity} x {formatPrice(item.price)}</p>
            </div>
            <span className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button onClick={onContinueShopping} asChild>
          <a href="/catalogo">Seguir comprando</a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`/pedido/${mockOrderNumber}`} onClick={(e) => e.preventDefault()}>
            Ver detalle del pedido
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
