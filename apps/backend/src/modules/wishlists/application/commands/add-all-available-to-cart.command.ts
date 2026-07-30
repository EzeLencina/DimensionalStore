export class AddAllAvailableItemsToCartCommand { constructor(public readonly tenantId: string, public readonly wishlistId: string, public readonly customerId: string | null) {} }
