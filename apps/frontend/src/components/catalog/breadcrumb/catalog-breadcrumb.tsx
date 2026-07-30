import { Breadcrumb, type BreadcrumbItem } from '@components/layout/breadcrumb/breadcrumb';

type CatalogBreadcrumbProps = {
  category?: string;
  subcategory?: string;
};

export function CatalogBreadcrumb({ category, subcategory }: CatalogBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    ...(category ? [{ label: category, href: `/categoria/${slugify(category)}` }] : []),
    ...(subcategory ? [{ label: subcategory }] : []),
  ];

  return <Breadcrumb items={items} className="mb-4" />;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
