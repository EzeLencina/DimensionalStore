import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { CatalogProductCard } from '@components/catalog';
import { AccountEmptyState, accountFavorites } from '@components/account';

export const metadata: Metadata = {
  title: 'Favoritos — Tienda',
  robots: { index: false, follow: false },
};

export default function FavoritesPage() {
  if (accountFavorites.length === 0) {
    return (
      <AccountEmptyState
        icon={Heart}
        title="Sin favoritos"
        description="Guardá tus productos favoritos para encontrarlos fácilmente después."
        actionLabel="Explorar productos"
        actionHref="/catalogo"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Favoritos</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {accountFavorites.map((fav) => (
          <CatalogProductCard
            key={fav.id}
            product={{
              id: fav.productId,
              name: fav.name,
              slug: fav.slug,
              price: fav.price,
              originalPrice: fav.originalPrice,
              rating: fav.rating,
              reviewCount: fav.reviewCount,
              image: fav.image,
              images: [fav.image],
              badge: fav.badge,
              inStock: fav.inStock,
              stockCount: 99,
              brand: fav.brand,
              brandSlug: fav.brand.toLowerCase().replace(/\s+/g, '-'),
              category: '', categorySlug: '', subcategory: '', subcategorySlug: '',
              sku: fav.productId, estimatedDelivery: '24 horas', warranty: '12 meses', specs: {},
            }}
            viewMode="grid"
          />
        ))}
      </div>
    </div>
  );
}
