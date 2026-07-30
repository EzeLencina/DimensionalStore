import { ShoppingBag } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { Button } from '@tienda/ui';
import { RecommendedProducts } from '../recommended-products';

type EmptyCartProps = {
  className?: string;
};

export function EmptyCart({ className }: EmptyCartProps) {
  return (
    <section className={cn('flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center', className)} aria-labelledby="empty-cart-heading">
      <div className="mb-6 rounded-full bg-muted p-5">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <h1 id="empty-cart-heading" className="text-2xl font-bold tracking-tight text-foreground">
        Tu carrito está vacío
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Todavía no agregaste productos al carrito. Explorá nuestro catálogo y descubrí las mejores marcas en seguridad inteligente y tecnología.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button size="lg" asChild>
          <a href="/catalogo">Ver catálogo</a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="/">Ir al inicio</a>
        </Button>
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <RecommendedProducts title="Productos destacados" />
      </div>
    </section>
  );
}
