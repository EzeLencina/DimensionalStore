import { IdentityRulesService } from '../../domain/services/identity-rules.service';
import { ProfileRulesService } from '../../domain/services/profile-rules.service';
import { OrganizationRulesService } from '../../domain/services/organization-rules.service';
import { InvitationRulesService } from '../../domain/services/invitation-rules.service';

export class IdentityValidators {
  static readonly identity = new IdentityRulesService();
  static readonly profile = new ProfileRulesService();
  static readonly organization = new OrganizationRulesService();
  static readonly invitation = new InvitationRulesService();
}
