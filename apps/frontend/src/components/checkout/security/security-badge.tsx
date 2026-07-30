import { cn } from '@lib/helpers/cn';
import { ShieldCheck, Lock, Headphones, RotateCcw } from 'lucide-react';

const items = [
  { icon: Lock, label: 'Compra segura', desc: 'Tus datos protegidos con cifrado SSL' },
  { icon: ShieldCheck, label: 'Garantía extendida', desc: '30 días de garantía de satisfacción' },
  { icon: Headphones, label: 'Soporte técnico', desc: 'Atención personalizada por WhatsApp' },
  { icon: RotateCcw, label: 'Cambios sin costo', desc: 'Primer cambio sin cargo en 15 días' },
];

type SecurityBadgeProps = { className?: string };

export function SecurityBadge({ className }: SecurityBadgeProps) {
  return (
    <div className={cn('space-y-3 rounded-xl border border-border bg-background p-4', className)}>
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
        Compra segura
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-2">
            <item.icon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.label}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
