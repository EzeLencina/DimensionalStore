import type { Cart } from '../../domain';
import type { CartResponseDto, CartItemResponseDto, CreateGuestCartResponseDto } from '../dto';

export class CartMapper {
  static toResponse(cart: Cart): CartResponseDto {
    const p = cart.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, status: p.status, currency: p.currency,
      itemsCount: p.itemsCount, subtotal: p.subtotal, total: p.total,
      expiresAt: p.expiresAt.toISOString(), version: p.version,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      items: p.items.map(i => ({
        id: i.id, productVariantId: i.productVariantId, sku: i.sku,
        quantity: i.quantity, unitPriceSnapshot: i.unitPriceSnapshot,
        subtotalSnapshot: i.subtotalSnapshot, addedAt: i.addedAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      isGuest: cart.isGuest(),
    };
  }

  static toGuestResponse(cart: Cart, rawToken: string): CreateGuestCartResponseDto {
    return { cart: CartMapper.toResponse(cart), guestToken: rawToken };
  }
}
