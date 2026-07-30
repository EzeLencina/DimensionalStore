import { Provider } from '@nestjs/common';
import { WISHLIST_ITEM_REPOSITORY, WISHLIST_REPOSITORY } from '../domain';
import { PrismaWishlistItemRepository, PrismaWishlistRepository } from '../infrastructure';
import { WishlistAppService } from '../services';

export const WishlistRepositoryProvider: Provider = { provide: WISHLIST_REPOSITORY, useClass: PrismaWishlistRepository };
export const WishlistItemRepositoryProvider: Provider = { provide: WISHLIST_ITEM_REPOSITORY, useClass: PrismaWishlistItemRepository };

export const WISHLIST_PROVIDERS: Provider[] = [WishlistRepositoryProvider, WishlistItemRepositoryProvider, WishlistAppService];
