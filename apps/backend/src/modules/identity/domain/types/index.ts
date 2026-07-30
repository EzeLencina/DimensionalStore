export type UserStatus = 'active' | 'inactive' | 'suspended' | 'archived';
export type UserType = 'super_admin' | 'admin' | 'employee' | 'seller' | 'customer';
export type OrganizationStatus = 'active' | 'suspended' | 'archived';
export type OrganizationTier = 'free' | 'starter' | 'business' | 'enterprise';
export type BranchStatus = 'active' | 'inactive' | 'archived';
export type BranchType = 'physical' | 'digital' | 'warehouse';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';
export type InvitationTarget = 'member' | 'admin' | 'seller';
export type RoleType = 'system' | 'custom';

export interface AuthProvider {
  provider: string;
  providerId: string;
  email?: string;
}

export interface UserMembership {
  organizationId: string;
  branchId: string;
  roleIds: string[];
  joinedAt: Date;
}
