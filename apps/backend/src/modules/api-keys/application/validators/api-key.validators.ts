import { API_KEYS_CONSTANTS } from '../../constants';

export class ApiKeyValidators {
  static isValidKeyFormat(key: string): boolean {
    if (!key || key.length < API_KEYS_CONSTANTS.KEY_MIN_LENGTH) return false;
    if (key.length > API_KEYS_CONSTANTS.KEY_MAX_LENGTH) return false;
    const prefixRegex = /^[a-z][a-z0-9]*_[a-zA-Z0-9]+$/;
    return prefixRegex.test(key);
  }

  static isValidScope(scope: string): boolean {
    if (!scope || scope.length > API_KEYS_CONSTANTS.SCOPE_MAX_LENGTH) return false;
    const parts = scope.split(API_KEYS_CONSTANTS.SCOPE_SEPARATOR);
    if (parts.length < 1 || parts.length > 2) return false;
    const [res] = parts;
    if (!res || !/^[a-z][a-z0-9]*$/.test(res!)) return false;
    if (parts.length === 2) {
      const [, act] = parts;
      if (!act || !/^[a-z*][a-z0-9*]*$/.test(act!)) return false;
    }
    return true;
  }

  static isValidScopes(scopes: string[]): boolean {
    if (!Array.isArray(scopes) || scopes.length === 0) return false;
    return scopes.every(s => ApiKeyValidators.isValidScope(s));
  }

  static isValidDisplayName(name: string): boolean {
    return name.length > 0 && name.length <= API_KEYS_CONSTANTS.SERVICE_ACCOUNT_NAME_MAX_LENGTH;
  }

  static isValidServiceAccountName(name: string): boolean {
    return name.length > 0 && name.length <= API_KEYS_CONSTANTS.SERVICE_ACCOUNT_NAME_MAX_LENGTH;
  }

  static isValidPrefix(prefix: string): boolean {
    return /^[a-z][a-z0-9]*$/.test(prefix) && prefix.length <= 16;
  }

  static extractKeyFromHeader(authHeader: string): string | null {
    if (!authHeader) return null;
    const match = authHeader.match(/^(?:Bearer|ApiKey)\s+(.+)$/i);
    return match ? match[1]!.trim() : null;
  }

  static formatKeyForDisplay(plainKey: string): string {
    if (plainKey.length <= 8) return '****';
    return plainKey.substring(0, 4) + '****' + plainKey.substring(plainKey.length - 4);
  }

  static isExpiringSoon(expiresAt: Date, daysThreshold: number = 30): boolean {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);
    return expiresAt <= threshold;
  }
}
