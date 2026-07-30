import { forwardRef } from 'react';
import { cn } from '@lib/helpers/cn';

type SectionProps = {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'primary' | 'dark';
  as?: 'section' | 'div' | 'article';
} & React.HTMLAttributes<HTMLDivElement>;

const spacingClasses = {
  none: 'py-0',
  sm: 'py-6 sm:py-8',
  md: 'py-8 sm:py-12 lg:py-16',
  lg: 'py-12 sm:py-16 lg:py-20',
  xl: 'py-16 sm:py-20 lg:py-28',
};

const variantClasses = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted/50 text-foreground',
  primary: 'bg-primary text-primary-foreground',
  dark: 'bg-card text-card-foreground',
};

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, spacing = 'md', variant = 'default', as: Tag = 'section', children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(spacingClasses[spacing], variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  ),
);
Section.displayName = 'Section';

export { Section };
export type { SectionProps };
