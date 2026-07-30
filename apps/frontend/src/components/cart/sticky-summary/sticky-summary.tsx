'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';
import { defaultCartSummary } from '../mock-data';
import type { CartSummary } from '../mock-data';

type StickySummaryProps = {
  summary?: CartSummary;
  className?: string;
};

export function StickySummary({ summary = defaultCartSummary, className }: StickySummaryProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md shadow-lg transition-transform duration-300 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
        className,
      )}
      role="complementary"
      aria-label="Resumen rápido"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">
              {summary.itemCount} {summary.itemCount === 1 ? 'producto' : 'productos'}
            </p>
            <p className="text-base font-bold text-foreground">{formatPrice(summary.total)}</p>
          </div>
        </div>
        <Button size="sm" asChild>
          <a href="#cart-summary" onClick={(e) => { e.preventDefault(); document.getElementById('cart-summary')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Ver resumen
          </a>
        </Button>
      </div>
    </div>
  );
}
