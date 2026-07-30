import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { Button } from '@tienda/ui';
import { AddressCard, AccountEmptyState, accountAddresses } from '@components/account';

export const metadata: Metadata = {
  title: 'Direcciones — Tienda',
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  if (accountAddresses.length === 0) {
    return (
      <AccountEmptyState
        title="Sin direcciones guardadas"
        description="Agregá una dirección para recibir tus pedidos."
        actionLabel="Agregar dirección"
        actionHref="#"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Direcciones</h1>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accountAddresses.map((addr) => (
          <AddressCard key={addr.id} address={addr} />
        ))}
      </div>
    </div>
  );
}
