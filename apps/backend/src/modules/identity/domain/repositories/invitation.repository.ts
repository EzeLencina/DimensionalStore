import { Invitation } from '../entities/invitation.entity';
import { InvitationId, OrganizationId, Email } from '../value-objects';

export interface IInvitationRepository {
  findById(id: InvitationId): Promise<Invitation | null>;
  findByOrganizationId(organizationId: OrganizationId): Promise<Invitation[]>;
  findByEmail(email: Email): Promise<Invitation[]>;
  findPendingByEmail(email: Email): Promise<Invitation[]>;
  findExpired(): Promise<Invitation[]>;
  save(invitation: Invitation): Promise<void>;
  update(invitation: Invitation): Promise<void>;
  delete(id: InvitationId): Promise<void>;
}
