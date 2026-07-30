import { Module } from '@nestjs/common';
import {
  IdentityRulesService,
  ProfileRulesService,
  OrganizationRulesService,
  InvitationRulesService,
} from './domain/services';

@Module({
  controllers: [],
  providers: [
    IdentityRulesService,
    ProfileRulesService,
    OrganizationRulesService,
    InvitationRulesService,
  ],
  exports: [
    IdentityRulesService,
    ProfileRulesService,
    OrganizationRulesService,
    InvitationRulesService,
  ],
})
export class IdentityModule {}
