'use client';

import { useState } from 'react';
import { Package, Truck, Clock, Store, Timer } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { shippingMethods } from '../mock-data';
import type { CheckoutShippingMethod } from '../mock-data';

type ShippingSelectorProps = {
  onNext: (method: CheckoutShippingMethod) => void;
  onBack: () => void;
  className?: string;
};

const icons: Record<string, React.ReactNode> = {
  'Envío estándar': <Package className="h-5 w-5" />,
  'Envío express': <Truck className="h-5 w-5" />,
  'Entrega programada': <Timer className="h-5 w-5" />,
  'Retiro en sucursal': <Store className="h-5 w-5" />,
};

export function ShippingSelector({ onNext, onBack, className }: ShippingSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    const method = shippingMethods.find((m) => m.id === selected);
    if (method) onNext(method);
  };

  return (
    <div className={cn('space-y-5', className)}>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Método de envío</h2>
        <p className="text-sm text-muted-foreground mt-1">Elegí cómo querés recibir tu pedido</p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Métodos de envío">
        {shippingMethods.map((method) => (
          <label
            key={method.id}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:border-muted-foreground/30',
              selected === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
            )}
          >
            <input
              type="radio"
              name="shipping"
              value={method.id}
              checked={selected === method.id}
              onChange={() => setSelected(method.id)}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
              aria-label={method.name}
            />
            <span className="shrink-0 text-muted-foreground mt-0.5">{icons[method.name] ?? <Package className="h-5 w-5" />}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{method.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {method.estimatedDays}
                </span>
                <span>{method.provider}</span>
              </div>
            </div>
            <span className={cn('shrink-0 text-sm font-bold ml-2', method.price === 0 ? 'text-success' : 'text-foreground')}>
              {method.price === 0 ? 'Gratis' : formatPrice(method.price)}
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
        <Button type="button" onClick={handleContinue} disabled={!selected}>Continuar</Button>
      </div>
    </div>
  );
}
