import type { Collection } from '../aggregates/collection.aggregate';
import type { CollectionId } from '../value-objects/collection-id';
import type { CollectionFilter, CollectionSort, PaginatedResult } from '../specifics/catalog-specifications';

export const COLLECTION_REPOSITORY = Symbol('COLLECTION_REPOSITORY');

export interface CollectionRepository {
  findById(id: CollectionId): Promise<Collection | null>;
  findBySlug(tenantId: string, slug: string): Promise<Collection | null>;
  findByTenant(tenantId: string): Promise<Collection[]>;
  findActiveByTenant(tenantId: string): Promise<Collection[]>;
  findFiltered(
    filter: CollectionFilter,
    sort?: CollectionSort,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Collection>>;
  existsBySlug(tenantId: string, slug: string, excludeId?: string): Promise<boolean>;
  save(collection: Collection): Promise<Collection>;
  delete(collectionId: CollectionId): Promise<void>;
}
