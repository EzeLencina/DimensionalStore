import {
  CategoryId, CategoryName, Slug, Description,
  ShortDescription, CatalogStatus, CatalogVisibility,
  DisplayOrder, Url, SeoTitle, SeoDescription,
  type CatalogStatusValue, type CatalogVisibilityValue,
} from '../value-objects';
import { CatalogException, CATALOG_ERROR_CODES } from '../exceptions';
import {
  CategoryCreatedEvent, CategoryRenamedEvent,
  CategoryActivatedEvent, CategoryDeactivatedEvent,
  CategoryArchivedEvent, CategoryRestoredEvent,
  CategoryVisibilityChangedEvent, CategorySeoUpdatedEvent,
  CategoryMovedEvent, CategoryDeletedEvent,
  DomainEvent,
} from '../events';

export type CategoryPrimitives = {
  id: string;
  tenantId: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  status: CatalogStatusValue;
  visibility: CatalogVisibilityValue;
  displayOrder: number;
  icon: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

type CategoryCreateParams = {
  tenantId: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  status?: CatalogStatusValue;
  visibility?: CatalogVisibilityValue;
  displayOrder?: number;
  icon?: string | null;
  image?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export class Category {
  private id!: CategoryId;
  private tenantId!: string;
  private parentId!: string | null;
  private name!: CategoryName;
  private slug!: Slug;
  private description!: Description;
  private shortDescription!: ShortDescription;
  private status!: CatalogStatus;
  private visibility!: CatalogVisibility;
  private displayOrder!: DisplayOrder;
  private icon!: Url;
  private image!: Url;
  private seoTitle!: SeoTitle;
  private seoDescription!: SeoDescription;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt!: Date | null;
  private version!: number;

  private readonly events: DomainEvent[] = [];

  private constructor() {}

  static create(params: CategoryCreateParams): Category {
    const category = new Category();
    category.id = new CategoryId();
    category.tenantId = params.tenantId;
    category.parentId = params.parentId ?? null;
    category.name = CategoryName.create(params.name);
    category.slug = Slug.create(params.slug);
    category.description = Description.create(params.description ?? '');
    category.shortDescription = ShortDescription.create(params.shortDescription ?? '');
    category.status = CatalogStatus.create(params.status ?? 'DRAFT');
    category.visibility = CatalogVisibility.create(params.visibility ?? 'PUBLIC');
    category.displayOrder = DisplayOrder.create(params.displayOrder ?? 0);
    category.icon = params.icon ? Url.create(params.icon) : Url.empty();
    category.image = params.image ? Url.create(params.image) : Url.empty();
    category.seoTitle = SeoTitle.create(params.seoTitle ?? '');
    category.seoDescription = SeoDescription.create(params.seoDescription ?? '');
    category.createdAt = new Date();
    category.updatedAt = new Date();
    category.deletedAt = null;
    category.version = 1;

    category.raise(new CategoryCreatedEvent(
      category.id.toString(), category.tenantId,
      category.name.toString(), category.slug.toString(),
    ));

    return category;
  }

  static fromPrimitives(primitives: CategoryPrimitives): Category {
    const category = new Category();
    category.id = new CategoryId(primitives.id);
    category.tenantId = primitives.tenantId;
    category.parentId = primitives.parentId;
    category.name = CategoryName.create(primitives.name);
    category.slug = Slug.create(primitives.slug);
    category.description = Description.create(primitives.description ?? '');
    category.shortDescription = ShortDescription.create(primitives.shortDescription ?? '');
    category.status = CatalogStatus.create(primitives.status);
    category.visibility = CatalogVisibility.create(primitives.visibility);
    category.displayOrder = DisplayOrder.create(primitives.displayOrder);
    category.icon = primitives.icon ? Url.create(primitives.icon) : Url.empty();
    category.image = primitives.image ? Url.create(primitives.image) : Url.empty();
    category.seoTitle = SeoTitle.create(primitives.seoTitle ?? '');
    category.seoDescription = SeoDescription.create(primitives.seoDescription ?? '');
    category.createdAt = primitives.createdAt;
    category.updatedAt = primitives.updatedAt;
    category.deletedAt = primitives.deletedAt;
    category.version = primitives.version;
    return category;
  }

  toPrimitives(): CategoryPrimitives {
    return {
      id: this.id.toString(),
      tenantId: this.tenantId,
      parentId: this.parentId,
      name: this.name.toString(),
      slug: this.slug.toString(),
      description: this.description.isEmpty() ? null : this.description.getValue(),
      shortDescription: this.shortDescription.isEmpty() ? null : this.shortDescription.getValue(),
      status: this.status.getValue(),
      visibility: this.visibility.getValue(),
      displayOrder: this.displayOrder.getValue(),
      icon: this.icon.isEmpty() ? null : this.icon.getValue(),
      image: this.image.isEmpty() ? null : this.image.getValue(),
      seoTitle: this.seoTitle.isEmpty() ? null : this.seoTitle.getValue(),
      seoDescription: this.seoDescription.isEmpty() ? null : this.seoDescription.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      version: this.version,
    };
  }

  getId(): CategoryId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getParentId(): string | null { return this.parentId; }
  getName(): CategoryName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getDescription(): Description { return this.description; }
  getShortDescription(): ShortDescription { return this.shortDescription; }
  getStatus(): CatalogStatus { return this.status; }
  getVisibility(): CatalogVisibility { return this.visibility; }
  getDisplayOrder(): DisplayOrder { return this.displayOrder; }
  getIcon(): Url { return this.icon; }
  getImage(): Url { return this.image; }
  getSeoTitle(): SeoTitle { return this.seoTitle; }
  getSeoDescription(): SeoDescription { return this.seoDescription; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  getDeletedAt(): Date | null { return this.deletedAt; }
  getVersion(): number { return this.version; }

  hasBeenDeleted(): boolean { return this.deletedAt !== null; }
  isActive(): boolean { return this.status.isActive(); }
  isDraft(): boolean { return this.status.isDraft(); }
  isArchived(): boolean { return this.status.isArchived(); }
  isPublic(): boolean { return this.visibility.isPublic(); }
  isRoot(): boolean { return this.parentId === null; }

  rename(newName: string): void {
    this.assertNotDeleted();
    const oldName = this.name.toString();
    this.name = CategoryName.create(newName);
    this.touch();
    this.raise(new CategoryRenamedEvent(
      this.id.toString(), this.tenantId, oldName, this.name.toString(),
    ));
  }

  changeSlug(newSlug: string): void {
    this.assertNotDeleted();
    this.slug = Slug.create(newSlug);
    this.touch();
  }

  moveTo(newParentId: string | null): void {
    this.assertNotDeleted();
    if (newParentId === this.id.toString()) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.CATEGORY_CIRCULAR_REFERENCE,
        'A category cannot be its own parent',
      );
    }
    const oldParentId = this.parentId;
    this.parentId = newParentId;
    this.touch();
    this.raise(new CategoryMovedEvent(
      this.id.toString(), this.tenantId, oldParentId, newParentId,
    ));
  }

  updateDescription(value: string | null): void {
    this.assertNotDeleted();
    this.description = Description.create(value ?? '');
    this.touch();
  }

  updateShortDescription(value: string | null): void {
    this.assertNotDeleted();
    this.shortDescription = ShortDescription.create(value ?? '');
    this.touch();
  }

  updateSeo(title: string | null, description: string | null): void {
    this.assertNotDeleted();
    this.seoTitle = SeoTitle.create(title ?? '');
    this.seoDescription = SeoDescription.create(description ?? '');
    this.touch();
    this.raise(new CategorySeoUpdatedEvent(this.id.toString(), this.tenantId));
  }

  activate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ACTIVE');
    this.status = CatalogStatus.active();
    this.touch();
    this.raise(new CategoryActivatedEvent(this.id.toString(), this.tenantId));
  }

  deactivate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('INACTIVE');
    this.status = CatalogStatus.inactive();
    this.touch();
    this.raise(new CategoryDeactivatedEvent(this.id.toString(), this.tenantId));
  }

  archive(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ARCHIVED');
    this.status = CatalogStatus.archived();
    this.touch();
    this.raise(new CategoryArchivedEvent(this.id.toString(), this.tenantId));
  }

  restore(): void {
    if (!this.isArchived()) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.CATEGORY_INVALID_STATUS_TRANSITION,
        'Only archived categories can be restored',
      );
    }
    this.status = CatalogStatus.draft();
    this.touch();
    this.raise(new CategoryRestoredEvent(this.id.toString(), this.tenantId));
  }

  changeVisibility(visibility: CatalogVisibilityValue): void {
    this.assertNotDeleted();
    const oldVisibility = this.visibility.getValue();
    this.visibility = CatalogVisibility.create(visibility);
    this.touch();
    this.raise(new CategoryVisibilityChangedEvent(
      this.id.toString(), this.tenantId, oldVisibility, visibility,
    ));
  }

  updateDisplayOrder(order: number): void {
    this.assertNotDeleted();
    this.displayOrder = DisplayOrder.create(order);
    this.touch();
  }

  updateIcon(icon: string | null): void {
    this.assertNotDeleted();
    this.icon = icon ? Url.create(icon) : Url.empty();
    this.touch();
  }

  updateImage(image: string | null): void {
    this.assertNotDeleted();
    this.image = image ? Url.create(image) : Url.empty();
    this.touch();
  }

  softDelete(): void {
    if (this.deletedAt !== null) return;
    this.deletedAt = new Date();
    this.touch();
    this.raise(new CategoryDeletedEvent(this.id.toString(), this.tenantId));
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
      throw new CatalogException(
        CATALOG_ERROR_CODES.CATEGORY_DELETED,
        'Cannot modify a deleted category',
      );
    }
  }

  private assertCanTransitionTo(target: CatalogStatusValue): void {
    if (target === 'ACTIVE' && this.status.canActivate()) return;
    if (target === 'INACTIVE' && this.status.isActive()) return;
    if (target === 'ARCHIVED' && this.status.canArchive()) return;
    throw new CatalogException(
      CATALOG_ERROR_CODES.CATEGORY_INVALID_STATUS_TRANSITION,
      `Cannot transition from ${this.status.getValue()} to ${target}`,
    );
  }

  private raise(event: DomainEvent): void {
    this.events.push(event);
  }
}
