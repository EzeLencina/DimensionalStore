import { forwardRef } from 'react';
import { cn } from '@lib/helpers/cn';

type ContentWrapperProps = {
  maxWidth?: 'prose' | 'narrow' | 'default' | 'wide';
} & React.HTMLAttributes<HTMLDivElement>;

const widthClasses = {
  prose: 'max-w-prose',
  narrow: 'max-w-2xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
};

const ContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ className, maxWidth = 'default', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full', widthClasses[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  ),
);
ContentWrapper.displayName = 'ContentWrapper';

export { ContentWrapper };
export type { ContentWrapperProps };
