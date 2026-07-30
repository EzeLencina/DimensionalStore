import { cn } from '@lib/helpers/cn';
import { formatPrice, Button } from '@tienda/ui';
import { CatalogProductCard } from '@components/catalog';
import { getRelatedProducts } from '../mock-data';
import type { PDPProduct } from '../mock-data';

type CrossSellingProps = {
  product: PDPProduct;
  className?: string;
};

export function CrossSelling({ product, className }: CrossSellingProps) {
  const items = getRelatedProducts(product.crossSellSlugs);

  if (items.length === 0) return null;

  const totalPrice = product.price + items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="cross-heading">
      <h2 id="cross-heading" className="text-lg font-semibold tracking-tight">Comprados juntos</h2>

      <div className="rounded-xl border border-border p-4 sm:p-5 space-y-4">
        <p className="text-xs text-muted-foreground">
          Productos que se compran frecuentemente juntos
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <CatalogProductCard
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              brand: product.brand,
              brandSlug: product.brandSlug,
              category: product.category,
              categorySlug: product.categorySlug,
              subcategory: product.subcategory,
              subcategorySlug: product.subcategorySlug,
              price: product.price,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviewCount: product.reviewCount,
              image: product.images[0]?.src ?? '',
              images: product.images.map((i) => i.src),
              badge: product.badge,
              badgeVariant: product.badgeVariant,
              inStock: product.inStock,
              stockCount: product.stockCount,
              isNew: product.isNew,
              isFeatured: product.isFeatured,
              estimatedDelivery: product.estimatedDelivery,
              warranty: product.warranty,
              specs: product.specs,
            }}
            viewMode="grid"
          />
          {items.map((item) => (
            <CatalogProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                slug: item.slug,
                sku: item.sku,
                brand: item.brand,
                brandSlug: item.brandSlug,
                category: item.category,
                categorySlug: item.categorySlug,
                subcategory: item.subcategory,
                subcategorySlug: item.subcategorySlug,
                price: item.price,
                originalPrice: item.originalPrice,
                rating: item.rating,
                reviewCount: item.reviewCount,
                image: item.images[0]?.src ?? '',
                images: item.images.map((i) => i.src),
                badge: item.badge,
                badgeVariant: item.badgeVariant,
                inStock: item.inStock,
                stockCount: item.stockCount,
                isNew: item.isNew,
                isFeatured: item.isFeatured,
                estimatedDelivery: item.estimatedDelivery,
                warranty: item.warranty,
                specs: item.specs,
              }}
              viewMode="grid"
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Precio total:</p>
            <p className="text-xl font-bold text-foreground">{formatPrice(totalPrice)}</p>
          </div>
          <Button size="md" aria-label="Agregar todo al carrito">
            Agregar todo al carrito
          </Button>
        </div>
      </div>
    </section>
  );
}
