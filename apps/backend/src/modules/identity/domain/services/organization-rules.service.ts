import { DisplayName, Slug } from '../value-objects';
import { OrganizationStatus, OrganizationTier } from '../types';
import { IdentityException } from '../exceptions/identity.exception';

export class OrganizationRulesService {
  validateName(name: string): DisplayName {
    return new DisplayName(name);
  }

  validateSlug(slug: string): Slug {
    return new Slug(slug);
  }

  async ensureSlugUnique(slug: Slug, repository: { findBySlug(slug: Slug): Promise<unknown> }): Promise<void> {
    const existing = await repository.findBySlug(slug);
    if (existing) {
      throw new IdentityException('SLUG_ALREADY_EXISTS', `Organization slug '${slug}' is already taken`);
    }
  }

  validateStatusTransition(current: OrganizationStatus, next: OrganizationStatus): boolean {
    const transitions: Record<OrganizationStatus, OrganizationStatus[]> = {
      active: ['suspended', 'archived'],
      suspended: ['active', 'archived'],
      archived: [],
    };
    const allowed = transitions[current];
    if (!allowed?.includes(next)) {
      throw new IdentityException(
        'ORGANIZATION_INVALID_STATUS_TRANSITION',
        `Cannot transition from ${current} to ${next}`,
      );
    }
    return true;
  }

  validateTierUpgrade(current: OrganizationTier, next: OrganizationTier): boolean {
    const tierOrder: OrganizationTier[] = ['free', 'starter', 'business', 'enterprise'];
    const currentIndex = tierOrder.indexOf(current);
    const nextIndex = tierOrder.indexOf(next);
    if (nextIndex <= currentIndex) {
      throw new IdentityException(
        'ORGANIZATION_INVALID_TIER_UPGRADE',
        `Cannot downgrade from ${current} to ${next}`,
      );
    }
    return true;
  }

  canDeleteOrganization(organizationStatus: OrganizationStatus): boolean {
    if (organizationStatus === 'active') {
      throw new IdentityException(
        'ORGANIZATION_MUST_BE_SUSPENDED',
        'Organization must be suspended before deletion',
      );
    }
    return true;
  }
}
