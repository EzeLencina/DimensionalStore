'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../../lib/cn';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-8',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        info: 'bg-info/10 text-info border-info/20 [&>svg]:text-info',
        success: 'bg-success/10 text-success border-success/20 [&>svg]:text-success',
        warning: 'bg-warning/10 text-warning border-warning/20 [&>svg]:text-warning',
        danger: 'bg-destructive/10 text-destructive border-destructive/20 [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

type AlertProps = VariantProps<typeof alertVariants> & {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

function Alert({ className, variant = 'default', children, onClose }: AlertProps) {
  const Icon = iconMap[variant ?? 'default'];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { Alert, alertVariants };
export type { AlertProps };
