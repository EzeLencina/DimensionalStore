import { MessageSquare, ArrowUpRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Badge, Button } from '@tienda/ui';
import { statusLabels } from '../mock-data';
import type { SupportTicket } from '../mock-data';

type TicketCardProps = {
  ticket: SupportTicket;
  className?: string;
};

const statusVariants: Record<string, 'default' | 'success' | 'danger'> = {
  open: 'default', answered: 'success', closed: 'danger',
};

const priorityVariants: Record<string, 'warning' | 'info' | 'success'> = {
  high: 'warning', medium: 'info', low: 'success',
};

export function TicketCard({ ticket, className }: TicketCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-background p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold text-foreground">{ticket.number}</span>
            <Badge variant={statusVariants[ticket.status] ?? 'default'} size="sm">{statusLabels[ticket.status]}</Badge>
            <Badge variant={priorityVariants[ticket.priority] ?? 'default'} size="sm">{statusLabels[ticket.priority]}</Badge>
          </div>
          <p className="text-sm text-foreground mt-1 line-clamp-1">{ticket.subject}</p>
          <p className="text-xs text-muted-foreground mt-1">{ticket.category} · Última actualización: {ticket.lastUpdate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <Button variant="ghost" size="xs" className="text-xs">
          Ver detalle
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
