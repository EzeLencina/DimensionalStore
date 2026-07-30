import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Package, Truck, CreditCard, MapPin, FileText, ArrowLeft } from 'lucide-react';
import { Badge, Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { OrderTimeline, accountOrders, statusLabels } from '@components/account';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = accountOrders.find((o) => o.id === id);
  return {
    title: order ? `Pedido ${order.number} — Tienda` : 'Pedido no encontrado',
    robots: { index: false, follow: false },
  };
}

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  delivered: 'success', transit: 'info', shipped: 'info',
  confirmed: 'default', preparing: 'warning', cancelled: 'danger',
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = accountOrders.find((o) => o.id === id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <a href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos
      </a>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{order.number}</h1>
            <Badge variant={statusVariants[order.status] ?? 'default'} size="sm">
              {statusLabels[order.status] ?? order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Realizado el {order.date}</p>
        </div>
        {order.invoiceUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={order.invoiceUrl}>
              <FileText className="h-4 w-4" />
              Descargar factura
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Estado del pedido</h2>
            <OrderTimeline events={order.timeline} currentStatus={order.status} />
          </div>

          <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Productos ({order.items.length})</h2>
            <div className="divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="shrink-0 w-14 h-14 rounded-lg bg-muted overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" draggable={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Detalles</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{order.shippingMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-xs">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-success">Descuento</span><span className="text-success">-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Envío</span><span className={order.shipping === 0 ? 'text-success' : ''}>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold">{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
