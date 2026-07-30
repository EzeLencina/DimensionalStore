import type { Metadata } from 'next';
import { CatalogPageClient } from './catalog-page-client';

export const metadata: Metadata = {
  title: 'Catálogo — Tienda | Seguridad Inteligente y Domótica',
  description: 'Explorá nuestro catálogo completo de cerraduras inteligentes, cámaras de seguridad, videoporteros, control de acceso, domótica y accesorios. Envíos a todo el país.',
  openGraph: {
    title: 'Catálogo — Tienda | Seguridad Inteligente y Domótica',
    description: 'Explorá nuestro catálogo completo de cerraduras inteligentes, cámaras de seguridad, videoporteros, control de acceso, domótica y accesorios.',
    url: '/catalogo',
    siteName: 'Tienda',
    images: [{ url: '/og-catalogo.jpg', width: 1200, height: 630 }],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo — Tienda | Seguridad Inteligente y Domótica',
    description: 'Explorá nuestro catálogo completo de cerraduras inteligentes, cámaras de seguridad, videoporteros, control de acceso, domótica y accesorios.',
    images: ['/og-catalogo.jpg'],
  },
  alternates: {
    canonical: '/catalogo',
  },
};

export default function CatalogPage() {
  return <CatalogPageClient />;
}
