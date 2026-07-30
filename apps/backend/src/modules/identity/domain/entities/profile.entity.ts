import { UserId, DisplayName, Avatar, Phone, DocumentNumber, Timezone, Locale, Language } from '../value-objects';

export class Profile {
  private readonly userId: UserId;
  private displayName: DisplayName;
  private avatar: Avatar | null;
  private phone: Phone | null;
  private documentNumber: DocumentNumber | null;
  private timezone: Timezone;
  private locale: Locale;
  private language: Language;
  private bio: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    userId: UserId;
    displayName: DisplayName;
    avatar?: Avatar | null;
    phone?: Phone | null;
    documentNumber?: DocumentNumber | null;
    timezone?: Timezone;
    locale?: Locale;
    language?: Language;
    bio?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.userId = params.userId;
    this.displayName = params.displayName;
    this.avatar = params.avatar ?? null;
    this.phone = params.phone ?? null;
    this.documentNumber = params.documentNumber ?? null;
    this.timezone = params.timezone ?? new Timezone('UTC');
    this.locale = params.locale ?? new Locale('es_AR');
    this.language = params.language ?? new Language('es');
    this.bio = params.bio ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  getUserId(): UserId { return this.userId; }
  getDisplayName(): DisplayName { return this.displayName; }
  getAvatar(): Avatar | null { return this.avatar; }
  getPhone(): Phone | null { return this.phone; }
  getDocumentNumber(): DocumentNumber | null { return this.documentNumber; }
  getTimezone(): Timezone { return this.timezone; }
  getLocale(): Locale { return this.locale; }
  getLanguage(): Language { return this.language; }
  getBio(): string | null { return this.bio; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  updateDisplayName(displayName: DisplayName): void {
    this.displayName = displayName;
    this.touch();
  }

  updateAvatar(avatar: Avatar | null): void {
    this.avatar = avatar;
    this.touch();
  }

  updatePhone(phone: Phone | null): void {
    this.phone = phone;
    this.touch();
  }

  updateDocumentNumber(documentNumber: DocumentNumber | null): void {
    this.documentNumber = documentNumber;
    this.touch();
  }

  updateTimezone(timezone: Timezone): void {
    this.timezone = timezone;
    this.touch();
  }

  updateLocale(locale: Locale): void {
    this.locale = locale;
    this.touch();
  }

  updateLanguage(language: Language): void {
    this.language = language;
    this.touch();
  }

  updateBio(bio: string | null): void {
    this.bio = bio;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
