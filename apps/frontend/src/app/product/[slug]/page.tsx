import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, pdpProducts } from '@components/product';
import { ProductSchema, BreadcrumbSchema } from '@components/seo';
import { buildProductMetadata } from '@lib/seo';
import { PDPClient } from './pdp-client';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return pdpProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return { title: 'Producto no encontrado | Tienda' };

  return buildProductMetadata(
    product.name,
    product.shortDescription,
    product.slug,
    product.images[0]?.src,
    product.price,
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const breadcrumbItems = [
    { name: 'Inicio', item: '/' },
    { name: product.category, item: `/categoria/${product.categorySlug}` },
    ...(product.subcategory
      ? [{ name: product.subcategory, item: `/categoria/${product.categorySlug}/${product.subcategorySlug}` }]
      : []),
  ];

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <PDPClient product={product} />
    </>
  );
}
