import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';

type ContainerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
} & React.HTMLAttributes<HTMLDivElement>;

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Container.displayName = 'Container';

export { Container };
export type { ContainerProps };
