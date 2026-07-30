import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';

type GridProps = {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12;
  colsSm?: 1 | 2 | 3;
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12;
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;
} & React.HTMLAttributes<HTMLDivElement>;

const colMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  12: 'grid-cols-12',
} as const;

const colSmMap = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
} as const;

const colMdMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
} as const;

const colLgMap = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  12: 'lg:grid-cols-12',
} as const;

const gapMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
} as const;

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, colsSm, colsMd, colsLg, colsXl, gap = 4, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colMap[cols],
          colsSm && colSmMap[colsSm],
          colsMd && colMdMap[colsMd],
          colsLg && colLgMap[colsLg],
          colsXl && `xl:grid-cols-${colsXl}`,
          gapMap[gap],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Grid.displayName = 'Grid';

type GridItemProps = {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12;
  colSpanSm?: 1 | 2 | 3;
  colSpanMd?: 1 | 2 | 3 | 4 | 5 | 6;
  colSpanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12;
} & React.HTMLAttributes<HTMLDivElement>;

const colSpanMap = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  12: 'col-span-12',
} as const;

const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan, colSpanSm, colSpanMd, colSpanLg, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          colSpan && colSpanMap[colSpan],
          colSpanSm && `sm:col-span-${colSpanSm}`,
          colSpanMd && `md:col-span-${colSpanMd}`,
          colSpanLg && `lg:col-span-${colSpanLg}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GridItem.displayName = 'GridItem';

export { Grid, GridItem };
export type { GridProps, GridItemProps };
