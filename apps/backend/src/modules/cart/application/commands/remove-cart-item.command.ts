export class RemoveCartItemCommand {
  constructor(public readonly tenantId: string, public readonly productVariantId: string) {}
}
