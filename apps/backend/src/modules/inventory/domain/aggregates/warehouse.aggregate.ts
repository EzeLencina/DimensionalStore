import { WarehouseId, WarehouseCode } from '../value-objects';
import { InventoryException, INVENTORY_ERROR_CODES } from '../exceptions';

export type WarehousePrimitives = {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string | null;
  status: string;
  isDefault: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type WarehouseCreateParams = {
  tenantId: string;
  name: string;
  code: string;
  address?: string | null;
  status?: string;
  isDefault?: boolean;
};

export class Warehouse {
  private id!: WarehouseId;
  private tenantId!: string;
  private name!: string;
  private code!: WarehouseCode;
  private address!: string | null;
  private status!: string;
  private isDefault!: boolean;
  private deletedAt!: Date | null;
  private createdAt!: Date;
  private updatedAt!: Date;

  private constructor() {}

  static create(params: WarehouseCreateParams): Warehouse {
    const w = new Warehouse();
    w.id = new WarehouseId();
    w.tenantId = params.tenantId;
    w.name = params.name.trim();
    w.code = WarehouseCode.create(params.code);
    w.address = params.address ?? null;
    w.status = params.status ?? 'ACTIVE';
    w.isDefault = params.isDefault ?? false;
    w.deletedAt = null;
    w.createdAt = new Date();
    w.updatedAt = new Date();
    if (!w.name) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, 'Warehouse name is required');
    return w;
  }

  static fromPrimitives(p: WarehousePrimitives): Warehouse {
    const w = new Warehouse();
    w.id = new WarehouseId(p.id);
    w.tenantId = p.tenantId;
    w.name = p.name;
    w.code = WarehouseCode.create(p.code);
    w.address = p.address;
    w.status = p.status;
    w.isDefault = p.isDefault;
    w.deletedAt = p.deletedAt;
    w.createdAt = p.createdAt;
    w.updatedAt = p.updatedAt;
    return w;
  }

  toPrimitives(): WarehousePrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId, name: this.name,
      code: this.code.toString(), address: this.address,
      status: this.status, isDefault: this.isDefault,
      deletedAt: this.deletedAt, createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }

  getId(): WarehouseId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getName(): string { return this.name; }
  getCode(): WarehouseCode { return this.code; }
  getAddress(): string | null { return this.address; }
  getStatus(): string { return this.status; }
  getIsDefault(): boolean { return this.isDefault; }
  hasBeenDeleted(): boolean { return this.deletedAt !== null; }

  rename(name: string): void {
    this.assertNotDeleted();
    this.name = name.trim();
    this.touch();
  }

  setAsDefault(): void { this.isDefault = true; this.touch(); }
  unsetDefault(): void { this.isDefault = false; this.touch(); }

  activate(): void { this.assertNotDeleted(); this.status = 'ACTIVE'; this.touch(); }
  deactivate(): void { this.assertNotDeleted(); this.status = 'INACTIVE'; this.touch(); }
  softDelete(): void { if (this.deletedAt !== null) return; this.deletedAt = new Date(); this.touch(); }

  private touch(): void { this.updatedAt = new Date(); }
  private assertNotDeleted(): void {
    if (this.deletedAt !== null) throw new InventoryException(INVENTORY_ERROR_CODES.INVENTORY_INVALID_DATA, 'Cannot modify a deleted warehouse');
  }
}
