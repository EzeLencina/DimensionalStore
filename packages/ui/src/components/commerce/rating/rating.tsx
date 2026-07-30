'use client';

import { forwardRef } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../../lib/cn';

type RatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
};

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  className,
  readOnly = true,
  onChange,
}: RatingProps) {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    const filled = value >= i;
    const half = !filled && value >= i - 0.5;

    stars.push(
      <button
        key={i}
        type="button"
        disabled={readOnly}
        onClick={() => onChange?.(i)}
        className={cn(
          'transition-colors',
          readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
        aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        tabIndex={readOnly ? -1 : 0}
      >
        {half ? (
          <StarHalf
            className={cn(
              sizeMap[size],
              'fill-warning text-warning',
            )}
          />
        ) : (
          <Star
            className={cn(
              sizeMap[size],
              filled
                ? 'fill-warning text-warning'
                : 'fill-none text-muted-foreground/30',
            )}
          />
        )}
      </button>,
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating: ${value} out of ${max}`}>
      {stars}
      {showValue && (
        <span className="ml-1 text-sm text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { Rating };
export type { RatingProps };
