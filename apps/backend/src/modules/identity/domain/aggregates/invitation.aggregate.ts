import { Invitation } from '../entities/invitation.entity';

export class InvitationAggregate {
  constructor(private readonly invitation: Invitation) {}

  getInvitation(): Invitation { return this.invitation; }
}
