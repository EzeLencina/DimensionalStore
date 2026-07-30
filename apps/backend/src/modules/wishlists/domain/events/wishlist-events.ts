import { DomainEvent } from './domain-event';

export class WishlistCreatedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.created'); } }
export class WishlistRenamedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.renamed'); } }
export class WishlistSetAsDefaultEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.default_set'); } }
export class WishlistItemAddedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly itemId: string, public readonly tenantId: string) { super('wishlists.wishlist.item_added'); } }
export class WishlistItemRemovedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly itemId: string, public readonly tenantId: string) { super('wishlists.wishlist.item_removed'); } }
export class WishlistItemMovedToCartEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly itemId: string, public readonly tenantId: string) { super('wishlists.wishlist.item_moved_to_cart'); } }
export class GuestWishlistMergedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.guest_merged'); } }
export class WishlistArchivedEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.archived'); } }
export class WishlistExpiredEvent extends DomainEvent { constructor(public readonly wishlistId: string, public readonly tenantId: string) { super('wishlists.wishlist.expired'); } }
