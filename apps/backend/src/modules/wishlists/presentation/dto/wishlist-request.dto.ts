import type { WishlistPriorityValue } from '../../domain';

export type CreateWishlistRequestDto = { name?: string; isDefault?: boolean };
export type WishlistItemRequestDto = { productId: string; productVariantId?: string | null; sku?: string | null; note?: string | null; priority?: string };
export type UpdateWishlistItemRequestDto = { note?: string | null; priority?: WishlistPriorityValue };
