export class SetDefaultWishlistCommand {
  constructor(public readonly tenantId: string, public readonly wishlistId: string) {}
}
