import {
  VariantId, SKU, Barcode, VariantName,
  VariantStatus, VariantAttributes,
  type VariantStatusValue, type VariantAttribute,
} from '../value-objects';
import { VariantException, VARIANT_ERROR_CODES } from '../exceptions';
import {
  DomainEvent,
  ProductVariantCreatedEvent,
  ProductVariantSkuChangedEvent,
  ProductVariantAttributesChangedEvent,
  ProductVariantActivatedEvent,
  ProductVariantDeactivatedEvent,
  ProductVariantArchivedEvent,
  ProductVariantRestoredEvent,
  ProductVariantSetAsDefaultEvent,
  ProductVariantDeletedEvent,
} from '../events';

export type VariantPrimitives = {
  id: string;
  tenantId: string;
  productId: string;
  sku: string;
  name: string | null;
  barcode: string | null;
  status: VariantStatusValue;
  attributes: { name: string; value: string }[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

type VariantCreateParams = {
  tenantId: string;
  productId: string;
  sku: string;
  name?: string | null;
  barcode?: string | null;
  status?: VariantStatusValue;
  attributes?: { name: string; value: string }[];
  isDefault?: boolean;
};

export class ProductVariant {
  private id!: VariantId;
  private tenantId!: string;
  private productId!: string;
  private sku!: SKU;
  private name!: VariantName | null;
  private barcode!: Barcode | null;
  private status!: VariantStatus;
  private attributes!: VariantAttributes;
  private isDefault!: boolean;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt!: Date | null;
  private version!: number;

  private readonly events: DomainEvent[] = [];

  private constructor() {}

  static create(params: VariantCreateParams): ProductVariant {
    const v = new ProductVariant();
    v.id = new VariantId();
    v.tenantId = params.tenantId;
    v.productId = params.productId;
    v.sku = SKU.create(params.sku);
    v.name = params.name ? VariantName.create(params.name) : null;
    v.barcode = params.barcode ? Barcode.create(params.barcode) : null;
    v.status = VariantStatus.create(params.status ?? 'ACTIVE');
    v.attributes = params.attributes && params.attributes.length > 0
      ? VariantAttributes.create(params.attributes)
      : VariantAttributes.empty();
    v.isDefault = params.isDefault ?? false;
    v.createdAt = new Date();
    v.updatedAt = new Date();
    v.deletedAt = null;
    v.version = 1;

    v.raise(new ProductVariantCreatedEvent(
      v.id.toString(), v.tenantId, v.productId, v.sku.toString(),
    ));

    return v;
  }

  static fromPrimitives(primitives: VariantPrimitives): ProductVariant {
    const v = new ProductVariant();
    v.id = new VariantId(primitives.id);
    v.tenantId = primitives.tenantId;
    v.productId = primitives.productId;
    v.sku = SKU.create(primitives.sku);
    v.name = primitives.name ? VariantName.create(primitives.name) : null;
    v.barcode = primitives.barcode ? Barcode.create(primitives.barcode) : null;
    v.status = VariantStatus.create(primitives.status);
    v.attributes = primitives.attributes && primitives.attributes.length > 0
      ? VariantAttributes.create(primitives.attributes)
      : VariantAttributes.empty();
    v.isDefault = primitives.isDefault;
    v.createdAt = primitives.createdAt;
    v.updatedAt = primitives.updatedAt;
    v.deletedAt = primitives.deletedAt;
    v.version = primitives.version;
    return v;
  }

  toPrimitives(): VariantPrimitives {
    return {
      id: this.id.toString(),
      tenantId: this.tenantId,
      productId: this.productId,
      sku: this.sku.toString(),
      name: this.name?.toString() ?? null,
      barcode: this.barcode?.toString() ?? null,
      status: this.status.getValue(),
      attributes: this.attributes.toArray(),
      isDefault: this.isDefault,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      version: this.version,
    };
  }

  getId(): VariantId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getProductId(): string { return this.productId; }
  getSku(): SKU { return this.sku; }
  getName(): VariantName | null { return this.name; }
  getBarcode(): Barcode | null { return this.barcode; }
  getStatus(): VariantStatus { return this.status; }
  getAttributes(): VariantAttributes { return this.attributes; }
  getIsDefault(): boolean { return this.isDefault; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  getDeletedAt(): Date | null { return this.deletedAt; }
  getVersion(): number { return this.version; }

  hasBeenDeleted(): boolean { return this.deletedAt !== null; }
  isActive(): boolean { return this.status.isActive() && !this.hasBeenDeleted(); }
  isArchived(): boolean { return this.status.isArchived(); }
  isDefaultVariant(): boolean { return this.isDefault; }

  rename(newName: string | null): void {
    this.assertNotDeleted();
    this.name = newName ? VariantName.create(newName) : null;
    this.touch();
  }

  changeSku(newSku: string): void {
    this.assertNotDeleted();
    const oldSku = this.sku.toString();
    this.sku = SKU.create(newSku);
    this.touch();
    this.raise(new ProductVariantSkuChangedEvent(
      this.id.toString(), this.tenantId, oldSku, this.sku.toString(),
    ));
  }

  changeBarcode(newBarcode: string | null): void {
    this.assertNotDeleted();
    this.barcode = newBarcode ? Barcode.create(newBarcode) : null;
    this.touch();
  }

  updateAttributes(attrs: VariantAttribute[]): void {
    this.assertNotDeleted();
    this.attributes = attrs.length > 0
      ? VariantAttributes.create(attrs)
      : VariantAttributes.empty();
    this.touch();
    this.raise(new ProductVariantAttributesChangedEvent(
      this.id.toString(), this.tenantId,
    ));
  }

  activate(): void {
    this.assertNotDeleted();
    if (this.isArchived()) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        'Cannot activate an archived variant. Restore first.',
      );
    }
    if (this.status.canActivate()) {
      this.status = VariantStatus.active();
      this.touch();
      this.raise(new ProductVariantActivatedEvent(this.id.toString(), this.tenantId));
    }
  }

  deactivate(): void {
    this.assertNotDeleted();
    if (!this.status.canDeactivate()) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        `Cannot deactivate from ${this.status.getValue()}`,
      );
    }
    this.status = VariantStatus.inactive();
    this.touch();
    this.raise(new ProductVariantDeactivatedEvent(this.id.toString(), this.tenantId));
  }

  archive(): void {
    this.assertNotDeleted();
    if (this.isDefault) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        'Cannot archive the default variant. Set another variant as default first.',
      );
    }
    if (!this.status.canArchive()) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        `Cannot archive from ${this.status.getValue()}`,
      );
    }
    this.status = VariantStatus.archived();
    this.touch();
    this.raise(new ProductVariantArchivedEvent(this.id.toString(), this.tenantId));
  }

  restore(): void {
    if (!this.isArchived()) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        'Only archived variants can be restored',
      );
    }
    this.status = VariantStatus.active();
    this.touch();
    this.raise(new ProductVariantRestoredEvent(this.id.toString(), this.tenantId));
  }

  setAsDefault(): void {
    this.assertNotDeleted();
    if (this.isArchived()) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_INVALID_STATUS_TRANSITION,
        'Cannot set an archived variant as default',
      );
    }
    this.isDefault = true;
    this.touch();
    this.raise(new ProductVariantSetAsDefaultEvent(
      this.id.toString(), this.tenantId, this.productId,
    ));
  }

  unsetDefault(): void {
    this.assertNotDeleted();
    this.isDefault = false;
    this.touch();
  }

  softDelete(): void {
    if (this.deletedAt !== null) return;
    this.deletedAt = new Date();
    this.touch();
    this.raise(new ProductVariantDeletedEvent(this.id.toString(), this.tenantId));
  }

  getEvents(): DomainEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events.length = 0;
  }

  incrementVersion(): void {
    this.version++;
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private assertNotDeleted(): void {
    if (this.deletedAt !== null) {
      throw new VariantException(
        VARIANT_ERROR_CODES.VARIANT_DELETED,
        'Cannot modify a deleted variant',
      );
    }
  }

  private raise(event: DomainEvent): void {
    this.events.push(event);
  }
}
