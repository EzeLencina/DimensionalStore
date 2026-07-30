import type { Brand } from '../aggregates/brand.aggregate';

export type BrandFilter = {
  tenantId: string;
  status?: string;
  visibility?: string;
  search?: string;
  includeDeleted?: boolean;
};

export type BrandSort = {
  field: 'name' | 'slug' | 'status' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function matchesBrandFilter(brand: Brand, filter: BrandFilter): boolean {
  if (brand.getTenantId() !== filter.tenantId) return false;
  if (!filter.includeDeleted && brand.hasBeenDeleted()) return false;
  if (filter.status && brand.getStatus().getValue() !== filter.status) return false;
  if (filter.visibility && brand.getVisibility().getValue() !== filter.visibility) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const name = brand.getName().toString().toLowerCase();
    const slug = brand.getSlug().toString().toLowerCase();
    if (!name.includes(q) && !slug.includes(q)) return false;
  }
  return true;
}
