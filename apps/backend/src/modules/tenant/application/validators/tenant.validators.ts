const VALID_LOCALES = ['es_AR', 'es_ES', 'en_US', 'pt_BR', 'en_GB'];
const VALID_CURRENCIES = ['ARS', 'USD', 'EUR', 'BRL', 'GBP'];
const VALID_TIMEZONES = [
  'America/Argentina/Buenos_Aires', 'America/Santiago', 'America/Sao_Paulo',
  'America/Mexico_City', 'America/New_York', 'America/Los_Angeles',
  'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
];

export class TenantValidators {
  static isValidTenantName(name: string): boolean {
    return name.length >= 2 && name.length <= 200;
  }

  static isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2 && slug.length <= 100;
  }

  static isValidTaxIdentifier(taxId: string): boolean {
    return taxId.length >= 3 && taxId.length <= 20;
  }

  static isValidBranchCode(code: string): boolean {
    return code.length >= 1 && code.length <= 20;
  }

  static isValidLocale(locale: string): boolean {
    return VALID_LOCALES.includes(locale);
  }

  static isValidCurrency(currency: string): boolean {
    return VALID_CURRENCIES.includes(currency);
  }

  static isValidTimezone(timezone: string): boolean {
    return VALID_TIMEZONES.includes(timezone);
  }

  static isValidTenantId(id: string): boolean {
    return id.length > 0 && id.length <= 128;
  }

  static isValidBranchId(id: string): boolean {
    return id.length > 0 && id.length <= 128;
  }

  static getSupportedLocales(): string[] { return [...VALID_LOCALES]; }
  static getSupportedCurrencies(): string[] { return [...VALID_CURRENCIES]; }
  static getSupportedTimezones(): string[] { return [...VALID_TIMEZONES]; }
}
