import { Role } from '../entities/role.entity';
import { RoleId, OrganizationId, Slug } from '../value-objects';

export interface IRoleRepository {
  findById(id: RoleId): Promise<Role | null>;
  findByOrganizationId(organizationId: OrganizationId): Promise<Role[]>;
  findBySlug(organizationId: OrganizationId, slug: Slug): Promise<Role | null>;
  findSystemRoles(): Promise<Role[]>;
  save(role: Role): Promise<void>;
  update(role: Role): Promise<void>;
  delete(id: RoleId): Promise<void>;
}
