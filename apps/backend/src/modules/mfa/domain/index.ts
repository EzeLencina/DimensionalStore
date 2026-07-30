export { DomainEvent } from './events/domain-event';
export { MfaEnabledEvent } from './events/mfa-enabled.event';
export { MfaDisabledEvent } from './events/mfa-disabled.event';
export { MfaVerifiedEvent } from './events/mfa-verified.event';
export { ChallengeCreatedEvent } from './events/challenge-created.event';
export { MfaRecoveryStartedEvent } from './events/recovery-started.event';
export { BackupCodeUsedEvent } from './events/backup-code-used.event';
export { TrustedDeviceAddedEvent } from './events/trusted-device-added.event';
export { TrustedDeviceRemovedEvent } from './events/trusted-device-removed.event';
export { MfaException, MFA_ERROR_CODES } from './exceptions/mfa.exception';
export { BackupCodeDomainService } from './services/backup-code-domain.service';
export { TrustedDeviceDomainService } from './services/trusted-device-domain.service';
export { MfaDomainService } from './services/mfa-domain.service';
export type { IChallengeStore, IEnrollmentStore, IBackupCodeStore, ITrustedDeviceStore, IRecoveryTokenStore } from './services/stores';
export type { ITotpProvider, IHashingProvider } from './services/stores';
export type { IBackupCodeHashing } from './services/backup-code-domain.service';
export { TotpSecret } from './value-objects/totp-secret.vo';
export { BackupCodeHash } from './value-objects/backup-code-hash.vo';
export { TrustedDeviceInfo } from './value-objects/trusted-device-info.vo';
export { ChallengeId } from './value-objects/challenge-id.vo';
export type {
  MfaMethod,
  MfaStatus,
  MfaChallengeStatus,
  MfaEnrollmentStatus,
  TrustedDeviceStatus,
  MfaEnrollment,
  MfaChallenge,
  BackupCode,
  BackupCodeResult,
  TrustedDevice,
  RecoveryToken,
  TotpSecretData,
  MfaVerificationResult,
  MfaEnrollmentResult,
  MfaState,
  MfaConfig,
} from './types/index';
