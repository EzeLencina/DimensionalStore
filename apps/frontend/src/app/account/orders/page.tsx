import type { Metadata } from 'next';
import { ShoppingBag } from 'lucide-react';
import { OrderCard, AccountEmptyState, accountOrders } from '@components/account';

export const metadata: Metadata = {
  title: 'Mis Pedidos — Tienda',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  if (accountOrders.length === 0) {
    return (
      <AccountEmptyState
        icon={ShoppingBag}
        title="Todavía no realizaste pedidos"
        description="Explorá nuestro catálogo y descubrí productos de seguridad inteligente y tecnología."
        actionLabel="Ver catálogo"
        actionHref="/catalogo"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Mis pedidos</h1>
      <div className="space-y-3">
        {accountOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
