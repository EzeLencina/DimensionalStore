import { cn } from '../../../lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const sectionTitleVariants = cva('flex flex-col gap-1', {
  variants: {
    align: {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    },
    spacing: {
      default: 'mb-6',
      tight: 'mb-4',
      loose: 'mb-8',
      none: 'mb-0',
    },
  },
  defaultVariants: {
    align: 'left',
    spacing: 'default',
  },
});

type SectionTitleProps = VariantProps<typeof sectionTitleVariants> & {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

function SectionTitle({ title, description, action, className, align, spacing }: SectionTitleProps) {
  return (
    <div className={cn(sectionTitleVariants({ align, spacing }), className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export { SectionTitle, sectionTitleVariants };
export type { SectionTitleProps };
