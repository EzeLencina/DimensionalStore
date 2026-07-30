import { UserId, Email, Username, DisplayName, Avatar, Timezone, Locale, Language, Phone, DocumentNumber } from '../value-objects';
import { UserStatus, UserType, AuthProvider } from '../types';

export class User {
  private readonly id: UserId;
  private email: Email;
  private username: Username;
  private displayName: DisplayName;
  private avatar: Avatar | null;
  private phone: Phone | null;
  private documentNumber: DocumentNumber | null;
  private timezone: Timezone;
  private locale: Locale;
  private language: Language;
  private status: UserStatus;
  private userType: UserType;
  private emailVerified: boolean;
  private phoneVerified: boolean;
  private authProviders: AuthProvider[];
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  constructor(params: {
    id: UserId;
    email: Email;
    username: Username;
    displayName: DisplayName;
    avatar?: Avatar | null;
    phone?: Phone | null;
    documentNumber?: DocumentNumber | null;
    timezone?: Timezone;
    locale?: Locale;
    language?: Language;
    status?: UserStatus;
    userType?: UserType;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    authProviders?: AuthProvider[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.username = params.username;
    this.displayName = params.displayName;
    this.avatar = params.avatar ?? null;
    this.phone = params.phone ?? null;
    this.documentNumber = params.documentNumber ?? null;
    this.timezone = params.timezone ?? new Timezone('UTC');
    this.locale = params.locale ?? new Locale('es_AR');
    this.language = params.language ?? new Language('es');
    this.status = params.status ?? 'active';
    this.userType = params.userType ?? 'customer';
    this.emailVerified = params.emailVerified ?? false;
    this.phoneVerified = params.phoneVerified ?? false;
    this.authProviders = params.authProviders ?? [];
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
    this.deletedAt = params.deletedAt ?? null;
  }

  getId(): UserId { return this.id; }
  getEmail(): Email { return this.email; }
  getUsername(): Username { return this.username; }
  getDisplayName(): DisplayName { return this.displayName; }
  getAvatar(): Avatar | null { return this.avatar; }
  getPhone(): Phone | null { return this.phone; }
  getDocumentNumber(): DocumentNumber | null { return this.documentNumber; }
  getTimezone(): Timezone { return this.timezone; }
  getLocale(): Locale { return this.locale; }
  getLanguage(): Language { return this.language; }
  getStatus(): UserStatus { return this.status; }
  getUserType(): UserType { return this.userType; }
  isEmailVerified(): boolean { return this.emailVerified; }
  isPhoneVerified(): boolean { return this.phoneVerified; }
  getAuthProviders(): AuthProvider[] { return [...this.authProviders]; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }
  isDeleted(): boolean { return this.deletedAt !== null; }
  getDeletedAt(): Date | null { return this.deletedAt; }

  updateEmail(email: Email): void {
    this.email = email;
    this.emailVerified = false;
    this.touch();
  }

  updateUsername(username: Username): void {
    this.username = username;
    this.touch();
  }

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
    this.phoneVerified = false;
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

  updateStatus(status: UserStatus): void {
    this.status = status;
    this.touch();
  }

  markEmailAsVerified(): void {
    this.emailVerified = true;
    this.touch();
  }

  markPhoneAsVerified(): void {
    this.phoneVerified = true;
    this.touch();
  }

  addAuthProvider(provider: AuthProvider): void {
    const exists = this.authProviders.some(
      (p) => p.provider === provider.provider && p.providerId === provider.providerId,
    );
    if (!exists) {
      this.authProviders.push(provider);
      this.touch();
    }
  }

  removeAuthProvider(providerType: string): void {
    this.authProviders = this.authProviders.filter((p) => p.provider !== providerType);
    this.touch();
  }

  delete(): void {
    this.deletedAt = new Date();
    this.status = 'archived';
    this.touch();
  }

  restore(): void {
    this.deletedAt = null;
    this.status = 'active';
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
