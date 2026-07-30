import { z } from 'zod';

export function isEmail(value: string): boolean {
  return z.string().email().safeParse(value).success;
}

export function isUUID(value: string): boolean {
  return z.string().uuid().safeParse(value).success;
}

export function isURL(value: string): boolean {
  return z.string().url().safeParse(value).success;
}

export function isPhone(value: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(value);
}

export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isCurrency(value: string): boolean {
  return /^[A-Z]{3}$/.test(value);
}

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isPercentage(value: number): boolean {
  return value >= 0 && value <= 100;
}
