'use client';

import { Section, Container } from '@components/layout';
import {
  CartItem,
  CartSummary,
  RecommendedProducts,
  EmptyCart,
  StickySummary,
  mockCartItems,
  defaultCartSummary,
} from '@components/cart';

export function CartClient() {
  const items = mockCartItems;

  if (items.length === 0) {
    return (
      <Section spacing="lg">
        <Container>
          <EmptyCart />
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section spacing="md">
        <Container>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Carrito de compras
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.reduce((sum, i) => sum + i.quantity, 0)} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border bg-background p-4 sm:p-5 divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-8">
                <RecommendedProducts />
              </div>
            </div>

            <div className="lg:col-span-1" id="cart-summary">
              <div className="sticky top-24 space-y-5">
                <div className="rounded-xl border border-border bg-background p-4 sm:p-5">
                  <CartSummary summary={defaultCartSummary} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <StickySummary summary={defaultCartSummary} />
    </>
  );
}
