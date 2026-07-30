import { BranchId, OrganizationId, DisplayName, Slug, Phone } from '../value-objects';
import { BranchStatus, BranchType } from '../types';

export class Branch {
  private readonly id: BranchId;
  private readonly organizationId: OrganizationId;
  private name: DisplayName;
  private slug: Slug;
  private phone: Phone | null;
  private address: string | null;
  private status: BranchStatus;
  private branchType: BranchType;
  private isMainBranch: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(params: {
    id: BranchId;
    organizationId: OrganizationId;
    name: DisplayName;
    slug: Slug;
    phone?: Phone | null;
    address?: string | null;
    status?: BranchStatus;
    branchType?: BranchType;
    isMainBranch?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = params.id;
    this.organizationId = params.organizationId;
    this.name = params.name;
    this.slug = params.slug;
    this.phone = params.phone ?? null;
    this.address = params.address ?? null;
    this.status = params.status ?? 'active';
    this.branchType = params.branchType ?? 'physical';
    this.isMainBranch = params.isMainBranch ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
  }

  getId(): BranchId { return this.id; }
  getOrganizationId(): OrganizationId { return this.organizationId; }
  getName(): DisplayName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getPhone(): Phone | null { return this.phone; }
  getAddress(): string | null { return this.address; }
  getStatus(): BranchStatus { return this.status; }
  getBranchType(): BranchType { return this.branchType; }
  isMain(): boolean { return this.isMainBranch; }
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

  updatePhone(phone: Phone | null): void {
    this.phone = phone;
    this.touch();
  }

  updateAddress(address: string | null): void {
    this.address = address;
    this.touch();
  }

  updateStatus(status: BranchStatus): void {
    this.status = status;
    this.touch();
  }

  markAsMain(): void {
    this.isMainBranch = true;
    this.touch();
  }

  unmarkAsMain(): void {
    this.isMainBranch = false;
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
