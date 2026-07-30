'use client';

import { useState } from 'react';
import { CreditCard, Banknote, Landmark, Smartphone, Building } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { paymentMethods } from '../mock-data';
import { PaymentCard } from './payment-card';
import type { CheckoutPaymentMethod } from '../mock-data';

type PaymentMethodsProps = {
  onNext: (method: string) => void;
  onBack: () => void;
  className?: string;
};

const methodIcons: Record<string, React.ReactNode> = {
  'credit_card': <CreditCard className="h-5 w-5" />,
  'debit_card': <Banknote className="h-5 w-5" />,
  'mercadopago': <Smartphone className="h-5 w-5" />,
  'modo': <Smartphone className="h-5 w-5" />,
  'bank_transfer': <Building className="h-5 w-5" />,
};

export function PaymentMethods({ onNext, onBack, className }: PaymentMethodsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [cardCompleted, setCardCompleted] = useState(false);

  const handleContinue = () => {
    if (selected === 'credit_card' && !cardCompleted) return;
    if (selected) onNext(selected);
  };

  const currentMethod = paymentMethods.find((m) => m.id === selected);

  return (
    <div className={cn('space-y-5', className)}>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Método de pago</h2>
        <p className="text-sm text-muted-foreground mt-1">Elegí cómo querés pagar</p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Métodos de pago">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:border-muted-foreground/30',
              selected === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border',
            )}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selected === method.id}
              onChange={() => { setSelected(method.id); setCardCompleted(false); }}
              className="h-4 w-4 shrink-0 accent-primary"
              aria-label={method.name}
            />
            <span className="shrink-0 text-muted-foreground">{methodIcons[method.id] ?? <CreditCard className="h-5 w-5" />}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{method.name}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
          </label>
        ))}
      </div>

      {selected === 'credit_card' && (
        <div className="rounded-xl border border-border p-4 sm:p-5 bg-muted/20">
          <PaymentCard onComplete={() => setCardCompleted(true)} />
        </div>
      )}

      {selected && selected !== 'credit_card' && (
        <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
          <div className="flex flex-col items-center text-center py-4 space-y-2">
            {currentMethod && (
              <>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  {methodIcons[selected]}
                </div>
                <p className="text-sm font-medium text-foreground">{currentMethod.name}</p>
                <p className="text-xs text-muted-foreground">Serás redirigido para completar el pago de forma segura.</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
        <Button type="button" onClick={handleContinue} disabled={!selected}>Continuar</Button>
      </div>
    </div>
  );
}
