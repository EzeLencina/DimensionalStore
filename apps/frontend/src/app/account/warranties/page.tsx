import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { WarrantyCard, AccountEmptyState, warranties } from '@components/account';

export const metadata: Metadata = {
  title: 'Garantías — Tienda',
  robots: { index: false, follow: false },
};

export default function WarrantiesPage() {
  if (warranties.length === 0) {
    return (
      <AccountEmptyState
        icon={ShieldCheck}
        title="Sin garantías activas"
        description="Las garantías de tus productos comprados aparecerán acá automáticamente."
        actionLabel="Ver pedidos"
        actionHref="/account/orders"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Garantías</h1>
      <div className="grid grid-cols-1 gap-3">
        {warranties.map((w) => (
          <WarrantyCard key={w.id} warranty={w} />
        ))}
      </div>
    </div>
  );
}
