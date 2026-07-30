import type { AddressPrimitives } from '../../domain';
import type { StartCheckoutCommand, UpdateAddressCommand } from '../commands';

export class CheckoutValidator {
  static validateStart(cmd: StartCheckoutCommand): string[] {
    const errors: string[] = [];
    if (!cmd.cartId?.trim()) errors.push('cartId is required');
    return errors;
  }

  static validateAddress(addr: AddressPrimitives): string[] {
    const errors: string[] = [];
    if (!addr.recipientName?.trim()) errors.push('recipientName is required');
    if (!addr.street?.trim()) errors.push('street is required');
    if (!addr.number?.trim()) errors.push('number is required');
    if (!addr.city?.trim()) errors.push('city is required');
    if (!addr.province?.trim()) errors.push('province is required');
    if (!addr.postalCode?.trim()) errors.push('postalCode is required');
    return errors;
  }
}
