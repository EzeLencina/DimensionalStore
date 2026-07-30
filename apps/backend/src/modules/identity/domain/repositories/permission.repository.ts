import { Permission } from '../entities/permission.entity';
import { PermissionId, Slug } from '../value-objects';

export interface IPermissionRepository {
  findById(id: PermissionId): Promise<Permission | null>;
  findBySlug(slug: Slug): Promise<Permission | null>;
  findByResource(resource: string): Promise<Permission[]>;
  findAll(options?: { offset?: number; limit?: number }): Promise<Permission[]>;
  findByQualifiedName(qualifiedName: string): Promise<Permission | null>;
  save(permission: Permission): Promise<void>;
  update(permission: Permission): Promise<void>;
  delete(id: PermissionId): Promise<void>;
  count(): Promise<number>;
}
