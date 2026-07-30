import type { Metadata } from 'next';
import { User, Mail, Phone, CreditCard, Calendar } from 'lucide-react';
import { accountUser } from '@components/account/mock-data';

export const metadata: Metadata = {
  title: 'Mi Perfil — Tienda',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  const fields = [
    { icon: User, label: 'Nombre', value: `${accountUser.firstName} ${accountUser.lastName}` },
    { icon: Mail, label: 'Email', value: accountUser.email },
    { icon: Phone, label: 'Teléfono', value: accountUser.phone },
    { icon: CreditCard, label: 'Documento', value: `${accountUser.documentType} ${accountUser.documentNumber}` },
    { icon: Calendar, label: 'Miembro desde', value: accountUser.createdAt },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Mi perfil</h1>

      <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
        <div className="flex items-center gap-4 pb-5 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{accountUser.firstName[0]}{accountUser.lastName[0]}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{accountUser.firstName} {accountUser.lastName}</p>
            <p className="text-sm text-muted-foreground">{accountUser.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <field.icon className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
