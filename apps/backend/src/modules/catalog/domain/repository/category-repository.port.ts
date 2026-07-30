import type { Category } from '../aggregates/category.aggregate';
import type { CategoryId } from '../value-objects/category-id';
import type { CategoryFilter, CategorySort, PaginatedResult } from '../specifics/catalog-specifications';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findBySlug(tenantId: string, slug: string): Promise<Category | null>;
  findByTenant(tenantId: string): Promise<Category[]>;
  findChildren(parentId: string): Promise<Category[]>;
  findRootCategories(tenantId: string): Promise<Category[]>;
  findFiltered(
    filter: CategoryFilter,
    sort?: CategorySort,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Category>>;
  existsBySlug(tenantId: string, slug: string, excludeId?: string): Promise<boolean>;
  save(category: Category): Promise<Category>;
  delete(categoryId: CategoryId): Promise<void>;
}
