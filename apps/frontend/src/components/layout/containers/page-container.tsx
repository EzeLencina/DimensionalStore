import { forwardRef } from 'react';
import { cn } from '@lib/helpers/cn';

type PageContainerProps = {
  topPadding?: boolean;
  bottomPadding?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, topPadding = true, bottomPadding = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'min-h-screen',
        topPadding && 'pt-4 sm:pt-6 lg:pt-8',
        bottomPadding && 'pb-8 sm:pb-12 lg:pb-16',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
PageContainer.displayName = 'PageContainer';

export { PageContainer };
export type { PageContainerProps };
