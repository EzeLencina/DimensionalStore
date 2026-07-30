import { AuthorizationValidators } from '../application/validators';
import { AUTHZ_CONSTANTS } from '../constants';

export function validatePermissionFormat(resource: string, action: string): boolean {
  return AuthorizationValidators.isValidPermissionFormat(resource, action);
}

export function validateRoleName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 64) return false;
  return AuthorizationValidators.isValidRoleName(name);
}

export function validatePolicyName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 64) return false;
  return AuthorizationValidators.isValidPolicyName(name);
}

export function validateResourceName(name: string): boolean {
  return AuthorizationValidators.isValidResourceName(name);
}

export function validateActionName(action: string): boolean {
  return AUTHZ_CONSTANTS.SUPPORTED_ACTIONS.includes(action as any);
}

export function validateScopeName(scope: string): boolean {
  return AUTHZ_CONSTANTS.SUPPORTED_SCOPES.includes(scope as any);
}

export function validatePermissionString(permission: string): boolean {
  return AuthorizationValidators.isValidPermissionString(permission);
}
