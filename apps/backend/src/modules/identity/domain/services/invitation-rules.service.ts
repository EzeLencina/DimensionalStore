import { Email } from '../value-objects';
import { InvitationStatus, InvitationTarget } from '../types';
import { IdentityException } from '../exceptions/identity.exception';

export class InvitationRulesService {
  validateEmail(email: string): Email {
    return new Email(email);
  }

  validateTarget(target: string): InvitationTarget {
    const validTargets: InvitationTarget[] = ['member', 'admin', 'seller'];
    if (!validTargets.includes(target as InvitationTarget)) {
      throw new IdentityException('INVITATION_TARGET_INVALID', `Invalid invitation target: ${target}`);
    }
    return target as InvitationTarget;
  }

  canSendInvitation(currentUserRole: string): boolean {
    if (currentUserRole !== 'admin' && currentUserRole !== 'super_admin') {
      throw new IdentityException('INVITATION_NOT_ALLOWED', 'Only admins can send invitations');
    }
    return true;
  }

  canAcceptInvitation(status: InvitationStatus): boolean {
    if (status !== 'pending') {
      throw new IdentityException('INVITATION_CANNOT_ACCEPT', 'Only pending invitations can be accepted');
    }
    return true;
  }

  canResendInvitation(status: InvitationStatus): boolean {
    if (status !== 'pending') {
      throw new IdentityException('INVITATION_CANNOT_RESEND', 'Only pending invitations can be resent');
    }
    return true;
  }

  async ensureNoPendingInvitation(
    email: Email,
    repository: { findPendingByEmail(email: Email): Promise<unknown[]> },
  ): Promise<void> {
    const pending = await repository.findPendingByEmail(email);
    if (pending.length > 0) {
      throw new IdentityException('INVITATION_ALREADY_PENDING', `There is already a pending invitation for ${email}`);
    }
  }
}
