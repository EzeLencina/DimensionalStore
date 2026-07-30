import { RoleId, OrganizationId, DisplayName, Slug } from '../value-objects';
import { RoleType } from '../types';

export class Role {
  private readonly id: RoleId;
  private readonly organizationId: OrganizationId;
  private name: DisplayName;
  private slug: Slug;
  private description: string | null;
  private roleType: RoleType;
  private permissionIds: string[];
  private isSystem: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(params: {
    id: RoleId;
    organizationId: OrganizationId;
    name: DisplayName;
    slug: Slug;
    description?: string | null;
    roleType?: RoleType;
    permissionIds?: string[];
    isSystem?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = params.id;
    this.organizationId = params.organizationId;
    this.name = params.name;
    this.slug = params.slug;
    this.description = params.description ?? null;
    this.roleType = params.roleType ?? 'custom';
    this.permissionIds = params.permissionIds ?? [];
    this.isSystem = params.isSystem ?? false;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
  }

  getId(): RoleId { return this.id; }
  getOrganizationId(): OrganizationId { return this.organizationId; }
  getName(): DisplayName { return this.name; }
  getSlug(): Slug { return this.slug; }
  getDescription(): string | null { return this.description; }
  getRoleType(): RoleType { return this.roleType; }
  getPermissionIds(): string[] { return [...this.permissionIds]; }
  isSystemRole(): boolean { return this.isSystem; }
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

  updateDescription(description: string | null): void {
    this.description = description;
    this.touch();
  }

  addPermission(permissionId: string): void {
    if (!this.permissionIds.includes(permissionId)) {
      this.permissionIds.push(permissionId);
      this.touch();
    }
  }

  removePermission(permissionId: string): void {
    this.permissionIds = this.permissionIds.filter((id) => id !== permissionId);
    this.touch();
  }

  hasPermission(permissionId: string): boolean {
    return this.permissionIds.includes(permissionId);
  }

  setPermissions(permissionIds: string[]): void {
    this.permissionIds = [...permissionIds];
    this.touch();
  }

  delete(): void {
    this.deletedAt = new Date();
    this.touch();
  }

  restore(): void {
    this.deletedAt = null;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
