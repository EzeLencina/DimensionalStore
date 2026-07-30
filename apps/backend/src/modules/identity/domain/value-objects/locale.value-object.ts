import { IdentityException } from '../exceptions/identity.exception';

const LOCALE_REGEX = /^[a-z]{2}_[A-Z]{2}$/;
const VALID_LOCALES = new Set([
  'es_AR', 'es_ES', 'es_MX', 'es_CO', 'es_CL',
  'en_US', 'en_GB', 'en_AU',
  'pt_BR',
  'fr_FR', 'de_DE', 'it_IT', 'ja_JP', 'zh_CN', 'ko_KR',
]);

export class Locale {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!LOCALE_REGEX.test(trimmed)) {
      throw new IdentityException('LOCALE_INVALID_FORMAT', 'Locale must follow format ll_CC (e.g., es_AR)');
    }
    if (!VALID_LOCALES.has(trimmed)) {
      throw new IdentityException('LOCALE_UNSUPPORTED', `Locale '${trimmed}' is not supported`);
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  getLanguage(): string {
    return this.value.split('_')[0] ?? 'es';
  }

  getCountry(): string {
    return this.value.split('_')[1] ?? 'AR';
  }

  equals(other: Locale): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
