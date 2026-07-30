import {
  ProductId, ProductName, ProductSlug, ShortDescription,
  ProductDescription, SeoTitle, SeoDescription, WarrantyPeriod,
  ProductStatus, ProductVisibility, ProductCondition, ProductType,
  type ProductStatusValue, type ProductVisibilityValue,
  type ProductConditionValue, type ProductTypeValue,
} from '../value-objects';
import { ProductException, PRODUCT_ERROR_CODES } from '../exceptions';
import {
  ProductCreatedEvent, ProductRenamedEvent,
  ProductActivatedEvent, ProductDeactivatedEvent,
  ProductArchivedEvent, ProductRestoredEvent,
  ProductVisibilityChangedEvent, ProductSeoUpdatedEvent,
  ProductDeletedEvent, DomainEvent,
} from '../events';

export type ProductPrimitives = {
  id: string;
  tenantId: string;
  organizationId: string | null;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  productType: ProductTypeValue;
  status: ProductStatusValue;
  visibility: ProductVisibilityValue;
  condition: ProductConditionValue;
  warrantyMonths: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

type ProductCreateParams = {
  tenantId: string;
  organizationId?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  productType?: ProductTypeValue;
  status?: ProductStatusValue;
  visibility?: ProductVisibilityValue;
  condition?: ProductConditionValue;
  warrantyMonths?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export class Product {
  private id!: ProductId;
  private tenantId!: string;
  private organizationId!: string | null;
  private name!: ProductName;
  private slug!: ProductSlug;
  private shortDescription!: ShortDescription;
  private description!: ProductDescription;
  private productType!: ProductType;
  private status!: ProductStatus;
  private visibility!: ProductVisibility;
  private condition!: ProductCondition;
  private warrantyPeriod!: WarrantyPeriod;
  private seoTitle!: SeoTitle;
  private seoDescription!: SeoDescription;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt!: Date | null;
  private version!: number;

  private readonly events: DomainEvent[] = [];

  private constructor() {}

  static create(params: ProductCreateParams): Product {
    const product = new Product();
    product.id = new ProductId();
    product.tenantId = params.tenantId;
    product.organizationId = params.organizationId ?? null;
    product.name = new ProductName(params.name);
    product.slug = new ProductSlug(params.slug);
    product.shortDescription = new ShortDescription(params.shortDescription ?? null);
    product.description = new ProductDescription(params.description ?? null);
    product.productType = ProductType.fromString(params.productType ?? 'PHYSICAL');
    product.status = ProductStatus.fromString(params.status ?? 'DRAFT');
    product.visibility = ProductVisibility.fromString(params.visibility ?? 'PUBLIC');
    product.condition = ProductCondition.fromString(params.condition ?? 'NEW');
    product.warrantyPeriod = new WarrantyPeriod(params.warrantyMonths ?? null);
    product.seoTitle = new SeoTitle(params.seoTitle ?? null);
    product.seoDescription = new SeoDescription(params.seoDescription ?? null);
    product.createdAt = new Date();
    product.updatedAt = new Date();
    product.deletedAt = null;
    product.version = 1;

    product.raise(new ProductCreatedEvent(
      product.id.toString(), product.tenantId,
      product.name.toString(), product.slug.toString(),
    ));

    return product;
  }

  static fromPrimitives(primitives: ProductPrimitives): Product {
    const product = new Product();
    product.id = new ProductId(primitives.id);
    product.tenantId = primitives.tenantId;
    product.organizationId = primitives.organizationId;
    product.name = new ProductName(primitives.name);
    product.slug = new ProductSlug(primitives.slug);
    product.shortDescription = new ShortDescription(primitives.shortDescription);
    product.description = new ProductDescription(primitives.description);
    product.productType = ProductType.fromString(primitives.productType);
    product.status = ProductStatus.fromString(primitives.status);
    product.visibility = ProductVisibility.fromString(primitives.visibility);
    product.condition = ProductCondition.fromString(primitives.condition);
    product.warrantyPeriod = new WarrantyPeriod(primitives.warrantyMonths);
    product.seoTitle = new SeoTitle(primitives.seoTitle);
    product.seoDescription = new SeoDescription(primitives.seoDescription);
    product.createdAt = primitives.createdAt;
    product.updatedAt = primitives.updatedAt;
    product.deletedAt = primitives.deletedAt;
    product.version = primitives.version;
    return product;
  }

  toPrimitives(): ProductPrimitives {
    return {
      id: this.id.toString(),
      tenantId: this.tenantId,
      organizationId: this.organizationId,
      name: this.name.toString(),
      slug: this.slug.toString(),
      shortDescription: this.shortDescription.getValue(),
      description: this.description.getValue(),
      productType: this.productType.getValue(),
      status: this.status.getValue(),
      visibility: this.visibility.getValue(),
      condition: this.condition.getValue(),
      warrantyMonths: this.warrantyPeriod.getValue(),
      seoTitle: this.seoTitle.getValue(),
      seoDescription: this.seoDescription.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      version: this.version,
    };
  }

  getId(): ProductId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getOrganizationId(): string | null { return this.organizationId; }
  getName(): ProductName { return this.name; }
  getSlug(): ProductSlug { return this.slug; }
  getShortDescription(): ShortDescription { return this.shortDescription; }
  getDescription(): ProductDescription { return this.description; }
  getProductType(): ProductType { return this.productType; }
  getStatus(): ProductStatus { return this.status; }
  getVisibility(): ProductVisibility { return this.visibility; }
  getCondition(): ProductCondition { return this.condition; }
  getWarrantyPeriod(): WarrantyPeriod { return this.warrantyPeriod; }
  getSeoTitle(): SeoTitle { return this.seoTitle; }
  getSeoDescription(): SeoDescription { return this.seoDescription; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  getDeletedAt(): Date | null { return this.deletedAt; }
  getVersion(): number { return this.version; }

  hasBeenDeleted(): boolean { return this.deletedAt !== null; }
  isActive(): boolean { return this.status.equals(ProductStatus.ACTIVE); }
  isDraft(): boolean { return this.status.equals(ProductStatus.DRAFT); }
  isArchived(): boolean { return this.status.equals(ProductStatus.ARCHIVED); }
  isPublic(): boolean { return this.visibility.equals(ProductVisibility.PUBLIC); }

  rename(newName: string): void {
    this.assertNotDeleted();
    const oldName = this.name.toString();
    this.name = new ProductName(newName);
    this.touch();
    this.raise(new ProductRenamedEvent(
      this.id.toString(), this.tenantId, oldName, this.name.toString(),
    ));
  }

  changeSlug(newSlug: string): void {
    this.assertNotDeleted();
    this.slug = new ProductSlug(newSlug);
    this.touch();
  }

  updateShortDescription(value: string | null): void {
    this.assertNotDeleted();
    this.shortDescription = new ShortDescription(value);
    this.touch();
  }

  updateDescription(value: string | null): void {
    this.assertNotDeleted();
    this.description = new ProductDescription(value);
    this.touch();
  }

  updateSeo(title: string | null, description: string | null): void {
    this.assertNotDeleted();
    this.seoTitle = new SeoTitle(title);
    this.seoDescription = new SeoDescription(description);
    this.touch();
    this.raise(new ProductSeoUpdatedEvent(this.id.toString(), this.tenantId));
  }

  defineWarranty(months: number | null): void {
    this.assertNotDeleted();
    this.warrantyPeriod = new WarrantyPeriod(months);
    this.touch();
  }

  activate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ACTIVE');
    this.status = ProductStatus.ACTIVE;
    this.touch();
    this.raise(new ProductActivatedEvent(this.id.toString(), this.tenantId));
  }

  deactivate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('INACTIVE');
    this.status = ProductStatus.INACTIVE;
    this.touch();
    this.raise(new ProductDeactivatedEvent(this.id.toString(), this.tenantId));
  }

  archive(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ARCHIVED');
    this.status = ProductStatus.ARCHIVED;
    this.touch();
    this.raise(new ProductArchivedEvent(this.id.toString(), this.tenantId));
  }

  restore(): void {
    if (!this.isArchived()) {
      throw new ProductException(
        PRODUCT_ERROR_CODES.PRODUCT_INVALID_STATUS_TRANSITION,
        'Only archived products can be restored',
      );
    }
    this.status = ProductStatus.DRAFT;
    this.touch();
    this.raise(new ProductRestoredEvent(this.id.toString(), this.tenantId));
  }

  changeVisibility(visibility: ProductVisibilityValue): void {
    this.assertNotDeleted();
    this.visibility = ProductVisibility.fromString(visibility);
    this.touch();
    this.raise(new ProductVisibilityChangedEvent(
      this.id.toString(), this.tenantId, visibility,
    ));
  }

  softDelete(): void {
    if (this.deletedAt !== null) return;
    this.deletedAt = new Date();
    this.touch();
    this.raise(new ProductDeletedEvent(this.id.toString(), this.tenantId));
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
      throw new ProductException(
        PRODUCT_ERROR_CODES.PRODUCT_DELETED,
        'Cannot modify a deleted product',
      );
    }
  }

  private assertCanTransitionTo(target: ProductStatusValue): void {
    if (!this.status.canTransitionTo(target)) {
      throw new ProductException(
        PRODUCT_ERROR_CODES.PRODUCT_INVALID_STATUS_TRANSITION,
        `Cannot transition from ${this.status.getValue()} to ${target}`,
      );
    }
  }

  private raise(event: DomainEvent): void {
    this.events.push(event);
  }
}
