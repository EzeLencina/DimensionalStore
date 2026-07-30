export type WishlistItemResponseDto = {
  id: string; productId: string; productVariantId: string | null; sku: string | null; productName?: string | null; variantName?: string | null; slug?: string | null; primaryImage?: string | null; currentPrice?: number | null; currency?: string | null; inStock?: boolean | null; availableQuantity?: number | null; purchasable?: boolean | null; addedAt: string; note: string | null; priority: string;
};

export type WishlistResponseDto = {
  id: string; tenantId: string; customerId: string | null; guestTokenHash?: string | null; name: string; status: string; isDefault: boolean; expiresAt: string | null; createdAt: string; updatedAt: string; deletedAt: string | null; version: number; items: WishlistItemResponseDto[];
};

export type WishlistListResponseDto = { items: WishlistResponseDto[]; total: number; limit: number; offset: number };
