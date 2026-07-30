'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { CatalogProductCard } from '@components/catalog';
import { recommendedProducts } from '../mock-data';
import type { RecommendedProduct } from '../mock-data';

type RecommendedProductsProps = {
  title?: string;
  className?: string;
};

export function RecommendedProducts({
  title = 'También podría interesarte',
  className,
}: RecommendedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (recommendedProducts.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="recommended-heading">
      <div className="flex items-center justify-between">
        <h2 id="recommended-heading" className="text-lg font-semibold tracking-tight">{title}</h2>
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
        {recommendedProducts.map((rp) => (
          <div key={rp.id} className="min-w-[200px] sm:min-w-[220px] max-w-[240px] snap-start">
            <CatalogProductCard
              product={{
                id: rp.id,
                name: rp.name,
                slug: rp.slug,
                price: rp.price,
                originalPrice: rp.originalPrice,
                rating: rp.rating,
                reviewCount: rp.reviewCount,
                image: rp.image,
                images: [rp.image],
                badge: rp.badge,
                badgeVariant: rp.badgeVariant,
                inStock: rp.inStock,
                stockCount: 99,
                brand: rp.brand,
                brandSlug: rp.brand.toLowerCase().replace(/\s+/g, '-'),
                category: '',
                categorySlug: '',
                subcategory: '',
                subcategorySlug: '',
                sku: `SKU-${rp.id}`,
                estimatedDelivery: '24 horas',
                warranty: '12 meses',
                specs: {},
              }}
              viewMode="grid"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
