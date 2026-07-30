import { Wishlist, WishlistItem, GuestWishlistToken } from '..';

describe('Wishlist Aggregate', () => {
  it('adds and merges items', () => {
    const wishlist = Wishlist.createDefault({ tenantId: 'tenant-1', customerId: 'customer-1', name: 'Favoritos' });
    const item = WishlistItem.create({ tenantId: 'tenant-1', wishlistId: wishlist.getId(), productId: 'product-1', productVariantId: 'variant-1', sku: 'SKU-1' });
    wishlist.addItem(item);
    expect(wishlist.getItems()).toHaveLength(1);

    const guest = Wishlist.createDefault({ tenantId: 'tenant-1', guestToken: new GuestWishlistToken('guest-token') });
    guest.addItem(WishlistItem.create({ tenantId: 'tenant-1', wishlistId: guest.getId(), productId: 'product-2' }));
    wishlist.merge(guest);

    expect(wishlist.getItems()).toHaveLength(2);
  });
});
