import { WishlistAppService } from '../services';
import { InMemoryWishlistRepository, InMemoryWishlistItemRepository } from '../infrastructure';
import { CreateWishlistCommand, AddWishlistItemCommand } from '../application/commands';

describe('WishlistAppService', () => {
  let service: WishlistAppService;

  beforeEach(() => {
    const wishlistRepo = new InMemoryWishlistRepository();
    const itemRepo = new InMemoryWishlistItemRepository();
    const productReader = { getProduct: async () => ({ id: 'product-1', name: 'Product', slug: 'product', primaryImage: null, status: 'ACTIVE', visibility: 'VISIBLE', deletedAt: null }) };
    const variantReader = { getVariant: async () => ({ id: 'variant-1', productId: 'product-1', name: 'Variant', sku: 'SKU-1', status: 'ACTIVE', deletedAt: null }) };
    const pricingResolver = { resolveEffectivePrice: async () => ({ amount: 1000, currency: 'ARS' }) };
    const inventoryReader = { getAvailableStock: async () => 3 };
    const cartService = { addItem: async () => ({ cartId: 'cart-1' }) };
    const customerReader = { exists: async () => true };
    const clock = { now: () => new Date() };
    const actor = { getType: () => 'SYSTEM', getId: () => null };
    const logger = { info: () => {}, warn: () => {}, error: () => {} };

    service = new WishlistAppService(wishlistRepo as never, itemRepo as never, productReader as never, variantReader as never, pricingResolver as never, inventoryReader as never, cartService as never, customerReader as never, clock as never, actor as never, logger as never);
  });

  it('creates a wishlist and adds an item', async () => {
    const created = await service.createWishlist(new CreateWishlistCommand('tenant-1', 'customer-1', 'Favoritos'));
    const updated = await service.addWishlistItem(new AddWishlistItemCommand('tenant-1', created.id, 'product-1', 'variant-1', 'SKU-1'));

    expect(created.name).toBe('Favoritos');
    expect(updated.items).toHaveLength(1);
  });
});
