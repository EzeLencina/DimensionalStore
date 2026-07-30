'use client';

import { useState } from 'react';
import { Ticket, X, Check } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input, Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { mockCoupons } from '../mock-data';
import type { AppliedCoupon } from '../mock-data';

type CouponProps = {
  className?: string;
  onApply?: (coupon: AppliedCoupon) => void;
  onRemove?: () => void;
};

export function Coupon({ className, onApply, onRemove }: CouponProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      const found = mockCoupons.find((c) => c.code === trimmed);
      if (found) {
        const coupon: AppliedCoupon = {
          code: found.code,
          discount: found.discount,
          discountType: found.type,
          label: found.label,
        };
        setApplied(coupon);
        setCode('');
        onApply?.(coupon);
      } else {
        setError('Cupón inválido o expirado');
      }
      setLoading(false);
    }, 500);
  };

  const handleRemove = () => {
    setApplied(null);
    setCode('');
    setError('');
    onRemove?.();
  };

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
        <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
        Cupón de descuento
      </h3>

      {applied ? (
        <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Check className="h-4 w-4 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-success truncate">{applied.code}</p>
              <p className="text-xs text-muted-foreground">{applied.label}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Eliminar cupón"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Ingresá tu cupón"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
              aria-label="Código de cupón"
              aria-invalid={error ? 'true' : undefined}
              className={cn(error && 'border-destructive')}
            />
            {error && (
              <p className="absolute -bottom-4 left-0 text-xs text-destructive">{error}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleApply}
            disabled={loading || !code.trim()}
          >
            {loading ? '...' : 'Aplicar'}
          </Button>
        </div>
      )}
    </div>
  );
}
