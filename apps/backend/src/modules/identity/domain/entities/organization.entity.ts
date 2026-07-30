import { OrganizationId, Slug, DisplayName } from '../value-objects';
import { OrganizationStatus, OrganizationTier } from '../types';

export class Organization {
  private readonly id: OrganizationId;
  private name: DisplayName;
  private slug: Slug;
  private status: OrganizationStatus;
  private tier: OrganizationTier;
  private logo: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(params: {
    id: OrganizationId;
    name: DisplayName;
    slug: Slug;
    status?: OrganizationStatus;
    tier?: OrganizationTier;
    logo?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.slug = params.slug;
    this.status = params.status ?? 'active';
    this.tier = params.tier ?? 'free';
    this.logo = params.logo ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
  }

  getId(): OrganizationId { return this.id; }
  getName(): DisplayName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getStatus(): OrganizationStatus { return this.status; }
  getTier(): OrganizationTier { return this.tier; }
  getLogo(): string | null { return this.logo; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  isDeleted(): boolean { return this.deletedAt !== null; }
  getDeletedAt(): Date | null { return this.deletedAt; }

  updateName(name: DisplayName): void {
    this.name = name;
    this.touch();
  }

  updateSlug(slug: Slug): void {
    this.slug = slug;
    this.touch();
  }

  updateStatus(status: OrganizationStatus): void {
    this.status = status;
    this.touch();
  }

  updateTier(tier: OrganizationTier): void {
    this.tier = tier;
    this.touch();
  }

  updateLogo(logo: string | null): void {
    this.logo = logo;
    this.touch();
  }

  delete(): void {
    this.deletedAt = new Date();
    this.status = 'archived';
    this.touch();
  }

  restore(): void {
    this.deletedAt = null;
    this.status = 'active';
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
