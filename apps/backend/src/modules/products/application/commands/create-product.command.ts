import type { ProductTypeValue, ProductVisibilityValue, ProductConditionValue } from '../../domain';

export class CreateProductCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly shortDescription?: string | null,
    public readonly description?: string | null,
    public readonly productType?: ProductTypeValue,
    public readonly visibility?: ProductVisibilityValue,
    public readonly condition?: ProductConditionValue,
    public readonly warrantyMonths?: number | null,
    public readonly seoTitle?: string | null,
    public readonly seoDescription?: string | null,
    public readonly organizationId?: string | null,
  ) {}
}
