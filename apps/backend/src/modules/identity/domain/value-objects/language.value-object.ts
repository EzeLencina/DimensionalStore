import { IdentityException } from '../exceptions/identity.exception';

const VALID_LANGUAGES = new Set([
  'es', 'en', 'pt', 'fr', 'de', 'it', 'ja', 'zh', 'ko',
]);

export class Language {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();
    if (!VALID_LANGUAGES.has(trimmed)) {
      throw new IdentityException('LANGUAGE_UNSUPPORTED', `Language '${trimmed}' is not supported`);
    }
    this.value = trimmed;
    Object.freeze(this);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Language): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return this.value;
  }
}
