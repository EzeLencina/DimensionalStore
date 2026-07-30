'use client';

import { useState } from 'react';
import { MapPin, Home, Building, Hash, Navigation } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Input, Button } from '@tienda/ui';
import { FieldError } from '../errors';
import { provinces, mockAddress } from '../mock-data';
import type { CheckoutAddress } from '../mock-data';

type AddressFormProps = {
  onNext: (data: CheckoutAddress) => void;
  onBack: () => void;
  className?: string;
};

const countries = ['Argentina', 'Uruguay', 'Chile', 'Paraguay', 'Bolivia'];

export function AddressForm({ onNext, onBack, className }: AddressFormProps) {
  const [form, setForm] = useState<CheckoutAddress>(mockAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddress, string>>>({});

  const cities = provinces.find((p) => p.name === form.province)?.cities ?? [];

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.country.trim()) e.country = 'Seleccioná un país';
    if (!form.province.trim()) e.province = 'Seleccioná una provincia';
    if (!form.city.trim()) e.city = 'Seleccioná una ciudad';
    if (!form.postalCode.trim()) e.postalCode = 'El código postal es obligatorio';
    if (!form.street.trim()) e.street = 'La calle es obligatoria';
    if (!form.number.trim()) e.number = 'El número es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext(form);
  };

  const update = <K extends keyof CheckoutAddress>(key: K, value: CheckoutAddress[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'province') setForm((prev) => ({ ...prev, city: '' }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Dirección de entrega</h2>
        <p className="text-sm text-muted-foreground mt-1">Indicá dónde querés recibir tu pedido</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="country" className="text-sm font-medium text-foreground">País</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select id="country" value={form.country} onChange={(e) => update('country', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none" aria-required="true" aria-invalid={!!errors.country}>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FieldError message={errors.country} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="province" className="text-sm font-medium text-foreground">Provincia</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select id="province" value={form.province} onChange={(e) => update('province', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none" aria-required="true" aria-invalid={!!errors.province}>
              <option value="">Seleccioná una provincia</option>
              {provinces.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <FieldError message={errors.province} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="city" className="text-sm font-medium text-foreground">Ciudad</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select id="city" value={form.city} onChange={(e) => update('city', e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none" aria-required="true" aria-invalid={!!errors.city}>
              <option value="">Seleccioná una ciudad</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <FieldError message={errors.city} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="postalCode" className="text-sm font-medium text-foreground">Código postal</label>
          <Input id="postalCode" placeholder="1900" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} aria-required="true" aria-invalid={!!errors.postalCode} />
          <FieldError message={errors.postalCode} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="street" className="text-sm font-medium text-foreground">Calle</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="street" placeholder="Av. 7" value={form.street} onChange={(e) => update('street', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.street} />
          </div>
          <FieldError message={errors.street} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="number" className="text-sm font-medium text-foreground">Número</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="number" placeholder="1234" value={form.number} onChange={(e) => update('number', e.target.value)} className="pl-9" aria-required="true" aria-invalid={!!errors.number} />
          </div>
          <FieldError message={errors.number} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="floor" className="text-sm font-medium text-foreground">Piso</label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input id="floor" placeholder="3" value={form.floor} onChange={(e) => update('floor', e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="apartment" className="text-sm font-medium text-foreground">Departamento</label>
          <Input id="apartment" placeholder="B" value={form.apartment} onChange={(e) => update('apartment', e.target.value)} />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="reference" className="text-sm font-medium text-foreground">Referencia</label>
          <Input id="reference" placeholder="Edificio blanco, timbre 3" value={form.reference} onChange={(e) => update('reference', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
