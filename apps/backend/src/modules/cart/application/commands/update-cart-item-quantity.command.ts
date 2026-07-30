export class UpdateCartItemQuantityCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productVariantId: string,
    public readonly quantity: number,
  ) {}
}
