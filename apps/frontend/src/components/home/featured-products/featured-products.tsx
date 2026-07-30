import { Heart, ArrowLeftRight, Eye } from 'lucide-react';
import { cn } from '@lib/helpers/cn';
import { featuredProducts } from '@lib/home/mock-data';
import { Container } from '@components/layout/containers/container';
import { SectionTitle, Badge, Rating, Button } from '@tienda/ui';
import { formatPrice } from '@tienda/ui';

type FeaturedProductsProps = {
  className?: string;
};

export function FeaturedProducts({ className }: FeaturedProductsProps) {
  return (
    <section className={cn('py-12 sm:py-16 bg-muted/30', className)}>
      <Container size="xl">
        <SectionTitle
          title="Productos Destacados"
          description="Lo más vendido en seguridad inteligente y domótica"
          align="center"
          spacing="loose"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="group relative rounded-xl border border-border bg-background overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="relative">
                <div className="relative aspect-square bg-muted flex items-center justify-center text-muted-foreground p-8">
                  <div className="h-full w-full rounded-lg bg-muted-foreground/10" />
                </div>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.badge && (
                    <Badge variant={product.badgeVariant ?? 'default'} size="sm">
                      {product.badge}
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="info" size="sm">Nuevo</Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button type="button" className="rounded-lg bg-background/90 p-2 shadow-sm hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Add to favorites">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-lg bg-background/90 p-2 shadow-sm hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Compare product">
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-lg bg-background/90 p-2 shadow-sm hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Quick view">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <a href={`/producto/${product.slug}`} className="block">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </a>
                <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    </>
                  )}
                </div>

                <Rating value={product.rating} size="sm" showValue />
                <span className="text-xs text-muted-foreground">({product.reviewCount} reseñas)</span>

                <div className="flex items-center gap-2 pt-1">
                  {product.inStock ? (
                    <span className="text-xs text-success font-medium">
                      {product.stockCount && product.stockCount <= 10
                        ? `Solo quedan ${product.stockCount}`
                        : 'En stock'}
                    </span>
                  ) : (
                    <span className="text-xs text-destructive font-medium">Sin stock</span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" fullWidth asChild>
                    <a href={`/producto/${product.slug}`}>Comprar</a>
                  </Button>
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <a href={`/producto/${product.slug}`} aria-label="View details">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
