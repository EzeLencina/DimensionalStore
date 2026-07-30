import { PasswordDomainService } from '../domain/services';
import { AUTH_CONSTANTS } from '../constants';

const passwordValidator = new PasswordDomainService({
  minLength: AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
});

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  return passwordValidator.validateStrength(password);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidJwtFormat(token: string): boolean {
  const parts = token.split('.');
  return parts.length === 3;
}

export function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function isValidTimezone(value: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
