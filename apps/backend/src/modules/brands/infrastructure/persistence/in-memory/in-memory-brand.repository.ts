import type { BrandRepository } from '../../../domain/repository';
import type { BrandFilter, BrandSort, PaginatedResult } from '../../../domain/specifics';
import { Brand, BrandId, matchesBrandFilter } from '../../../domain';

export class InMemoryBrandRepository implements BrandRepository {
  private items: Map<string, Brand> = new Map();
  private productBrandLinks: Map<string, string> = new Map();

  async findById(id: BrandId): Promise<Brand | null> {
    return this.items.get(id.getValue()) ?? null;
  }

  async findBySlug(tenantId: string, slug: string): Promise<Brand | null> {
    for (const brand of this.items.values()) {
      if (brand.getTenantId() === tenantId && brand.getSlug().toString() === slug) {
        return brand;
      }
    }
    return null;
  }

  async findByTenant(tenantId: string): Promise<Brand[]> {
    return [...this.items.values()].filter(b => b.getTenantId() === tenantId);
  }

  async findFiltered(
    filter: BrandFilter,
    _sort?: BrandSort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Brand>> {
    const filtered = [...this.items.values()].filter(b => matchesBrandFilter(b, filter));
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

  async save(brand: Brand): Promise<Brand> {
    this.items.set(brand.getId().toString(), brand);
    return brand;
  }

  async delete(brandId: BrandId): Promise<void> {
    this.items.delete(brandId.getValue());
  }

  async countProducts(_brandId: string, _tenantId: string): Promise<number> {
    return 0;
  }

  setProductBrand(productId: string, brandId: string): void {
    this.productBrandLinks.set(productId, brandId);
  }

  removeProductBrand(productId: string): void {
    this.productBrandLinks.delete(productId);
  }

  clear(): void {
    this.items.clear();
    this.productBrandLinks.clear();
  }

  seed(brands: Brand[]): void {
    for (const b of brands) {
      this.items.set(b.getId().toString(), b);
    }
  }
}
