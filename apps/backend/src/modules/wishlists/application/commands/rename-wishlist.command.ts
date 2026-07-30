export class RenameWishlistCommand {
  constructor(public readonly tenantId: string, public readonly wishlistId: string, public readonly name: string) {}
}
