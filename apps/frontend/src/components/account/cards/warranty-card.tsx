import { ShieldCheck, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Badge } from '@tienda/ui';
import { statusLabels } from '../mock-data';
import type { Warranty } from '../mock-data';

type WarrantyCardProps = {
  warranty: Warranty;
  className?: string;
};

const statusVariants: Record<string, 'success' | 'warning' | 'danger'> = {
  active: 'success', expiring: 'warning', expired: 'danger',
};

export function WarrantyCard({ warranty, className }: WarrantyCardProps) {
  return (
    <a
      href={`/producto/${warranty.productSlug}`}
      className={cn('block rounded-xl border border-border bg-background p-4 transition-all hover:shadow-sm', className)}
    >
      <div className="flex gap-3">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-muted overflow-hidden">
          <img src={warranty.image} alt={warranty.productName} className="h-full w-full object-cover" draggable={false} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">{warranty.productName}</p>
              <p className="text-xs text-muted-foreground">SKU: {warranty.sku}</p>
            </div>
            <Badge variant={statusVariants[warranty.status] ?? 'default'} size="sm">
              {statusLabels[warranty.status]}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {warranty.startDate} → {warranty.endDate}
            </span>
          </div>
          {warranty.status === 'expiring' && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-warning font-medium">
              <AlertTriangle className="h-3 w-3" />
              Vence en {warranty.remainingDays} días
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
