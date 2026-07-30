'use client';

import { useState } from 'react';
import { Truck, Package, Store, MapPin } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input, Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { shippingOptions } from '../mock-data';
import type { ShippingOption } from '../mock-data';

type ShippingCalculatorProps = {
  className?: string;
  onSelect?: (option: ShippingOption) => void;
};

const icons: Record<string, React.ReactNode> = {
  'Envío estándar': <Package className="h-4 w-4" />,
  'Envío express': <Truck className="h-4 w-4" />,
  'Envío prioritario': <Truck className="h-4 w-4" />,
  'Retiro en sucursal': <Store className="h-4 w-4" />,
};

export function ShippingCalculator({ className, onSelect }: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSearch = () => {
    if (postalCode.trim().length >= 4) setSearched(true);
  };

  const handleSelect = (opt: ShippingOption) => {
    setSelected(opt.id);
    onSelect?.(opt);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
        Envío
      </h3>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Código postal"
            value={postalCode}
            onChange={(e) => { setPostalCode(e.target.value); setSearched(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="pl-9"
            aria-label="Código postal"
            aria-invalid={searched && shippingOptions.length === 0 ? 'true' : undefined}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSearch} disabled={postalCode.trim().length < 4}>
          Calcular
        </Button>
      </div>

      {searched && (
        <div className="space-y-2" role="radiogroup" aria-label="Opciones de envío">
          {shippingOptions.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                selected === opt.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/30',
              )}
            >
              <input
                type="radio"
                name="shipping"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => handleSelect(opt)}
                className="h-4 w-4 shrink-0 accent-primary"
                aria-label={opt.method}
              />
              <span className="shrink-0 text-muted-foreground">{icons[opt.method]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{opt.method}</p>
                <p className="text-xs text-muted-foreground">{opt.provider} • {opt.estimatedDays}</p>
              </div>
              <span className={cn('shrink-0 text-sm font-semibold ml-2', opt.cost === 0 ? 'text-success' : 'text-foreground')}>
                {opt.cost === 0 ? 'Gratis' : formatPrice(opt.cost)}
              </span>
            </label>
          ))}
        </div>
      )}

      {!searched && (
        <p className="text-xs text-muted-foreground">
          Ingresá tu código postal para ver opciones de envío
        </p>
      )}
    </div>
  );
}
