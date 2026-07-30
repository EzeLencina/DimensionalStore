# Wishlists

Module for authenticated and guest wishlists.

## Notes
- Reuses `Customer`, `Product`, `ProductVariant`, `CartService`, pricing and inventory readers.
- Guest wishlists are keyed by a hashed token, never by raw token.
- Prisma models: `Wishlist` and `WishlistItem`.
