import type { AddCartItemCommand, UpdateCartItemQuantityCommand } from '../commands';

export class CartValidator {
  static validateAddItem(cmd: AddCartItemCommand): string[] {
    const errors: string[] = [];
    if (!cmd.productVariantId?.trim()) errors.push('productVariantId is required');
    if (!Number.isInteger(cmd.quantity) || cmd.quantity < 1) errors.push('quantity must be a positive integer');
    if (cmd.quantity > 999999) errors.push('quantity exceeds maximum');
    return errors;
  }

  static validateUpdateQuantity(cmd: UpdateCartItemQuantityCommand): string[] {
    const errors: string[] = [];
    if (!cmd.productVariantId?.trim()) errors.push('productVariantId is required');
    if (!Number.isInteger(cmd.quantity) || cmd.quantity < 1) errors.push('quantity must be a positive integer');
    if (cmd.quantity > 999999) errors.push('quantity exceeds maximum');
    return errors;
  }
}
