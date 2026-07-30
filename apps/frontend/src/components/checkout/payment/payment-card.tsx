'use client';

import { useState } from 'react';
import { CreditCard, Calendar, Lock, User } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input } from '@tienda/ui';
import { FieldError } from '../errors';
import { cardBrands } from '../mock-data';

type PaymentCardProps = {
  onComplete?: () => void;
  className?: string;
};

type CardForm = {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  installments: string;
};

export function PaymentCard({ onComplete, className }: PaymentCardProps) {
  const [form, setForm] = useState<CardForm>({ number: '', holderName: '', expiry: '', cvv: '', installments: '1' });
  const [errors, setErrors] = useState<Partial<Record<keyof CardForm, string>>>({});

  const brand = cardBrands.find((b) => b.pattern.test(form.number.replace(/\s/g, '')))?.name ?? '';

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (form.number.replace(/\s/g, '').length < 13) e.number = 'Número de tarjeta inválido';
    if (!form.holderName.trim()) e.holderName = 'Nombre del titular obligatorio';
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'Fecha inválida (MM/AA)';
    if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = 'CVV inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const update = (key: keyof CardForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleBlur = () => {
    if (Object.values(form).every((v) => v.length > 0)) {
      if (validate()) onComplete?.();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative rounded-xl bg-gradient-to-br from-primary/90 to-primary p-4 sm:p-5 text-primary-foreground min-h-[160px]">
        <div className="flex justify-between items-start">
          <span className="text-xs font-medium opacity-80">Tarjeta de crédito</span>
          {brand && <span className="text-xs font-bold">{brand}</span>}
        </div>
        <p className="text-lg sm:text-xl font-mono tracking-widest mt-4">
          {form.number || '•••• •••• •••• ••••'}
        </p>
        <div className="flex justify-between mt-3 text-xs">
          <div className="min-w-0 flex-1">
            <p className="opacity-70">Titular</p>
            <p className="font-medium truncate">{form.holderName || 'Nombre del titular'}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="opacity-70">Vence</p>
            <p className="font-medium">{form.expiry || 'MM/AA'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="cardNumber" className="text-xs font-medium text-foreground">Número de tarjeta</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={form.number} onChange={(e) => update('number', formatCardNumber(e.target.value))} onBlur={handleBlur} className="pl-9 font-mono" maxLength={19} aria-invalid={!!errors.number} inputMode="numeric" />
          </div>
          <FieldError message={errors.number} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="holderName" className="text-xs font-medium text-foreground">Nombre del titular</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="holderName" placeholder="JUAN PEREZ" value={form.holderName} onChange={(e) => update('holderName', e.target.value.toUpperCase())} onBlur={handleBlur} className="pl-9 font-mono text-sm" aria-invalid={!!errors.holderName} />
          </div>
          <FieldError message={errors.holderName} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="expiry" className="text-xs font-medium text-foreground">Vencimiento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="expiry" placeholder="MM/AA" value={form.expiry} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); update('expiry', v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v); }} onBlur={handleBlur} className="pl-9 font-mono" maxLength={5} aria-invalid={!!errors.expiry} inputMode="numeric" />
          </div>
          <FieldError message={errors.expiry} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cvv" className="text-xs font-medium text-foreground">CVV</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="cvv" type="password" placeholder="***" value={form.cvv} onChange={(e) => update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} onBlur={handleBlur} className="pl-9 font-mono" maxLength={4} aria-invalid={!!errors.cvv} inputMode="numeric" />
          </div>
          <FieldError message={errors.cvv} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="installments" className="text-xs font-medium text-foreground">Cuotas</label>
          <select id="installments" value={form.installments} onChange={(e) => update('installments', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none">
            <option value="1">1 cuota</option>
            <option value="3">3 cuotas sin interés</option>
            <option value="6">6 cuotas sin interés</option>
            <option value="12">12 cuotas sin interés</option>
          </select>
        </div>
      </div>
    </div>
  );
}
