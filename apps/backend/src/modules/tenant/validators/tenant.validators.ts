import { TenantValidators } from '../application/validators';

export function validateTenantName(name: string): boolean {
  return TenantValidators.isValidTenantName(name);
}

export function validateTenantSlug(slug: string): boolean {
  return TenantValidators.isValidSlug(slug);
}

export function validateTaxIdentifier(taxId: string): boolean {
  return TenantValidators.isValidTaxIdentifier(taxId);
}

export function validateBranchCode(code: string): boolean {
  return TenantValidators.isValidBranchCode(code);
}

export function validateLocale(locale: string): boolean {
  return TenantValidators.isValidLocale(locale);
}

export function validateCurrency(currency: string): boolean {
  return TenantValidators.isValidCurrency(currency);
}

export function validateTimezone(tz: string): boolean {
  return TenantValidators.isValidTimezone(tz);
}

export function validateTenantId(id: string): boolean {
  return TenantValidators.isValidTenantId(id);
}

export function validateBranchId(id: string): boolean {
  return TenantValidators.isValidBranchId(id);
}
