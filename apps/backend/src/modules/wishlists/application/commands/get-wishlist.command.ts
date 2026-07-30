export class GetWishlistCommand {
  constructor(public readonly tenantId: string, public readonly wishlistId: string) {}
}
