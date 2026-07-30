import { cn } from '../../../lib/cn';
import { formatPrice } from '../../../lib/helpers';
import { cva, type VariantProps } from 'class-variance-authority';

const priceVariants = cva('inline-flex items-baseline gap-1', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg font-semibold',
      xl: 'text-2xl font-bold',
      '2xl': 'text-3xl font-bold',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      sale: 'text-destructive',
      success: 'text-success',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type PriceProps = VariantProps<typeof priceVariants> & {
  amount: number;
  currency?: string;
  locale?: string;
  className?: string;
  originalPrice?: number;
  strikeThrough?: boolean;
};

function Price({
  amount,
  currency = 'ARS',
  locale = 'es-AR',
  className,
  size,
  variant,
  originalPrice,
  strikeThrough = false,
}: PriceProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      {originalPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalPrice, currency, locale)}
        </span>
      )}
      <span className={cn(priceVariants({ size, variant: originalPrice ? 'sale' : variant }))}>
        {formatPrice(amount, currency, locale)}
      </span>
    </span>
  );
}

export { Price, priceVariants };
export type { PriceProps };
