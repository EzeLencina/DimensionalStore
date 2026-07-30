import {
  CollectionId, CollectionName, Slug, Description,
  CatalogStatus, CatalogVisibility,
  DisplayOrder, SeoTitle, SeoDescription,
  CollectionType,
  type CatalogStatusValue, type CatalogVisibilityValue,
  type CollectionTypeValue,
} from '../value-objects';
import { CatalogException, CATALOG_ERROR_CODES } from '../exceptions';
import {
  CollectionCreatedEvent, CollectionRenamedEvent,
  CollectionActivatedEvent, CollectionDeactivatedEvent,
  CollectionArchivedEvent, CollectionRestoredEvent,
  CollectionVisibilityChangedEvent, CollectionSeoUpdatedEvent,
  CollectionTypeChangedEvent, CollectionDeletedEvent,
  DomainEvent,
} from '../events';

export type CollectionPrimitives = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  type: CollectionTypeValue;
  status: CatalogStatusValue;
  visibility: CatalogVisibilityValue;
  displayOrder: number;
  startAt: Date | null;
  endAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

type CollectionCreateParams = {
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  type?: CollectionTypeValue;
  status?: CatalogStatusValue;
  visibility?: CatalogVisibilityValue;
  displayOrder?: number;
  startAt?: Date | null;
  endAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export class Collection {
  private id!: CollectionId;
  private tenantId!: string;
  private name!: CollectionName;
  private slug!: Slug;
  private description!: Description;
  private type!: CollectionType;
  private status!: CatalogStatus;
  private visibility!: CatalogVisibility;
  private displayOrder!: DisplayOrder;
  private startAt!: Date | null;
  private endAt!: Date | null;
  private seoTitle!: SeoTitle;
  private seoDescription!: SeoDescription;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt!: Date | null;
  private version!: number;

  private readonly events: DomainEvent[] = [];

  private constructor() {}

  static create(params: CollectionCreateParams): Collection {
    const collection = new Collection();
    collection.id = new CollectionId();
    collection.tenantId = params.tenantId;
    collection.name = CollectionName.create(params.name);
    collection.slug = Slug.create(params.slug);
    collection.description = Description.create(params.description ?? '');
    collection.type = CollectionType.create(params.type ?? 'MANUAL');
    collection.status = CatalogStatus.create(params.status ?? 'DRAFT');
    collection.visibility = CatalogVisibility.create(params.visibility ?? 'PUBLIC');
    collection.displayOrder = DisplayOrder.create(params.displayOrder ?? 0);

    if (params.startAt && params.endAt && params.startAt >= params.endAt) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.COLLECTION_INVALID_DATES,
        'Start date must be before end date',
      );
    }
    collection.startAt = params.startAt ?? null;
    collection.endAt = params.endAt ?? null;

    collection.seoTitle = SeoTitle.create(params.seoTitle ?? '');
    collection.seoDescription = SeoDescription.create(params.seoDescription ?? '');
    collection.createdAt = new Date();
    collection.updatedAt = new Date();
    collection.deletedAt = null;
    collection.version = 1;

    collection.raise(new CollectionCreatedEvent(
      collection.id.toString(), collection.tenantId,
      collection.name.toString(), collection.slug.toString(),
      collection.type.getValue(),
    ));

    return collection;
  }

  static fromPrimitives(primitives: CollectionPrimitives): Collection {
    const collection = new Collection();

    if (primitives.startAt && primitives.endAt && primitives.startAt >= primitives.endAt) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.COLLECTION_INVALID_DATES,
        'Invalid date range',
      );
    }

    collection.id = new CollectionId(primitives.id);
    collection.tenantId = primitives.tenantId;
    collection.name = CollectionName.create(primitives.name);
    collection.slug = Slug.create(primitives.slug);
    collection.description = Description.create(primitives.description ?? '');
    collection.type = CollectionType.create(primitives.type);
    collection.status = CatalogStatus.create(primitives.status);
    collection.visibility = CatalogVisibility.create(primitives.visibility);
    collection.displayOrder = DisplayOrder.create(primitives.displayOrder);
    collection.startAt = primitives.startAt;
    collection.endAt = primitives.endAt;
    collection.seoTitle = SeoTitle.create(primitives.seoTitle ?? '');
    collection.seoDescription = SeoDescription.create(primitives.seoDescription ?? '');
    collection.createdAt = primitives.createdAt;
    collection.updatedAt = primitives.updatedAt;
    collection.deletedAt = primitives.deletedAt;
    collection.version = primitives.version;
    return collection;
  }

  toPrimitives(): CollectionPrimitives {
    return {
      id: this.id.toString(),
      tenantId: this.tenantId,
      name: this.name.toString(),
      slug: this.slug.toString(),
      description: this.description.isEmpty() ? null : this.description.getValue(),
      type: this.type.getValue(),
      status: this.status.getValue(),
      visibility: this.visibility.getValue(),
      displayOrder: this.displayOrder.getValue(),
      startAt: this.startAt,
      endAt: this.endAt,
      seoTitle: this.seoTitle.isEmpty() ? null : this.seoTitle.getValue(),
      seoDescription: this.seoDescription.isEmpty() ? null : this.seoDescription.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      version: this.version,
    };
  }

  getId(): CollectionId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getName(): CollectionName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getDescription(): Description { return this.description; }
  getType(): CollectionType { return this.type; }
  getStatus(): CatalogStatus { return this.status; }
  getVisibility(): CatalogVisibility { return this.visibility; }
  getDisplayOrder(): DisplayOrder { return this.displayOrder; }
  getStartAt(): Date | null { return this.startAt; }
  getEndAt(): Date | null { return this.endAt; }
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

  rename(newName: string): void {
    this.assertNotDeleted();
    const oldName = this.name.toString();
    this.name = CollectionName.create(newName);
    this.touch();
    this.raise(new CollectionRenamedEvent(
      this.id.toString(), this.tenantId, oldName, this.name.toString(),
    ));
  }

  changeSlug(newSlug: string): void {
    this.assertNotDeleted();
    this.slug = Slug.create(newSlug);
    this.touch();
  }

  updateDescription(value: string | null): void {
    this.assertNotDeleted();
    this.description = Description.create(value ?? '');
    this.touch();
  }

  changeType(newType: CollectionTypeValue): void {
    this.assertNotDeleted();
    const oldType = this.type.getValue();
    this.type = CollectionType.create(newType);
    this.touch();
    this.raise(new CollectionTypeChangedEvent(
      this.id.toString(), this.tenantId, oldType, newType,
    ));
  }

  updateDateRange(startAt: Date | null, endAt: Date | null): void {
    this.assertNotDeleted();
    if (startAt && endAt && startAt >= endAt) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.COLLECTION_INVALID_DATES,
        'Start date must be before end date',
      );
    }
    this.startAt = startAt;
    this.endAt = endAt;
    this.touch();
  }

  updateSeo(title: string | null, description: string | null): void {
    this.assertNotDeleted();
    this.seoTitle = SeoTitle.create(title ?? '');
    this.seoDescription = SeoDescription.create(description ?? '');
    this.touch();
    this.raise(new CollectionSeoUpdatedEvent(this.id.toString(), this.tenantId));
  }

  activate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ACTIVE');
    this.status = CatalogStatus.active();
    this.touch();
    this.raise(new CollectionActivatedEvent(this.id.toString(), this.tenantId));
  }

  deactivate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('INACTIVE');
    this.status = CatalogStatus.inactive();
    this.touch();
    this.raise(new CollectionDeactivatedEvent(this.id.toString(), this.tenantId));
  }

  archive(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ARCHIVED');
    this.status = CatalogStatus.archived();
    this.touch();
    this.raise(new CollectionArchivedEvent(this.id.toString(), this.tenantId));
  }

  restore(): void {
    if (!this.isArchived()) {
      throw new CatalogException(
        CATALOG_ERROR_CODES.COLLECTION_INVALID_STATUS_TRANSITION,
        'Only archived collections can be restored',
      );
    }
    this.status = CatalogStatus.draft();
    this.touch();
    this.raise(new CollectionRestoredEvent(this.id.toString(), this.tenantId));
  }

  changeVisibility(visibility: CatalogVisibilityValue): void {
    this.assertNotDeleted();
    const oldVisibility = this.visibility.getValue();
    this.visibility = CatalogVisibility.create(visibility);
    this.touch();
    this.raise(new CollectionVisibilityChangedEvent(
      this.id.toString(), this.tenantId, oldVisibility, visibility,
    ));
  }

  updateDisplayOrder(order: number): void {
    this.assertNotDeleted();
    this.displayOrder = DisplayOrder.create(order);
    this.touch();
  }

  softDelete(): void {
    if (this.deletedAt !== null) return;
    this.deletedAt = new Date();
    this.touch();
    this.raise(new CollectionDeletedEvent(this.id.toString(), this.tenantId));
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
        CATALOG_ERROR_CODES.COLLECTION_DELETED,
        'Cannot modify a deleted collection',
      );
    }
  }

  private assertCanTransitionTo(target: CatalogStatusValue): void {
    if (target === 'ACTIVE' && this.status.canActivate()) return;
    if (target === 'INACTIVE' && this.status.isActive()) return;
    if (target === 'ARCHIVED' && this.status.canArchive()) return;
    throw new CatalogException(
      CATALOG_ERROR_CODES.COLLECTION_INVALID_STATUS_TRANSITION,
      `Cannot transition from ${this.status.getValue()} to ${target}`,
    );
  }

  private raise(event: DomainEvent): void {
    this.events.push(event);
  }
}
