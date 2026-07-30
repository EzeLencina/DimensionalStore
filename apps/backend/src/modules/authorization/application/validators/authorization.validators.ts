const VALID_RESOURCE_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const VALID_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_\s-]{2,64}$/;
const VALID_ACTIONS = new Set([
  'create', 'read', 'update', 'delete', 'list',
  'export', 'import', 'approve', 'cancel',
  'archive', 'restore', 'manage',
]);
const VALID_SCOPES = new Set([
  'global', 'organization', 'branch', 'department', 'owner', 'self', 'custom',
]);

export class AuthorizationValidators {
  static isValidResourceName(name: string): boolean {
    return VALID_RESOURCE_REGEX.test(name);
  }

  static isValidRoleName(name: string): boolean {
    return VALID_NAME_REGEX.test(name);
  }

  static isValidPolicyName(name: string): boolean {
    return VALID_NAME_REGEX.test(name);
  }

  static isValidAction(action: string): boolean {
    return VALID_ACTIONS.has(action);
  }

  static isValidScope(scope: string): boolean {
    return VALID_SCOPES.has(scope);
  }

  static isValidPermissionFormat(resource: string, action: string): boolean {
    return this.isValidResourceName(resource) && this.isValidAction(action);
  }

  static isValidPermissionString(permission: string): boolean {
    const parts = permission.split(':');
    if (parts.length !== 2 && parts.length !== 3) return false;
    return this.isValidResourceName(parts[0]!) && this.isValidAction(parts[1]!);
  }

  static getAvailableActions(): string[] {
    return Array.from(VALID_ACTIONS);
  }

  static getAvailableScopes(): string[] {
    return Array.from(VALID_SCOPES);
  }
}
