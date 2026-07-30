import { Organization } from '../entities/organization.entity';
import { Branch } from '../entities/branch.entity';

export class OrganizationAggregate {
  constructor(
    private readonly organization: Organization,
    private readonly branches: Branch[] = [],
  ) {}

  getOrganization(): Organization { return this.organization; }
  getBranches(): Branch[] { return [...this.branches]; }

  addBranch(branch: Branch): void {
    this.branches.push(branch);
  }

  removeBranch(branchId: string): void {
    const index = this.branches.findIndex((b) => b.getId().toString() === branchId);
    if (index !== -1) {
      this.branches.splice(index, 1);
    }
  }

  getMainBranch(): Branch | undefined {
    return this.branches.find((b) => b.isMain());
  }

  getBranch(branchId: string): Branch | undefined {
    return this.branches.find((b) => b.getId().toString() === branchId);
  }
}
