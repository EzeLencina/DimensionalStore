import type { WishlistPriorityValue } from '../../domain';

export class UpdateWishlistItemCommand { constructor(public readonly tenantId: string, public readonly wishlistId: string, public readonly itemId: string, public readonly note?: string | null, public readonly priority?: WishlistPriorityValue) {} }
