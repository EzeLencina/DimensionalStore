import { ApiKeyValidators } from '../application/validators';

export function validateApiKeyFormat(key: string): boolean {
  return ApiKeyValidators.isValidKeyFormat(key);
}

export function validateScope(scope: string): boolean {
  return ApiKeyValidators.isValidScope(scope);
}

export function validateScopes(scopes: string[]): boolean {
  return ApiKeyValidators.isValidScopes(scopes);
}

export function validateDisplayName(name: string): boolean {
  return ApiKeyValidators.isValidDisplayName(name);
}

export function validateServiceAccountName(name: string): boolean {
  return ApiKeyValidators.isValidServiceAccountName(name);
}

export function validatePrefix(prefix: string): boolean {
  return ApiKeyValidators.isValidPrefix(prefix);
}

export function extractKeyFromHeader(authHeader: string): string | null {
  return ApiKeyValidators.extractKeyFromHeader(authHeader);
}

export function formatKeyForDisplay(plainKey: string): string {
  return ApiKeyValidators.formatKeyForDisplay(plainKey);
}
