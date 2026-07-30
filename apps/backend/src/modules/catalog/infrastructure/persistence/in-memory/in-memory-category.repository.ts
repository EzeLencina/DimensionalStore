import type { CategoryRepository } from '../../../domain/repository';
import type { CategoryFilter, CategorySort, PaginatedResult } from '../../../domain/specifics';
import { Category, CategoryId, matchesCategoryFilter } from '../../../domain';

export class InMemoryCategoryRepository implements CategoryRepository {
  private items: Map<string, Category> = new Map();

  async findById(id: CategoryId): Promise<Category | null> {
    return this.items.get(id.getValue()) ?? null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Category | null> {
    for (const category of this.items.values()) {
      if (category.getTenantId() === tenantId && category.getSlug().toString() === slug) {
        return category;
      }
    }
    return null;
  }

  async findByTenant(tenantId: string): Promise<Category[]> {
    return [...this.items.values()].filter(c => c.getTenantId() === tenantId);
  }

  async findChildren(parentId: string): Promise<Category[]> {
    return [...this.items.values()].filter(c => c.getParentId() === parentId);
  }

  async findRootCategories(tenantId: string): Promise<Category[]> {
    return [...this.items.values()].filter(c => c.getTenantId() === tenantId && c.isRoot());
  }

  async findFiltered(
    filter: CategoryFilter,
    _sort?: CategorySort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Category>> {
    const filtered = [...this.items.values()].filter(c => matchesCategoryFilter(c, filter));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return { data, total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) };
  }

  async existsBySlug(tenantId: string, slug: string, _excludeId?: string): Promise<boolean> {
    const found = await this.findBySlug(tenantId, slug);
    if (!found) return false;
    if (_excludeId && found.getId().toString() === _excludeId) return false;
    return true;
  }

  async save(category: Category): Promise<Category> {
    this.items.set(category.getId().toString(), category);
    return category;
  }

  async delete(categoryId: CategoryId): Promise<void> {
    this.items.delete(categoryId.getValue());
  }

  clear(): void {
    this.items.clear();
  }

  seed(categories: Category[]): void {
    for (const c of categories) {
      this.items.set(c.getId().toString(), c);
    }
  }
}
