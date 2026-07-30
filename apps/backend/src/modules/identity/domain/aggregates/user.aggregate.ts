import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { UserMembership } from '../types';

export class UserAggregate {
  constructor(
    private readonly user: User,
    private readonly profile: Profile,
    private readonly memberships: UserMembership[] = [],
  ) {}

  getUser(): User { return this.user; }
  getProfile(): Profile { return this.profile; }
  getMemberships(): UserMembership[] { return [...this.memberships]; }

  addMembership(membership: UserMembership): void {
    const exists = this.memberships.some(
      (m) => m.organizationId === membership.organizationId,
    );
    if (!exists) {
      this.memberships.push(membership);
    }
  }

  removeMembership(organizationId: string): void {
    const index = this.memberships.findIndex(
      (m) => m.organizationId === organizationId,
    );
    if (index !== -1) {
      this.memberships.splice(index, 1);
    }
  }

  getMembership(organizationId: string): UserMembership | undefined {
    return this.memberships.find((m) => m.organizationId === organizationId);
  }
}
