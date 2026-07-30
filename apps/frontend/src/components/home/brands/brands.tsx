'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { brands } from '@lib/home/mock-data';
import { Container } from '@components/layout/containers/container';
import { SectionTitle } from '@tienda/ui';

type BrandsProps = {
  className?: string;
};

export function Brands({ className }: BrandsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className={cn('py-12 sm:py-16 bg-muted/30', className)}>
      <Container size="xl">
        <SectionTitle
          title="Marcas Oficiales"
          description="Trabajamos con las marcas líderes en seguridad y domótica"
          align="center"
          spacing="loose"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border border-border p-2 shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide py-4 px-2 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.concat(brands).map((brand, i) => (
              <a
                key={`${brand.id}-${i}`}
                href={brand.href}
                className="flex shrink-0 items-center justify-center w-[140px] h-20 rounded-xl border border-border bg-background px-6 hover:shadow-sm hover:border-foreground/20 transition-all duration-200 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {brand.name}
                </span>
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background border border-border p-2 shadow-sm hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
