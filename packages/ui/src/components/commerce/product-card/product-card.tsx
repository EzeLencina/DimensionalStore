'use client';

import Image from 'next/image';
import { cn } from '../../../lib/cn';
import { Badge } from '../../ui/badge/badge';
import { Price } from '../price/price';
import { Rating } from '../rating/rating';
import { Card, CardContent } from '../../ui/card/card';

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  imageAlt?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  href?: string;
  currency?: string;
  className?: string;
  onAddToCart?: (id: string) => void;
};

function ProductCard({
  id,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  imageAlt = '',
  badge,
  badgeVariant = 'default',
  href,
  currency = 'ARS',
  className,
  onAddToCart,
}: ProductCardProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-200 hover:shadow-md',
        href && 'cursor-pointer',
        className,
      )}
    >
      <Wrapper
        href={href}
        className="block"
        {...(href ? {} : {})}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {badge && (
            <div className="absolute top-2 left-2">
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-2">
            <Price
              amount={price}
              originalPrice={originalPrice}
              currency={currency}
              size="lg"
            />
          </div>
          {(rating !== undefined) && (
            <div className="mt-2">
              <Rating value={rating} size="sm" showValue />
              {reviewCount !== undefined && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Wrapper>
      {onAddToCart && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(id);
            }}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add to cart
          </button>
        </div>
      )}
    </Card>
  );
}

export { ProductCard };
export type { ProductCardProps };
