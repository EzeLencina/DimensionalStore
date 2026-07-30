import type { VariantRepository } from '../../../domain/repository';
import type { VariantFilter, VariantSort, PaginatedResult } from '../../../domain/specifics';
import { ProductVariant, VariantId, matchesVariantFilter } from '../../../domain';

export class InMemoryVariantRepository implements VariantRepository {
  private items: Map<string, ProductVariant> = new Map();

  async findById(id: VariantId, tenantId: string): Promise<ProductVariant | null> {
    const v = this.items.get(id.getValue());
    if (!v || v.getTenantId() !== tenantId) return null;
    return v;
  }

  async findBySku(sku: string, tenantId: string): Promise<ProductVariant | null> {
    for (const v of this.items.values()) {
      if (v.getTenantId() === tenantId && v.getSku().toString() === sku) {
        return v;
      }
    }
    return null;
  }

  async existsBySku(sku: string, tenantId: string, excludeId?: string): Promise<boolean> {
    const found = await this.findBySku(sku, tenantId);
    if (!found) return false;
    if (excludeId && found.getId().toString() !== excludeId) return true;
    return excludeId ? false : true;
  }

  async listByProduct(productId: string, tenantId: string): Promise<ProductVariant[]> {
    return [...this.items.values()]
      .filter(v => v.getProductId() === productId && v.getTenantId() === tenantId)
      .sort((a, b) => a.getSku().toString().localeCompare(b.getSku().toString()));
  }

  async findDefaultByProduct(productId: string, tenantId: string): Promise<ProductVariant | null> {
    for (const v of this.items.values()) {
      if (
        v.getProductId() === productId &&
        v.getTenantId() === tenantId &&
        v.getIsDefault() &&
        !v.hasBeenDeleted()
      ) {
        return v;
      }
    }
    return null;
  }

  async existsAttributeCombination(
    productId: string,
    tenantId: string,
    attributes: { name: string; value: string }[],
    excludeId?: string,
  ): Promise<boolean> {
    const key = attributes.map(a => `${a.name}:${a.value}`).sort().join('|');
    for (const v of this.items.values()) {
      if (v.getProductId() !== productId || v.getTenantId() !== tenantId) continue;
      if (excludeId && v.getId().toString() === excludeId) continue;
      const existingKey = v.getAttributes().toArray()
        .map(a => `${a.name}:${a.value}`).sort().join('|');
      if (key && existingKey === key) return true;
    }
    return false;
  }

  async countByProduct(productId: string, tenantId: string): Promise<number> {
    let count = 0;
    for (const v of this.items.values()) {
      if (v.getProductId() === productId && v.getTenantId() === tenantId && !v.hasBeenDeleted()) {
        count++;
      }
    }
    return count;
  }

  async findFiltered(
    filter: VariantFilter,
    _sort?: VariantSort,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<ProductVariant>> {
    const filtered = [...this.items.values()]
      .filter(v => matchesVariantFilter(v, filter));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return {
      data, total: filtered.length, page, limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async save(variant: ProductVariant): Promise<ProductVariant> {
    this.items.set(variant.getId().toString(), variant);
    return variant;
  }

  async delete(variantId: VariantId, tenantId: string): Promise<void> {
    const v = this.items.get(variantId.getValue());
    if (v && v.getTenantId() === tenantId) {
      this.items.delete(variantId.getValue());
    }
  }

  clear(): void {
    this.items.clear();
  }

  seed(variants: ProductVariant[]): void {
    for (const v of variants) {
      this.items.set(v.getId().toString(), v);
    }
  }
}
