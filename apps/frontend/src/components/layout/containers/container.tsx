import { forwardRef } from 'react';
import { cn } from '@lib/helpers/cn';

type ContainerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer' | 'nav';
} & React.HTMLAttributes<HTMLDivElement>;

const sizeClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', as: Tag = 'div', children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  ),
);
Container.displayName = 'Container';

export { Container };
export type { ContainerProps };
