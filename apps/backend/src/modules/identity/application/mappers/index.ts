import {
  UserId, OrganizationId, BranchId, RoleId, PermissionId, InvitationId,
  Email, Username, DisplayName, Slug,
} from '../../domain/value-objects';

export class IdentityMappers {
  static toUserId(value: string): UserId { return new UserId(value); }
  static toOrganizationId(value: string): OrganizationId { return new OrganizationId(value); }
  static toBranchId(value: string): BranchId { return new BranchId(value); }
  static toRoleId(value: string): RoleId { return new RoleId(value); }
  static toPermissionId(value: string): PermissionId { return new PermissionId(value); }
  static toInvitationId(value: string): InvitationId { return new InvitationId(value); }
  static toEmail(value: string): Email { return new Email(value); }
  static toUsername(value: string): Username { return new Username(value); }
  static toDisplayName(value: string): DisplayName { return new DisplayName(value); }
  static toSlug(value: string): Slug { return new Slug(value); }
}
