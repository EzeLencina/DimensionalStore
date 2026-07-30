import type { Metadata } from 'next';
import { Bell, ShoppingBag, LifeBuoy, ShieldCheck, Megaphone, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notificaciones — Tienda',
  robots: { index: false, follow: false },
};

const categories = [
  { icon: ShoppingBag, label: 'Pedidos', desc: 'Actualizaciones de estado de tus pedidos' },
  { icon: LifeBuoy, label: 'Soporte', desc: 'Respuestas a tus tickets de soporte' },
  { icon: ShieldCheck, label: 'Garantías', desc: 'Recordatorios de vencimiento de garantías' },
  { icon: Megaphone, label: 'Promociones', desc: 'Ofertas y descuentos exclusivos' },
  { icon: Shield, label: 'Seguridad', desc: 'Alertas de seguridad de tu cuenta' },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Notificaciones</h1>
      <p className="text-sm text-muted-foreground -mt-4">Configurá qué notificaciones querés recibir</p>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.label} className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <cat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                Email
              </label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                WhatsApp
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
