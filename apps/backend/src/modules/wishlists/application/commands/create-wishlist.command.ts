export class CreateWishlistCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly name: string, public readonly isDefault = false) {}
}
