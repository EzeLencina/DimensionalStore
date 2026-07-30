import type { Metadata } from 'next';
import { CartClient } from './cart-client';

export const metadata: Metadata = {
  title: 'Carrito de compras — Tienda',
  description: 'Revisá los productos en tu carrito de compras. Seguridad inteligente, domótica y tecnología al mejor precio.',
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Carrito de compras — Tienda',
    description: 'Revisá los productos en tu carrito de compras.',
    url: '/cart',
    siteName: 'Tienda',
    locale: 'es_AR',
    type: 'website',
  },
  alternates: {
    canonical: '/cart',
  },
};

export default function CartPage() {
  return <CartClient />;
}
