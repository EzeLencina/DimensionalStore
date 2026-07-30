import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { type LucideIcon, Package } from 'lucide-react';

type AccountEmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function AccountEmptyState({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: AccountEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button className="mt-6" asChild>
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
