import { InventoryItemId } from '../value-objects';
import { InventoryException, INVENTORY_ERROR_CODES } from '../exceptions';

export type InventoryPrimitives = {
  id: string;
  tenantId: string;
  warehouseId: string;
  productVariantId: string;
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  minimumStock: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export class InventoryItem {
  private id!: InventoryItemId;
  private tenantId!: string;
  private warehouseId!: string;
  private productVariantId!: string;
  private sku!: string;
  private onHand!: number;
  private reserved!: number;
  private minimumStock!: number;
  private version!: number;
  private createdAt!: Date;
  private updatedAt!: Date;

  private constructor() {}

  static create(tenantId: string, warehouseId: string, productVariantId: string, sku: string, onHand = 0): InventoryItem {
    if (onHand < 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Initial onHand cannot be negative');
    const item = new InventoryItem();
    item.id = new InventoryItemId();
    item.tenantId = tenantId;
    item.warehouseId = warehouseId;
    item.productVariantId = productVariantId;
    item.sku = sku;
    item.onHand = onHand;
    item.reserved = 0;
    item.minimumStock = 0;
    item.version = 1;
    item.createdAt = new Date();
    item.updatedAt = new Date();
    return item;
  }

  static fromPrimitives(p: InventoryPrimitives): InventoryItem {
    const item = new InventoryItem();
    item.id = new InventoryItemId(p.id);
    item.tenantId = p.tenantId;
    item.warehouseId = p.warehouseId;
    item.productVariantId = p.productVariantId;
    item.sku = p.sku;
    item.onHand = p.onHand;
    item.reserved = p.reserved;
    item.minimumStock = p.minimumStock;
    item.version = p.version;
    item.createdAt = p.createdAt;
    item.updatedAt = p.updatedAt;
    return item;
  }

  toPrimitives(): InventoryPrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId,
      warehouseId: this.warehouseId, productVariantId: this.productVariantId,
      sku: this.sku, onHand: this.onHand, reserved: this.reserved,
      available: this.getAvailable(), minimumStock: this.minimumStock,
      version: this.version, createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }

  getId(): InventoryItemId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getWarehouseId(): string { return this.warehouseId; }
  getProductVariantId(): string { return this.productVariantId; }
  getSku(): string { return this.sku; }
  getOnHand(): number { return this.onHand; }
  getReserved(): number { return this.reserved; }
  getAvailable(): number { return this.onHand - this.reserved; }
  getMinimumStock(): number { return this.minimumStock; }
  getVersion(): number { return this.version; }
  isLowStock(): boolean { return this.onHand <= this.minimumStock; }

  receive(quantity: number): void {
    if (quantity <= 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Receive quantity must be positive');
    this.onHand += quantity;
    this.version++;
    this.touch();
  }

  dispatch(quantity: number): void {
    if (quantity <= 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Dispatch quantity must be positive');
    if (quantity > this.getAvailable()) throw new InventoryException(INVENTORY_ERROR_CODES.INSUFFICIENT_STOCK, `Insufficient available stock: ${this.getAvailable()} < ${quantity}`);
    this.onHand -= quantity;
    this.version++;
    this.touch();
  }

  adjust(newOnHand: number): void {
    if (newOnHand < 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Adjusted onHand cannot be negative');
    const delta = newOnHand - this.onHand;
    if (delta < 0 && Math.abs(delta) > this.getAvailable()) throw new InventoryException(INVENTORY_ERROR_CODES.INSUFFICIENT_STOCK, 'Adjustment would make available negative');
    this.onHand = newOnHand;
    this.version++;
    this.touch();
  }

  reserve(quantity: number): void {
    if (quantity <= 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Reserve quantity must be positive');
    if (quantity > this.getAvailable()) throw new InventoryException(INVENTORY_ERROR_CODES.INSUFFICIENT_STOCK, `Insufficient available stock to reserve: ${this.getAvailable()} < ${quantity}`);
    this.reserved += quantity;
    this.version++;
    this.touch();
  }

  releaseReservation(quantity: number): void {
    if (quantity <= 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Release quantity must be positive');
    if (quantity > this.reserved) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Release quantity exceeds reserved');
    this.reserved -= quantity;
    this.version++;
    this.touch();
  }

  consumeReservation(quantity: number): void {
    if (quantity <= 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Consume quantity must be positive');
    if (quantity > this.reserved) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Consume quantity exceeds reserved');
    this.onHand -= quantity;
    this.reserved -= quantity;
    this.version++;
    this.touch();
  }

  setMinimumStock(value: number): void {
    if (value < 0) throw new InventoryException(INVENTORY_ERROR_CODES.INVALID_STOCK_QUANTITY, 'Minimum stock cannot be negative');
    this.minimumStock = value;
    this.touch();
  }

  incrementVersion(): void { this.version++; }

  private touch(): void { this.updatedAt = new Date(); }
}
