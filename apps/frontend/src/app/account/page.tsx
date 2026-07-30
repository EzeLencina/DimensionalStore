import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, Clock, Heart, ShieldCheck, LifeBuoy, ArrowRight } from 'lucide-react';
import { formatPrice } from '@tienda/ui';
import { StatsCard } from '@components/account/cards';
import { OrderCard } from '@components/account/cards';
import { accountOrders, dashboardStats } from '@components/account/mock-data';

export const metadata: Metadata = {
  title: 'Dashboard — Mi Cuenta | Tienda',
  robots: { index: false, follow: false },
};

export default function AccountDashboardPage() {
  const recentOrders = accountOrders.slice(0, 3);
  const pendingOrders = accountOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumen de tu actividad en Tienda</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard icon={ShoppingBag} label="Pedidos realizados" value={dashboardStats.totalOrders} href="/account/orders" />
        <StatsCard icon={Clock} label="Pedidos pendientes" value={dashboardStats.pendingOrders} variant="warning" href="/account/orders" />
        <StatsCard icon={Heart} label="Favoritos" value={dashboardStats.favoritesCount} href="/account/favorites" />
        <StatsCard icon={ShieldCheck} label="Garantías activas" value={dashboardStats.activeWarranties} variant="success" href="/account/warranties" />
        <StatsCard icon={LifeBuoy} label="Tickets abiertos" value={dashboardStats.openTickets} variant="danger" href="/account/support" />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Pedidos recientes</h2>
        {pendingOrders.length > 0 && (
          <Link href="/account/orders" className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {recentOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
