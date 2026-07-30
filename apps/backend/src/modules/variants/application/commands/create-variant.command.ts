import type { VariantAttribute } from '../../domain';

export class CreateVariantCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly sku: string,
    public readonly name?: string | null,
    public readonly barcode?: string | null,
    public readonly status?: string,
    public readonly attributes?: VariantAttribute[],
    public readonly isDefault?: boolean,
  ) {}
}
