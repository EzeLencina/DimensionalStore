export class SetDefaultVariantCommand {
  constructor(
    public readonly variantId: string,
    public readonly tenantId: string,
    public readonly productId: string,
  ) {}
}
