import type { ProductVariant } from '../aggregates/product-variant.aggregate';

export type VariantFilter = {
  tenantId: string;
  productId?: string;
  status?: string;
  search?: string;
  includeDeleted?: boolean;
};

export type VariantSort = {
  field: 'sku' | 'status' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function matchesVariantFilter(variant: ProductVariant, filter: VariantFilter): boolean {
  if (variant.getTenantId() !== filter.tenantId) return false;
  if (filter.productId && variant.getProductId() !== filter.productId) return false;
  if (!filter.includeDeleted && variant.hasBeenDeleted()) return false;
  if (filter.status && variant.getStatus().getValue() !== filter.status) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const sku = variant.getSku().toString().toLowerCase();
    const name = variant.getName()?.toString().toLowerCase() ?? '';
    if (!sku.includes(q) && !name.includes(q)) return false;
  }
  return true;
}
