import { Provider } from '@nestjs/common';
import { IMfaService } from '../application/interfaces';
import { MfaAppService } from '../services';
import { TotpGeneratorService } from '../infrastructure/totp';
import { Sha256HashingService } from '../infrastructure/hashing';
import {
  InMemoryChallengeStore,
  InMemoryEnrollmentStore,
  InMemoryBackupCodeStore,
  InMemoryTrustedDeviceStore,
  InMemoryRecoveryTokenStore,
} from '../infrastructure/stores';

export const MfaServiceProvider: Provider<IMfaService> = {
  provide: 'IMfaService',
  useClass: MfaAppService,
};

export const ChallengeStoreProvider: Provider = {
  provide: 'IChallengeStore',
  useClass: InMemoryChallengeStore,
};

export const EnrollmentStoreProvider: Provider = {
  provide: 'IEnrollmentStore',
  useClass: InMemoryEnrollmentStore,
};

export const BackupCodeStoreProvider: Provider = {
  provide: 'IBackupCodeStore',
  useClass: InMemoryBackupCodeStore,
};

export const TrustedDeviceStoreProvider: Provider = {
  provide: 'ITrustedDeviceStore',
  useClass: InMemoryTrustedDeviceStore,
};

export const RecoveryTokenStoreProvider: Provider = {
  provide: 'IRecoveryTokenStore',
  useClass: InMemoryRecoveryTokenStore,
};

export const TotpProvider: Provider = {
  provide: 'ITotpProvider',
  useClass: TotpGeneratorService,
};

export const HashingProvider: Provider = {
  provide: 'IHashingProvider',
  useClass: Sha256HashingService,
};

export const MFA_PROVIDERS: Provider[] = [
  MfaServiceProvider,
  ChallengeStoreProvider,
  EnrollmentStoreProvider,
  BackupCodeStoreProvider,
  TrustedDeviceStoreProvider,
  RecoveryTokenStoreProvider,
  TotpProvider,
  HashingProvider,
];
