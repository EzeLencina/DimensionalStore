import type { ReceiveStockCommand, DispatchStockCommand, AdjustStockCommand, ReserveStockCommand, TransferStockCommand, InitializeInventoryCommand } from '../commands/inventory.commands';

export class InventoryValidator {
  static validateReceive(cmd: ReceiveStockCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.warehouseId) errors.push('warehouseId is required');
    if (!cmd.quantity || cmd.quantity <= 0) errors.push('quantity must be positive');
    if (!cmd.reason) errors.push('reason is required');
    if (!cmd.createdBy) errors.push('createdBy is required');
    return errors;
  }

  static validateDispatch(cmd: DispatchStockCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.warehouseId) errors.push('warehouseId is required');
    if (!cmd.quantity || cmd.quantity <= 0) errors.push('quantity must be positive');
    if (!cmd.reason) errors.push('reason is required');
    if (!cmd.createdBy) errors.push('createdBy is required');
    return errors;
  }

  static validateAdjust(cmd: AdjustStockCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.warehouseId) errors.push('warehouseId is required');
    if (cmd.newOnHand < 0) errors.push('newOnHand cannot be negative');
    if (!cmd.reason) errors.push('reason is required');
    if (!cmd.createdBy) errors.push('createdBy is required');
    return errors;
  }

  static validateReserve(cmd: ReserveStockCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.warehouseId) errors.push('warehouseId is required');
    if (!cmd.quantity || cmd.quantity <= 0) errors.push('quantity must be positive');
    if (!cmd.referenceType) errors.push('referenceType is required');
    if (!cmd.referenceId) errors.push('referenceId is required');
    return errors;
  }

  static validateTransfer(cmd: TransferStockCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.fromWarehouseId) errors.push('fromWarehouseId is required');
    if (!cmd.toWarehouseId) errors.push('toWarehouseId is required');
    if (cmd.fromWarehouseId === cmd.toWarehouseId) errors.push('source and destination warehouses must be different');
    if (!cmd.quantity || cmd.quantity <= 0) errors.push('quantity must be positive');
    if (!cmd.reason) errors.push('reason is required');
    if (!cmd.createdBy) errors.push('createdBy is required');
    return errors;
  }

  static validateInitialize(cmd: InitializeInventoryCommand): string[] {
    const errors: string[] = [];
    if (!cmd.tenantId) errors.push('tenantId is required');
    if (!cmd.productVariantId) errors.push('productVariantId is required');
    if (!cmd.sku) errors.push('sku is required');
    if (!cmd.warehouseId) errors.push('warehouseId is required');
    return errors;
  }
}
