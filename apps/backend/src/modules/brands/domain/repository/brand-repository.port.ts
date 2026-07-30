import type { Brand } from '../aggregates/brand.aggregate';
import type { BrandId } from '../value-objects/brand-id';
import type { BrandFilter, BrandSort, PaginatedResult } from '../specifics/brand-specifications';

export const BRAND_REPOSITORY = 'BRAND_REPOSITORY';

export interface BrandRepository {
  findById(id: BrandId): Promise<Brand | null>;
  findBySlug(tenantId: string, slug: string): Promise<Brand | null>;
  findByTenant(tenantId: string): Promise<Brand[]>;
  findFiltered(
    filter: BrandFilter,
    sort?: BrandSort,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Brand>>;
  existsBySlug(tenantId: string, slug: string, excludeId?: string): Promise<boolean>;
  save(brand: Brand): Promise<Brand>;
  delete(brandId: BrandId): Promise<void>;
  countProducts(brandId: string, tenantId: string): Promise<number>;
}
