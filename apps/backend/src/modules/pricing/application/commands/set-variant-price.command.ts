export class SetVariantPriceCommand {
  constructor(
    public readonly tenantId: string,
    public readonly priceListId: string,
    public readonly productVariantId: string,
    public readonly sku: string,
    public readonly listAmount: number,
    public readonly costAmount?: number | null,
    public readonly saleAmount?: number | null,
    public readonly minimumQuantity?: number,
  ) {}
}
