import { cn } from '../../../lib/cn';

type ProductBadgeProps = {
  label: string;
  variant?: 'new' | 'sale' | 'sold-out' | 'featured' | 'custom';
  className?: string;
};

const variantStyles = {
  new: 'bg-primary text-primary-foreground',
  sale: 'bg-destructive text-destructive-foreground',
  'sold-out': 'bg-muted-foreground/20 text-muted-foreground',
  featured: 'bg-warning text-warning-foreground',
  custom: 'bg-primary/10 text-primary',
};

function ProductBadge({ label, variant = 'custom', className }: ProductBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

export { ProductBadge };
export type { ProductBadgeProps };
