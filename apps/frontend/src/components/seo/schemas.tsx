import { JsonLd } from './json-ld';
import {
  organizationSchema, websiteSchema, productSchema,
  breadcrumbSchema, faqSchema,
} from '@lib/seo';

export function OrganizationSchema() {
  return <JsonLd schema={organizationSchema()} />;
}

export function WebsiteSchema() {
  return <JsonLd schema={websiteSchema()} />;
}

type ProductSchemaProps = {
  product: {
    name: string;
    shortDescription?: string;
    sku: string;
    internalCode: string;
    brand: string;
    category: string;
    price: number;
    inStock: boolean;
    slug: string;
    rating?: number;
    reviewCount?: number;
    images: { src: string }[];
  };
};

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = productSchema({
    name: product.name,
    description: product.shortDescription ?? '',
    sku: product.sku,
    mpn: product.internalCode,
    brand: product.brand,
    category: product.category,
    price: product.price,
    inStock: product.inStock,
    slug: product.slug,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images,
  });
  return <JsonLd schema={schema} />;
}

type BreadcrumbSchemaProps = {
  items: { name: string; item: string }[];
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  return <JsonLd schema={breadcrumbSchema(items)} />;
}

type FaqSchemaProps = {
  items: { question: string; answer: string }[];
};

export function FaqSchema({ items }: FaqSchemaProps) {
  return <JsonLd schema={faqSchema(items)} />;
}
