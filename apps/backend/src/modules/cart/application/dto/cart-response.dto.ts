export type CartItemResponseDto = {
  id: string; productVariantId: string; sku: string;
  quantity: number; unitPriceSnapshot: number;
  subtotalSnapshot: number; addedAt: string; updatedAt: string;
};

export type CartResponseDto = {
  id: string; tenantId: string; status: string; currency: string;
  itemsCount: number; subtotal: number; total: number;
  expiresAt: string; version: number;
  createdAt: string; updatedAt: string;
  items: CartItemResponseDto[];
  isGuest: boolean;
};

export type CreateGuestCartResponseDto = {
  cart: CartResponseDto;
  guestToken: string;
};
