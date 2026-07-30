import type { CreatePriceListCommand, UpdatePriceListCommand, SetVariantPriceCommand, SchedulePromotionCommand } from '../commands';

export class PricingValidator {
  static validateCreatePriceList(cmd: CreatePriceListCommand): string[] {
    const errors: string[] = [];
    if (!cmd.name?.trim()) errors.push('Name is required');
    if (!cmd.code?.trim()) errors.push('Code is required');
    if (cmd.code?.length > 50) errors.push('Code max 50 characters');
    if (cmd.currency && !['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'UYU', 'MXN', 'COP'].includes(cmd.currency)) {
      errors.push(`Invalid currency: ${cmd.currency}`);
    }
    return errors;
  }

  static validateUpdatePriceList(cmd: UpdatePriceListCommand): string[] {
    const errors: string[] = [];
    if (cmd.name !== undefined && !cmd.name.trim()) errors.push('Name cannot be empty');
    if (cmd.currency && !['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'UYU', 'MXN', 'COP'].includes(cmd.currency)) {
      errors.push(`Invalid currency: ${cmd.currency}`);
    }
    return errors;
  }

  static validateSetVariantPrice(cmd: SetVariantPriceCommand): string[] {
    const errors: string[] = [];
    if (!cmd.sku?.trim()) errors.push('SKU is required');
    if (cmd.listAmount < 0) errors.push('listAmount must be non-negative');
    if (cmd.costAmount != null && cmd.costAmount < 0) errors.push('costAmount must be non-negative');
    if (cmd.saleAmount != null && cmd.saleAmount < 0) errors.push('saleAmount must be non-negative');
    if (cmd.saleAmount != null && cmd.saleAmount > cmd.listAmount) errors.push('saleAmount cannot exceed listAmount');
    if (cmd.minimumQuantity != null && cmd.minimumQuantity < 1) errors.push('minimumQuantity must be >= 1');
    return errors;
  }

  static validateSchedulePromotion(cmd: SchedulePromotionCommand): string[] {
    const errors: string[] = [];
    if (cmd.promotionalAmount < 0) errors.push('Promotional amount must be non-negative');
    if (cmd.startsAt >= cmd.endsAt) errors.push('startsAt must be before endsAt');
    return errors;
  }
}
