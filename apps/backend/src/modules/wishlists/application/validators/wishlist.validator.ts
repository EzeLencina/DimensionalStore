import type { AddWishlistItemCommand, AddAllAvailableItemsToCartCommand, CreateWishlistCommand, RenameWishlistCommand, UpdateWishlistItemCommand } from '../commands';

export class WishlistValidator {
  static validateCreate(cmd: CreateWishlistCommand): string[] { return cmd.customerId?.trim() ? [] : ['customerId is required']; }
  static validateRename(cmd: RenameWishlistCommand): string[] { return cmd.name?.trim() ? [] : ['name is required']; }
  static validateItem(cmd: AddWishlistItemCommand): string[] { return cmd.productId?.trim() ? [] : ['productId is required']; }
  static validateBatch(cmd: AddAllAvailableItemsToCartCommand): string[] { return cmd.wishlistId?.trim() ? [] : ['wishlistId is required']; }
}
