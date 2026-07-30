'use client';

import { useState } from 'react';
import { User, Mail, Phone, CreditCard, FileText } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input, Button } from '@tienda/ui';
import { FieldError } from '../errors';
import { mockCustomer } from '../mock-data';
import type { CheckoutCustomer } from '../mock-data';

type CustomerFormProps = {
  onNext: (data: CheckoutCustomer) => void;
  onBack?: () => void;
  className?: string;
};

export function CustomerForm({ onNext, onBack, className }: CustomerFormProps) {
  const [form, setForm] = useState<CheckoutCustomer>(mockCustomer);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutCustomer, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};

    if (!form.firstName.trim()) e.firstName = 'El nombre es obligatorio';
    if (!form.lastName.trim()) e.lastName = 'El apellido es obligatorio';
    if (!form.email.trim()) e.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.phone.trim()) e.phone = 'El teléfono es obligatorio';
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Teléfono inválido';
    if (!form.documentNumber.trim()) e.documentNumber = 'El documento es obligatorio';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext(form);
  };

  const update = <K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Información del cliente</h2>
        <p className="text-sm text-muted-foreground mt-1">Completá tus datos para continuar con la compra</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="firstName" placeholder="Juan" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.firstName} />
          </div>
          <FieldError message={errors.firstName} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">Apellido</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="lastName" placeholder="Pérez" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.lastName} />
          </div>
          <FieldError message={errors.lastName} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="email" type="email" placeholder="juan@ejemplo.com" value={form.email} onChange={(e) => update('email', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.email} />
          </div>
          <FieldError message={errors.email} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="phone" type="tel" placeholder="1155551234" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.phone} />
          </div>
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="documentType" className="text-sm font-medium text-foreground">Tipo de documento</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select id="documentType" value={form.documentType} onChange={(e) => update('documentType', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none" aria-label="Tipo de documento">
              <option value="DNI">DNI</option>
              <option value="CUIL">CUIL</option>
              <option value="CUIT">CUIT</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="documentNumber" className="text-sm font-medium text-foreground">Número de documento</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="documentNumber" placeholder="30123456" value={form.documentNumber} onChange={(e) => update('documentNumber', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.documentNumber} />
          </div>
          <FieldError message={errors.documentNumber} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        {onBack ? (
          <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
        ) : <div />}
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
