'use client';

import { useState } from 'react';
import { Gift, X, Check } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input, Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { mockGiftCards } from '../mock-data';
import type { AppliedGiftCard } from '../mock-data';

type GiftCardProps = {
  className?: string;
  onApply?: (giftCard: AppliedGiftCard) => void;
  onRemove?: () => void;
};

export function GiftCard({ className, onApply, onRemove }: GiftCardProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<AppliedGiftCard | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    setTimeout(() => {
      const found = mockGiftCards.find((g) => g.code === trimmed);
      if (found) {
        setApplied({
          code: found.code,
          amount: found.amount,
          balance: found.amount,
        });
        setCode('');
        onApply?.({
          code: found.code,
          amount: found.amount,
          balance: found.amount,
        });
      } else {
        setError('Gift Card inválida o sin saldo');
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
        <Gift className="h-3.5 w-3.5 text-muted-foreground" />
        Gift Card
      </h3>

      {applied ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Check className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm font-medium text-primary truncate">{applied.code}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Eliminar Gift Card"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Aplicado:</span>
            <span className="font-medium text-foreground">{formatPrice(applied.amount)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Saldo restante:</span>
            <span className="font-medium text-foreground">{formatPrice(applied.balance)}</span>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Código de Gift Card"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
              aria-label="Código de Gift Card"
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
