export class InitializeInventoryCommand {
  constructor(
    public readonly tenantId: string,
    public readonly productVariantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity?: number,
  ) {}
}

export class ReceiveStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly reason: string,
    public readonly createdBy: string,
    public readonly referenceType?: string,
    public readonly referenceId?: string,
  ) {}
}

export class DispatchStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly reason: string,
    public readonly createdBy: string,
    public readonly referenceType?: string,
    public readonly referenceId?: string,
  ) {}
}

export class AdjustStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly newOnHand: number,
    public readonly reason: string,
    public readonly createdBy: string,
  ) {}
}

export class ReserveStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly referenceType: string,
    public readonly referenceId: string,
    public readonly expiresAt?: Date | null,
    public readonly createdBy?: string,
  ) {}
}

export class TransferStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly fromWarehouseId: string,
    public readonly toWarehouseId: string,
    public readonly quantity: number,
    public readonly reason: string,
    public readonly createdBy: string,
  ) {}
}

export class SetMinimumStockCommand {
  constructor(
    public readonly tenantId: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly minimumStock: number,
  ) {}
}
