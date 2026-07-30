import type { Metadata } from 'next';
import { Hero } from '@components/home/hero';
import { Categories } from '@components/home/categories';
import { FeaturedProducts } from '@components/home/featured-products';
import { Deals } from '@components/home/deals';
import { Brands } from '@components/home/brands';
import { Benefits } from '@components/home/benefits';
import { Promotions } from '@components/home/promotions';
import { Testimonials } from '@components/home/testimonials';
import { Faq } from '@components/home/faq';
import { Cta } from '@components/home/cta';
import { FaqSchema } from '@components/seo';
import { faqItems } from '@lib/home/mock-data';

export const metadata: Metadata = {
  title: 'Tienda — Seguridad Inteligente y Domótica',
  description: 'Descubrí la mejor tecnología en seguridad inteligente, cerraduras digitales, cámaras HD y domótica. Envíos a todo el país. 12 cuotas sin interés.',
  openGraph: {
    title: 'Tienda — Seguridad Inteligente y Domótica',
    description: 'Descubrí la mejor tecnología en seguridad inteligente, cerraduras digitales, cámaras HD y domótica.',
    url: '/',
    siteName: 'Tienda',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tienda — Seguridad Inteligente y Domótica',
    description: 'Descubrí la mejor tecnología en seguridad inteligente, cerraduras digitales, cámaras HD y domótica.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <FaqSchema items={faqItems} />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Deals />
      <Brands />
      <Benefits />
      <Promotions />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}
