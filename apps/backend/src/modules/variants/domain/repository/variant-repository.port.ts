import type { ProductVariant } from '../aggregates/product-variant.aggregate';
import type { VariantId } from '../value-objects/variant-id';
import type { VariantFilter, VariantSort, PaginatedResult } from '../specifics/variant-specifications';

export const VARIANT_REPOSITORY = 'VARIANT_REPOSITORY';

export interface VariantRepository {
  save(variant: ProductVariant): Promise<ProductVariant>;
  findById(id: VariantId, tenantId: string): Promise<ProductVariant | null>;
  findBySku(sku: string, tenantId: string): Promise<ProductVariant | null>;
  existsBySku(sku: string, tenantId: string, excludeId?: string): Promise<boolean>;
  listByProduct(productId: string, tenantId: string): Promise<ProductVariant[]>;
  findDefaultByProduct(productId: string, tenantId: string): Promise<ProductVariant | null>;
  existsAttributeCombination(
    productId: string,
    tenantId: string,
    attributes: { name: string; value: string }[],
    excludeId?: string,
  ): Promise<boolean>;
  countByProduct(productId: string, tenantId: string): Promise<number>;
  findFiltered(
    filter: VariantFilter,
    sort?: VariantSort,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<ProductVariant>>;
  delete(variantId: VariantId, tenantId: string): Promise<void>;
}
