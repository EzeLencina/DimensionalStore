import type { CreateVariantCommand } from '../commands/create-variant.command';
import type { UpdateVariantCommand } from '../commands/update-variant.command';
import type { ChangeVariantSkuCommand } from '../commands/change-variant-sku.command';
import { SKU } from '../../domain/value-objects/sku';
import { Barcode } from '../../domain/value-objects/barcode';
import { VariantAttributes } from '../../domain/value-objects/variant-attributes';

export class VariantValidator {
  static validateCreate(command: CreateVariantCommand): string[] {
    const errors: string[] = [];

    if (!command.tenantId) errors.push('tenantId is required');
    if (!command.productId) errors.push('productId is required');
    if (!command.sku) errors.push('sku is required');

    if (command.sku) {
      try { SKU.create(command.sku); }
      catch { errors.push('Invalid SKU format'); }
    }

    if (command.barcode) {
      try { Barcode.create(command.barcode); }
      catch { errors.push('Invalid barcode format'); }
    }

    if (command.attributes && command.attributes.length > 0) {
      try { VariantAttributes.create(command.attributes); }
      catch (e: any) { errors.push(e.message); }
    }

    if (command.status) {
      const valid = ['ACTIVE', 'INACTIVE', 'ARCHIVED'];
      if (!valid.includes(command.status.toUpperCase())) {
        errors.push(`Invalid status: ${command.status}`);
      }
    }

    return errors;
  }

  static validateUpdate(command: UpdateVariantCommand): string[] {
    const errors: string[] = [];

    if (command.barcode) {
      try { Barcode.create(command.barcode); }
      catch { errors.push('Invalid barcode format'); }
    }

    if (command.name !== undefined && command.name !== null && !command.name.trim()) {
      errors.push('Variant name cannot be empty');
    }

    return errors;
  }

  static validateSkuChange(command: ChangeVariantSkuCommand): string[] {
    const errors: string[] = [];

    if (!command.sku) {
      errors.push('sku is required');
    } else {
      try { SKU.create(command.sku); }
      catch { errors.push('Invalid SKU format'); }
    }

    return errors;
  }
}
