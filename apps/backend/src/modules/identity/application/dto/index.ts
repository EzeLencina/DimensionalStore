export interface CreateUserDto {
  email: string;
  username: string;
  displayName: string;
  userType?: string;
  phone?: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  avatar?: string | null;
  phone?: string | null;
  bio?: string | null;
  timezone?: string;
  locale?: string;
  language?: string;
}

export interface CreateOrganizationDto {
  name: string;
  slug: string;
}

export interface CreateBranchDto {
  organizationId: string;
  name: string;
  slug: string;
  phone?: string;
  address?: string;
  branchType?: string;
  isMainBranch?: boolean;
}

export interface CreateRoleDto {
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  permissionIds?: string[];
}

export interface CreatePermissionDto {
  resource: string;
  action: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SendInvitationDto {
  organizationId: string;
  email: string;
  displayName?: string;
  target?: string;
  targetId?: string;
}
