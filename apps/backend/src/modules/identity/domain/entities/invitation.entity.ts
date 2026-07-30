import { InvitationId, OrganizationId, Email, DisplayName } from '../value-objects';
import { InvitationStatus, InvitationTarget } from '../types';

export class Invitation {
  private readonly id: InvitationId;
  private readonly organizationId: OrganizationId;
  private email: Email;
  private displayName: DisplayName | null;
  private status: InvitationStatus;
  private target: InvitationTarget;
  private targetId: string | null;
  private invitedBy: string;
  private expiresAt: Date;
  private acceptedAt: Date | null;
  private rejectedAt: Date | null;
  private cancelledAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id: InvitationId;
    organizationId: OrganizationId;
    email: Email;
    displayName?: DisplayName | null;
    status?: InvitationStatus;
    target?: InvitationTarget;
    targetId?: string | null;
    invitedBy: string;
    expiresAt?: Date;
    acceptedAt?: Date | null;
    rejectedAt?: Date | null;
    cancelledAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.organizationId = params.organizationId;
    this.email = params.email;
    this.displayName = params.displayName ?? null;
    this.status = params.status ?? 'pending';
    this.target = params.target ?? 'member';
    this.targetId = params.targetId ?? null;
    this.invitedBy = params.invitedBy;
    this.expiresAt = params.expiresAt ?? this.defaultExpiration();
    this.acceptedAt = params.acceptedAt ?? null;
    this.rejectedAt = params.rejectedAt ?? null;
    this.cancelledAt = params.cancelledAt ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getId(): InvitationId { return this.id; }
  getOrganizationId(): OrganizationId { return this.organizationId; }
  getEmail(): Email { return this.email; }
  getDisplayName(): DisplayName | null { return this.displayName; }
  getStatus(): InvitationStatus { return this.status; }
  getTarget(): InvitationTarget { return this.target; }
  getTargetId(): string | null { return this.targetId; }
  getInvitedBy(): string { return this.invitedBy; }
  getExpiresAt(): Date { return this.expiresAt; }
  getAcceptedAt(): Date | null { return this.acceptedAt; }
  getRejectedAt(): Date | null { return this.rejectedAt; }
  getCancelledAt(): Date | null { return this.cancelledAt; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  accept(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending invitations can be accepted');
    }
    if (this.isExpired()) {
      throw new Error('Cannot accept an expired invitation');
    }
    this.status = 'accepted';
    this.acceptedAt = new Date();
    this.touch();
  }

  reject(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending invitations can be rejected');
    }
    this.status = 'rejected';
    this.rejectedAt = new Date();
    this.touch();
  }

  cancel(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending invitations can be cancelled');
    }
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    this.touch();
  }

  resend(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending invitations can be resent');
    }
    this.expiresAt = this.defaultExpiration();
    this.touch();
  }

  private defaultExpiration(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
