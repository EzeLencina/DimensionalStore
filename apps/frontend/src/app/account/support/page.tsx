import type { Metadata } from 'next';
import { LifeBuoy, Plus } from 'lucide-react';
import { Button } from '@tienda/ui';
import { TicketCard, AccountEmptyState, supportTickets } from '@components/account';

export const metadata: Metadata = {
  title: 'Soporte — Tienda',
  robots: { index: false, follow: false },
};

export default function SupportPage() {
  if (supportTickets.length === 0) {
    return (
      <AccountEmptyState
        icon={LifeBuoy}
        title="Sin tickets de soporte"
        description="Si tenés algún problema con tu pedido o producto, creá un ticket y te ayudaremos."
        actionLabel="Crear ticket"
        actionHref="#"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Soporte</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestioná tus consultas y tickets</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Nuevo ticket
        </Button>
      </div>
      <div className="space-y-3">
        {supportTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
