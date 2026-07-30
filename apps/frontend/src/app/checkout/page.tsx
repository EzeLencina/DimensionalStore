import type { Metadata } from 'next';
import { CheckoutClient } from './checkout-client';

export const metadata: Metadata = {
  title: 'Checkout — Tienda',
  description: 'Completá tu compra de forma segura. Seguridad inteligente, domótica y tecnología.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Checkout — Tienda',
    description: 'Completá tu compra de forma segura.',
    url: '/checkout',
    siteName: 'Tienda',
    locale: 'es_AR',
    type: 'website',
  },
  alternates: {
    canonical: '/checkout',
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
