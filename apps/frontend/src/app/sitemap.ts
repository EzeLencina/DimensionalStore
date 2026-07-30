import type { MetadataRoute } from 'next';
import { SITE_URL } from '@lib/seo';
import { catalogCategories, catalogBrands, catalogProducts } from '@lib/catalog/mock-data';

function buildSitemapEntry(
  path: string,
  priority?: number,
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly',
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency ?? 'weekly',
    priority: priority ?? 0.5,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home
  entries.push(buildSitemapEntry('/', 1.0, 'weekly'));

  // Catalog
  entries.push(buildSitemapEntry('/catalogo', 0.9, 'daily'));

  // Static pages
  entries.push(buildSitemapEntry('/ofertas', 0.8, 'weekly'));
  entries.push(buildSitemapEntry('/marcas', 0.6, 'monthly'));
  entries.push(buildSitemapEntry('/nosotros', 0.5, 'monthly'));
  entries.push(buildSitemapEntry('/contacto', 0.5, 'monthly'));
  entries.push(buildSitemapEntry('/terminos', 0.3, 'yearly'));
  entries.push(buildSitemapEntry('/privacidad', 0.3, 'yearly'));

  // Categories
  for (const cat of catalogCategories) {
    entries.push(buildSitemapEntry(`/categoria/${cat.slug}`, 0.8, 'daily'));
    if (cat.children) {
      for (const child of cat.children) {
        entries.push(buildSitemapEntry(child.href, 0.7, 'daily'));
      }
    }
  }

  // Brands
  for (const brand of catalogBrands) {
    entries.push(buildSitemapEntry(`/marca/${brand.value}`, 0.6, 'weekly'));
  }

  // Products
  for (const product of catalogProducts) {
    entries.push(buildSitemapEntry(`/producto/${product.slug}`, 0.7, 'weekly'));
  }

  return entries;
}
