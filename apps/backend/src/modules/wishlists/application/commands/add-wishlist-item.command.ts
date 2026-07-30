export class AddWishlistItemCommand {
  constructor(
    public readonly tenantId: string,
    public readonly wishlistId: string,
    public readonly productId: string,
    public readonly productVariantId?: string | null,
    public readonly sku?: string | null,
    public readonly note?: string | null,
    public readonly priority?: string,
  ) {}
}
