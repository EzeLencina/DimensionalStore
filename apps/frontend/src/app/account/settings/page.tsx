import type { Metadata } from 'next';
import { User, Lock, Bell, Eye, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Configuración — Tienda',
  robots: { index: false, follow: false },
};

const sections: {
  icon: typeof User; label: string; desc: string;
  fields: { label: string; type: string; default?: boolean; value?: string; options?: string[] }[];
}[] = [
  {
    icon: User, label: 'Información personal',
    desc: 'Nombre, email, teléfono y documento',
    fields: [
      { label: 'Recibir emails promocionales', type: 'checkbox', default: true },
      { label: 'Recibir WhatsApp con ofertas', type: 'checkbox', default: false },
    ],
  },
  {
    icon: Lock, label: 'Seguridad',
    desc: 'Contraseña y verificación',
    fields: [
      { label: 'Autenticación en dos pasos', type: 'checkbox', default: false },
    ],
  },
  {
    icon: Bell, label: 'Comunicaciones',
    desc: 'Preferencias de notificaciones',
    fields: [
      { label: 'Notificaciones de pedidos vía email', type: 'checkbox', default: true },
      { label: 'Notificaciones de pedidos vía WhatsApp', type: 'checkbox', default: true },
    ],
  },
  {
    icon: Eye, label: 'Privacidad',
    desc: 'Control de tus datos',
    fields: [
      { label: 'Mostrar mi perfil en reseñas públicas', type: 'checkbox', default: true },
    ],
  },
  {
    icon: Globe, label: 'Preferencias de idioma y moneda',
    desc: 'Configuración regional',
    fields: [
      { label: 'Idioma', type: 'select', value: 'Español (Argentina)', options: ['Español (Argentina)', 'Español', 'English', 'Português'] },
      { label: 'Moneda', type: 'select', value: 'ARS ($)', options: ['ARS ($)', 'USD ($)', 'BRL (R$)'] },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Configuración</h1>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.label} className="rounded-xl border border-border bg-background p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-muted p-2">
                <section.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{section.label}</h2>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-foreground">{field.label}</span>
                  {field.type === 'checkbox' ? (
                    <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                      <input type="checkbox" defaultChecked={field.default} className="peer sr-only" />
                      <span className="absolute inset-0 rounded-full bg-muted-foreground/30 transition-colors peer-checked:bg-primary" />
                      <span className="absolute left-0.5 h-4 w-4 rounded-full bg-background transition-transform peer-checked:translate-x-4 shadow-sm" />
                    </label>
                  ) : (
                    <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" defaultValue={field.value}>
                      {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
