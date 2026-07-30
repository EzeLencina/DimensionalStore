import type { CollectionRepository } from '../../../domain/repository';
import type { CollectionFilter, CollectionSort, PaginatedResult } from '../../../domain/specifics';
import { Collection, CollectionId, matchesCollectionFilter } from '../../../domain';

export class InMemoryCollectionRepository implements CollectionRepository {
  private items: Map<string, Collection> = new Map();

  async findById(id: CollectionId): Promise<Collection | null> {
    return this.items.get(id.getValue()) ?? null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Collection | null> {
    for (const collection of this.items.values()) {
      if (collection.getTenantId() === tenantId && collection.getSlug().toString() === slug) {
        return collection;
      }
    }
    return null;
  }

  async findByTenant(tenantId: string): Promise<Collection[]> {
    return [...this.items.values()].filter(c => c.getTenantId() === tenantId);
  }

  async findActiveByTenant(tenantId: string): Promise<Collection[]> {
    return [...this.items.values()].filter(c => c.getTenantId() === tenantId && c.isActive());
  }

  async findFiltered(
    filter: CollectionFilter,
    _sort?: CollectionSort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Collection>> {
    const filtered = [...this.items.values()].filter(c => matchesCollectionFilter(c, filter));
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

  async save(collection: Collection): Promise<Collection> {
    this.items.set(collection.getId().toString(), collection);
    return collection;
  }

  async delete(collectionId: CollectionId): Promise<void> {
    this.items.delete(collectionId.getValue());
  }

  clear(): void {
    this.items.clear();
  }

  seed(collections: Collection[]): void {
    for (const c of collections) {
      this.items.set(c.getId().toString(), c);
    }
  }
}
