'use client';

import { useState } from 'react';
import { Section, Container } from '@components/layout';
import { CatalogBreadcrumb } from '@components/catalog/breadcrumb';
import { CatalogSidebar } from '@components/catalog/filters';
import { CatalogToolbar } from '@components/catalog/toolbar';
import { ProductGrid } from '@components/catalog/product-grid';
import { CatalogPagination } from '@components/catalog/pagination';
import { catalogProducts } from '@lib/catalog/mock-data';

const PAGE_SIZE = 12;

export function CatalogPageClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const totalProducts = catalogProducts.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageProducts = catalogProducts.slice(start, start + PAGE_SIZE);

  return (
    <Section spacing="md">
      <Container>
        <CatalogBreadcrumb />

        <div className="flex gap-6 lg:gap-8">
          <CatalogSidebar
            isMobileOpen={filterOpen}
            onMobileClose={() => setFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <CatalogToolbar
              totalProducts={totalProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onToggleFilters={() => setFilterOpen(!filterOpen)}
            />

            <ProductGrid products={pageProducts} viewMode={viewMode} />

            <CatalogPagination
              currentPage={page}
              totalPages={totalPages}
              variant="pagination"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
