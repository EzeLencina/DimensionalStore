'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { CatalogProductCard } from '@components/catalog';
import { getRelatedProducts, pdpProducts } from '../mock-data';
import type { PDPProduct } from '../mock-data';

type RelatedProductsProps = {
  product: PDPProduct;
  title?: string;
  className?: string;
};

export function RelatedProducts({
  product,
  title = 'Productos relacionados',
  className,
}: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const related = getRelatedProducts(product.relatedSlugs);

  if (related.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="related-heading">
      <div className="flex items-center justify-between">
        <h2 id="related-heading" className="text-lg font-semibold tracking-tight">{title}</h2>
        <div className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="rounded-lg border border-border p-1.5 hover:bg-accent transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="rounded-lg border border-border p-1.5 hover:bg-accent transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
      >
        {related.map((p) => (
          <div key={p.id} className="min-w-[220px] sm:min-w-[240px] max-w-[260px] snap-start">
            <CatalogProductCard
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                sku: p.sku,
                brand: p.brand,
                brandSlug: p.brandSlug,
                category: p.category,
                categorySlug: p.categorySlug,
                subcategory: p.subcategory,
                subcategorySlug: p.subcategorySlug,
                price: p.price,
                originalPrice: p.originalPrice,
                discount: p.discount,
                rating: p.rating,
                reviewCount: p.reviewCount,
                image: p.images[0]?.src ?? '',
                images: p.images.map((i) => i.src),
                badge: p.badge,
                badgeVariant: p.badgeVariant,
                inStock: p.inStock,
                stockCount: p.stockCount,
                isNew: p.isNew,
                isFeatured: p.isFeatured,
                estimatedDelivery: p.estimatedDelivery,
                warranty: p.warranty,
                specs: p.specs,
              }}
              viewMode="grid"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
