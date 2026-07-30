import { Organization } from '../entities/organization.entity';
import { OrganizationId, Slug } from '../value-objects';

export interface IOrganizationRepository {
  findById(id: OrganizationId): Promise<Organization | null>;
  findBySlug(slug: Slug): Promise<Organization | null>;
  findAll(options?: { offset?: number; limit?: number; status?: string }): Promise<Organization[]>;
  save(organization: Organization): Promise<void>;
  update(organization: Organization): Promise<void>;
  delete(id: OrganizationId): Promise<void>;
  count(): Promise<number>;
}
