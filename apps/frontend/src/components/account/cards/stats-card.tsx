import { cn } from '@lib/helpers/cn';
import { type LucideIcon } from 'lucide-react';

type StatsCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  href?: string;
  className?: string;
};

export function StatsCard({ icon: Icon, label, value, variant = 'default', href, className }: StatsCardProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      href={href}
      className={cn(
        'rounded-xl border border-border bg-background p-4 transition-all hover:shadow-sm',
        href && 'cursor-pointer hover:border-primary/30',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn(
          'rounded-lg p-2',
          variant === 'success' && 'bg-success/10',
          variant === 'warning' && 'bg-warning/10',
          variant === 'danger' && 'bg-destructive/10',
          variant === 'default' && 'bg-muted',
        )}>
          <Icon className={cn(
            'h-5 w-5',
            variant === 'success' && 'text-success',
            variant === 'warning' && 'text-warning',
            variant === 'danger' && 'text-destructive',
            variant === 'default' && 'text-muted-foreground',
          )} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Wrapper>
  );
}
