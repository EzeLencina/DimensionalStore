import { Branch } from '../entities/branch.entity';

export class BranchAggregate {
  constructor(private readonly branch: Branch) {}

  getBranch(): Branch { return this.branch; }
}
