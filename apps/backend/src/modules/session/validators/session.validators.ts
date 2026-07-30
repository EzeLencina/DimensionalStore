import { SessionValidators } from '../application/validators';

export function validateSessionId(id: string): boolean {
  return SessionValidators.isValidSessionId(id);
}

export function validateDeviceId(id: string): boolean {
  return SessionValidators.isValidDeviceId(id);
}

export function validateIpAddress(ip: string): boolean {
  return SessionValidators.isValidIpAddress(ip);
}

export function validateUserAgent(ua: string): boolean {
  return SessionValidators.isValidUserAgent(ua);
}

export function validateTimezone(tz: string): boolean {
  return SessionValidators.isValidTimezone(tz);
}

export function validateLocale(locale: string): boolean {
  return SessionValidators.isValidLocale(locale);
}

export function validateDeviceType(type: string): boolean {
  return SessionValidators.isValidDeviceType(type);
}
