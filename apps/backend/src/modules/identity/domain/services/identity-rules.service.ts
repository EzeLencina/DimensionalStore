import { Email, Username, DisplayName } from '../value-objects';
import { UserStatus, UserType } from '../types';
import { IdentityException } from '../exceptions/identity.exception';

export class IdentityRulesService {
  validateEmail(email: string): Email {
    return new Email(email);
  }

  validateUsername(username: string): Username {
    return new Username(username);
  }

  validateDisplayName(name: string): DisplayName {
    return new DisplayName(name);
  }

  validateUserType(userType: string): UserType {
    const validTypes: UserType[] = ['super_admin', 'admin', 'employee', 'seller', 'customer'];
    if (!validTypes.includes(userType as UserType)) {
      throw new IdentityException('USER_TYPE_INVALID', `Invalid user type: ${userType}`);
    }
    return userType as UserType;
  }

  validateStatusTransition(current: UserStatus, next: UserStatus): boolean {
    const transitions: Record<UserStatus, UserStatus[]> = {
      active: ['inactive', 'suspended', 'archived'],
      inactive: ['active', 'archived'],
      suspended: ['active', 'archived'],
      archived: [],
    };
    const allowed = transitions[current];
    if (!allowed?.includes(next)) {
      throw new IdentityException(
        'INVALID_STATUS_TRANSITION',
        `Cannot transition from ${current} to ${next}`,
      );
    }
    return true;
  }

  canDeleteUser(userType: UserType, currentUserType: UserType): boolean {
    if (userType === 'super_admin' && currentUserType !== 'super_admin') {
      throw new IdentityException('CANNOT_DELETE_SUPER_ADMIN', 'Only a super admin can delete another super admin');
    }
    return true;
  }

  isEmailVerified(verified: boolean): boolean {
    return verified;
  }
}
