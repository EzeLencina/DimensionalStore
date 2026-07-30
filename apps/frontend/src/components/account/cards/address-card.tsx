import { MapPin, Home, Building, Store, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Badge, Button } from '@tienda/ui';
import { statusLabels } from '../mock-data';
import type { AccountAddress } from '../mock-data';

type AddressCardProps = {
  address: AccountAddress;
  className?: string;
};

const typeIcons = { home: Home, work: Building, branch: Store };

export function AddressCard({ address, className }: AddressCardProps) {
  const Icon = typeIcons[address.type];

  return (
    <div className={cn('rounded-xl border border-border bg-background p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{statusLabels[address.type]}</span>
              {address.isDefault && <Badge variant="info" size="sm">Predeterminada</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{address.recipient}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
        <p className="flex items-start gap-2">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{address.street} {address.number}{address.floor ? `, Piso ${address.floor}` : ''}{address.apartment ? `, Depto ${address.apartment}` : ''}</span>
        </p>
        <p className="ml-5.5">{address.city}, {address.province} · CP {address.postalCode}</p>
        <p className="ml-5.5">{address.phone}</p>
        {address.reference && <p className="ml-5.5 text-xs">Ref: {address.reference}</p>}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
        <Button variant="ghost" size="xs" className="text-xs">
          <Pencil className="h-3 w-3" />
          Editar
        </Button>
        <Button variant="ghost" size="xs" className="text-xs text-destructive">
          <Trash2 className="h-3 w-3" />
          Eliminar
        </Button>
        {!address.isDefault && (
          <Button variant="ghost" size="xs" className="text-xs ml-auto">
            Establecer como predeterminada
          </Button>
        )}
      </div>
    </div>
  );
}
