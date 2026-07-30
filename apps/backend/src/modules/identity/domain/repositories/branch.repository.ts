import { Branch } from '../entities/branch.entity';
import { BranchId, OrganizationId, Slug } from '../value-objects';

export interface IBranchRepository {
  findById(id: BranchId): Promise<Branch | null>;
  findByOrganizationId(organizationId: OrganizationId): Promise<Branch[]>;
  findBySlug(organizationId: OrganizationId, slug: Slug): Promise<Branch | null>;
  findMainBranch(organizationId: OrganizationId): Promise<Branch | null>;
  save(branch: Branch): Promise<void>;
  update(branch: Branch): Promise<void>;
  delete(id: BranchId): Promise<void>;
}
