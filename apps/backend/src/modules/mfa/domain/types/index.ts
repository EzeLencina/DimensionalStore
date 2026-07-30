export type MfaMethod = 'totp' | 'backup_codes' | 'trusted_device';

export type MfaStatus = 'disabled' | 'enabled';

export type MfaChallengeStatus = 'pending' | 'verified' | 'expired' | 'failed';

export type MfaEnrollmentStatus = 'active' | 'revoked';

export type TrustedDeviceStatus = 'active' | 'expired' | 'revoked';

export interface MfaEnrollment {
  userId: string;
  method: MfaMethod;
  status: MfaEnrollmentStatus;
  enabledAt: Date;
  secret?: string;
}

export interface MfaChallenge {
  id: string;
  userId: string;
  method: MfaMethod;
  status: MfaChallengeStatus;
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  attempts: number;
  maxAttempts: number;
}

export interface BackupCode {
  id: string;
  userId: string;
  hashedCode: string;
  usedAt?: Date;
  used: boolean;
  createdAt: Date;
}

export interface BackupCodeResult {
  plainCodes: string[];
  hashedCodes: BackupCode[];
}

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceId: string;
  trustedAt: Date;
  expiresAt: Date;
  status: TrustedDeviceStatus;
  lastUsedAt?: Date;
}

export interface RecoveryToken {
  id: string;
  userId: string;
  hashedToken: string;
  used: boolean;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface TotpSecretData {
  secret: string;
  algorithm: 'SHA1';
  digits: 6;
  period: 30;
  issuer?: string;
  accountName?: string;
}

export interface MfaVerificationResult {
  verified: boolean;
  userId: string;
  method: MfaMethod;
  challengeId: string;
}

export interface MfaEnrollmentResult {
  userId: string;
  method: MfaMethod;
  status: MfaEnrollmentStatus;
  secretData?: TotpSecretData;
  backupCodes?: string[];
  enrolledAt: Date;
}

export interface MfaState {
  userId: string;
  status: MfaStatus;
  enrolledMethods: MfaMethod[];
  enrolledAt?: Date;
}

export interface MfaConfig {
  totpEnabled: boolean;
  backupCodesEnabled: boolean;
  trustedDeviceEnabled: boolean;
  challengeTtlMinutes: number;
  challengeMaxAttempts: number;
  trustedDeviceTtlDays: number;
  backupCodeCount: number;
}
