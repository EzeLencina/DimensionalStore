import { DisplayName, Phone, DocumentNumber, Timezone, Locale, Language } from '../value-objects';
import { IdentityException } from '../exceptions/identity.exception';

export class ProfileRulesService {
  validateDisplayName(name: string): DisplayName {
    return new DisplayName(name);
  }

  validatePhone(phone: string): Phone {
    return new Phone(phone);
  }

  validateDocumentNumber(value: string, type: string): DocumentNumber {
    const validTypes = ['DNI', 'RUC', 'CPF', 'CNPJ', 'NIT', 'PASSPORT', 'RFC', 'CURP', 'OTHER'];
    if (!validTypes.includes(type)) {
      throw new IdentityException('DOCUMENT_TYPE_INVALID', `Invalid document type: ${type}`);
    }
    return new DocumentNumber(value, type as any);
  }

  validateTimezone(timezone: string): Timezone {
    return new Timezone(timezone);
  }

  validateLocale(locale: string): Locale {
    return new Locale(locale);
  }

  validateLanguage(language: string): Language {
    return new Language(language);
  }

  canUpdateProfile(currentUserType: string): boolean {
    if (currentUserType === 'archived') {
      throw new IdentityException('PROFILE_UPDATE_DENIED', 'Cannot update profile of an archived user');
    }
    return true;
  }
}
