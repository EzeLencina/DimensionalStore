import { cn } from '@lib/helpers/cn';
import { CatalogProductCard } from '../product-card/catalog-product-card';
import type { CatalogProduct } from '@lib/catalog/mock-data';

type ProductGridProps = {
  products: CatalogProduct[];
  viewMode: 'grid' | 'list';
  className?: string;
};

export function ProductGrid({ products, viewMode, className }: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
          : 'flex flex-col gap-3',
        className,
      )}
    >
      {products.map((product) => (
        <CatalogProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}
