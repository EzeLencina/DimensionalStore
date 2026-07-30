import type { Category } from '../aggregates/category.aggregate';
import type { Collection } from '../aggregates/collection.aggregate';

export type CategoryFilter = {
  tenantId: string;
  parentId?: string | null;
  status?: string;
  visibility?: string;
  search?: string;
  includeDeleted?: boolean;
};

export type CollectionFilter = {
  tenantId: string;
  status?: string;
  visibility?: string;
  type?: string;
  search?: string;
  activeOnly?: boolean;
  includeDeleted?: boolean;
};

export type CategorySort = {
  field: 'name' | 'slug' | 'displayOrder' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

export type CollectionSort = {
  field: 'name' | 'slug' | 'displayOrder' | 'createdAt' | 'updatedAt' | 'startAt';
  direction: 'asc' | 'desc';
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function matchesCategoryFilter(category: Category, filter: CategoryFilter): boolean {
  if (category.getTenantId() !== filter.tenantId) return false;
  if (!filter.includeDeleted && category.hasBeenDeleted()) return false;
  if (filter.parentId !== undefined && category.getParentId() !== filter.parentId) return false;
  if (filter.status && category.getStatus().getValue() !== filter.status) return false;
  if (filter.visibility && category.getVisibility().getValue() !== filter.visibility) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const name = category.getName().toString().toLowerCase();
    const slug = category.getSlug().toString().toLowerCase();
    if (!name.includes(q) && !slug.includes(q)) return false;
  }
  return true;
}

export function matchesCollectionFilter(collection: Collection, filter: CollectionFilter): boolean {
  if (collection.getTenantId() !== filter.tenantId) return false;
  if (!filter.includeDeleted && collection.hasBeenDeleted()) return false;
  if (filter.status && collection.getStatus().getValue() !== filter.status) return false;
  if (filter.visibility && collection.getVisibility().getValue() !== filter.visibility) return false;
  if (filter.type && collection.getType().getValue() !== filter.type) return false;
  if (filter.activeOnly && !collection.isActive()) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    const name = collection.getName().toString().toLowerCase();
    const slug = collection.getSlug().toString().toLowerCase();
    if (!name.includes(q) && !slug.includes(q)) return false;
  }
  return true;
}
