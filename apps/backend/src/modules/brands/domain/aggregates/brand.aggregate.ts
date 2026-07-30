import {
  BrandId, BrandName, Slug, Description,
  Url, SeoTitle, SeoDescription,
  BrandStatus, BrandVisibility,
  type BrandStatusValue, type BrandVisibilityValue,
} from '../value-objects';
import { BrandException, BRAND_ERROR_CODES } from '../exceptions';
import {
  BrandCreatedEvent, BrandRenamedEvent,
  BrandActivatedEvent, BrandDeactivatedEvent,
  BrandArchivedEvent, BrandRestoredEvent,
  BrandVisibilityChangedEvent, BrandSeoUpdatedEvent,
  BrandDeletedEvent, DomainEvent,
} from '../events';

export type BrandPrimitives = {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  status: BrandStatusValue;
  visibility: BrandVisibilityValue;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

type BrandCreateParams = {
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  status?: BrandStatusValue;
  visibility?: BrandVisibilityValue;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export class Brand {
  private id!: BrandId;
  private tenantId!: string;
  private name!: BrandName;
  private slug!: Slug;
  private description!: Description;
  private logoUrl!: Url;
  private websiteUrl!: Url;
  private status!: BrandStatus;
  private visibility!: BrandVisibility;
  private seoTitle!: SeoTitle;
  private seoDescription!: SeoDescription;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt!: Date | null;
  private version!: number;

  private readonly events: DomainEvent[] = [];

  private constructor() {}

  static create(params: BrandCreateParams): Brand {
    const brand = new Brand();
    brand.id = new BrandId();
    brand.tenantId = params.tenantId;
    brand.name = BrandName.create(params.name);
    brand.slug = Slug.create(params.slug);
    brand.description = Description.create(params.description ?? '');
    brand.logoUrl = params.logoUrl ? Url.create(params.logoUrl) : Url.empty();
    brand.websiteUrl = params.websiteUrl ? Url.create(params.websiteUrl) : Url.empty();
    brand.status = BrandStatus.create(params.status ?? 'DRAFT');
    brand.visibility = BrandVisibility.create(params.visibility ?? 'PUBLIC');
    brand.seoTitle = SeoTitle.create(params.seoTitle ?? '');
    brand.seoDescription = SeoDescription.create(params.seoDescription ?? '');
    brand.createdAt = new Date();
    brand.updatedAt = new Date();
    brand.deletedAt = null;
    brand.version = 1;

    brand.raise(new BrandCreatedEvent(
      brand.id.toString(), brand.tenantId,
      brand.name.toString(), brand.slug.toString(),
    ));

    return brand;
  }

  static fromPrimitives(primitives: BrandPrimitives): Brand {
    const brand = new Brand();
    brand.id = new BrandId(primitives.id);
    brand.tenantId = primitives.tenantId;
    brand.name = BrandName.create(primitives.name);
    brand.slug = Slug.create(primitives.slug);
    brand.description = Description.create(primitives.description ?? '');
    brand.logoUrl = primitives.logoUrl ? Url.create(primitives.logoUrl) : Url.empty();
    brand.websiteUrl = primitives.websiteUrl ? Url.create(primitives.websiteUrl) : Url.empty();
    brand.status = BrandStatus.create(primitives.status);
    brand.visibility = BrandVisibility.create(primitives.visibility);
    brand.seoTitle = SeoTitle.create(primitives.seoTitle ?? '');
    brand.seoDescription = SeoDescription.create(primitives.seoDescription ?? '');
    brand.createdAt = primitives.createdAt;
    brand.updatedAt = primitives.updatedAt;
    brand.deletedAt = primitives.deletedAt;
    brand.version = primitives.version;
    return brand;
  }

  toPrimitives(): BrandPrimitives {
    return {
      id: this.id.toString(),
      tenantId: this.tenantId,
      name: this.name.toString(),
      slug: this.slug.toString(),
      description: this.description.isEmpty() ? null : this.description.getValue(),
      logoUrl: this.logoUrl.isEmpty() ? null : this.logoUrl.getValue(),
      websiteUrl: this.websiteUrl.isEmpty() ? null : this.websiteUrl.getValue(),
      status: this.status.getValue(),
      visibility: this.visibility.getValue(),
      seoTitle: this.seoTitle.isEmpty() ? null : this.seoTitle.getValue(),
      seoDescription: this.seoDescription.isEmpty() ? null : this.seoDescription.getValue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      version: this.version,
    };
  }

  getId(): BrandId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getName(): BrandName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getDescription(): Description { return this.description; }
  getLogoUrl(): Url { return this.logoUrl; }
  getWebsiteUrl(): Url { return this.websiteUrl; }
  getStatus(): BrandStatus { return this.status; }
  getVisibility(): BrandVisibility { return this.visibility; }
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
    this.name = BrandName.create(newName);
    this.touch();
    this.raise(new BrandRenamedEvent(
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

  updateLogo(url: string | null): void {
    this.assertNotDeleted();
    this.logoUrl = url ? Url.create(url) : Url.empty();
    this.touch();
  }

  updateWebsite(url: string | null): void {
    this.assertNotDeleted();
    this.websiteUrl = url ? Url.create(url) : Url.empty();
    this.touch();
  }

  updateSeo(title: string | null, description: string | null): void {
    this.assertNotDeleted();
    this.seoTitle = SeoTitle.create(title ?? '');
    this.seoDescription = SeoDescription.create(description ?? '');
    this.touch();
    this.raise(new BrandSeoUpdatedEvent(this.id.toString(), this.tenantId));
  }

  activate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ACTIVE');
    this.status = BrandStatus.active();
    this.touch();
    this.raise(new BrandActivatedEvent(this.id.toString(), this.tenantId));
  }

  deactivate(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('INACTIVE');
    this.status = BrandStatus.inactive();
    this.touch();
    this.raise(new BrandDeactivatedEvent(this.id.toString(), this.tenantId));
  }

  archive(): void {
    this.assertNotDeleted();
    this.assertCanTransitionTo('ARCHIVED');

    if (this.visibility.isPublic()) {
      throw new BrandException(
        BRAND_ERROR_CODES.BRAND_ARCHIVED_CANNOT_BE_PUBLIC,
        'Cannot archive a public brand. Change visibility to PRIVATE or HIDDEN first',
      );
    }

    this.status = BrandStatus.archived();
    this.touch();
    this.raise(new BrandArchivedEvent(this.id.toString(), this.tenantId));
  }

  restore(): void {
    if (!this.isArchived()) {
      throw new BrandException(
        BRAND_ERROR_CODES.BRAND_INVALID_STATUS_TRANSITION,
        'Only archived brands can be restored',
      );
    }
    this.status = BrandStatus.draft();
    this.touch();
    this.raise(new BrandRestoredEvent(this.id.toString(), this.tenantId));
  }

  changeVisibility(visibility: BrandVisibilityValue): void {
    this.assertNotDeleted();
    if (this.isArchived() && visibility === 'PUBLIC') {
      throw new BrandException(
        BRAND_ERROR_CODES.BRAND_ARCHIVED_CANNOT_BE_PUBLIC,
        'An archived brand cannot be public',
      );
    }
    const oldVisibility = this.visibility.getValue();
    this.visibility = BrandVisibility.create(visibility);
    this.touch();
    this.raise(new BrandVisibilityChangedEvent(
      this.id.toString(), this.tenantId, oldVisibility, visibility,
    ));
  }

  softDelete(): void {
    if (this.deletedAt !== null) return;
    this.deletedAt = new Date();
    this.touch();
    this.raise(new BrandDeletedEvent(this.id.toString(), this.tenantId));
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
      throw new BrandException(
        BRAND_ERROR_CODES.BRAND_DELETED,
        'Cannot modify a deleted brand',
      );
    }
  }

  private assertCanTransitionTo(target: BrandStatusValue): void {
    if (target === 'ACTIVE' && this.status.canActivate()) return;
    if (target === 'INACTIVE' && this.status.isActive()) return;
    if (target === 'ARCHIVED' && this.status.canArchive()) return;
    throw new BrandException(
      BRAND_ERROR_CODES.BRAND_INVALID_STATUS_TRANSITION,
      `Cannot transition from ${this.status.getValue()} to ${target}`,
    );
  }

  private raise(event: DomainEvent): void {
    this.events.push(event);
  }
}
