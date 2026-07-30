import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import type { IMfaService } from '../application/interfaces';
import type { IChallengeStore, IEnrollmentStore, IBackupCodeStore, ITrustedDeviceStore, IRecoveryTokenStore } from '../domain/services/stores';
import type { ITotpProvider, IHashingProvider } from '../domain/services/stores';
import { MfaDomainService, BackupCodeDomainService, TrustedDeviceDomainService } from '../domain/services';
import type {
  MfaMethod,
  MfaState,
  MfaEnrollmentResult,
  MfaVerificationResult,
  TrustedDevice,
  MfaChallenge,
} from '../domain/types';
import { MFA_CONSTANTS } from '../constants';

@Injectable()
export class MfaAppService implements IMfaService {
  private readonly domainService: MfaDomainService;

  constructor(
    @Inject('IChallengeStore') challengeStore: IChallengeStore,
    @Inject('IEnrollmentStore') enrollmentStore: IEnrollmentStore,
    @Inject('IBackupCodeStore') backupCodeStore: IBackupCodeStore,
    @Inject('ITrustedDeviceStore') trustedDeviceStore: ITrustedDeviceStore,
    @Inject('IRecoveryTokenStore') recoveryTokenStore: IRecoveryTokenStore,
    @Inject('ITotpProvider') totpProvider: ITotpProvider,
    @Inject('IHashingProvider') hashingProvider: IHashingProvider,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    const backupCodeService = new BackupCodeDomainService(hashingProvider);
    const trustedDeviceService = new TrustedDeviceDomainService(trustedDeviceStore);

    this.domainService = new MfaDomainService(
      enrollmentStore,
      challengeStore,
      backupCodeStore,
      trustedDeviceStore,
      recoveryTokenStore,
      totpProvider,
      hashingProvider,
      backupCodeService,
      trustedDeviceService,
    );
  }

  async getState(userId: string): Promise<MfaState> {
    return this.domainService.getState(userId);
  }

  async enrollTotp(userId: string, issuer?: string): Promise<MfaEnrollmentResult> {
    const result = await this.domainService.enrollTotp(userId, issuer);

    this.logger.info(
      { event: 'mfa.enrolled', userId, method: 'totp' },
      'TOTP enrolled',
    );

    return result;
  }

  async generateBackupCodes(userId: string): Promise<{ plainCodes: string[] }> {
    const result = await this.domainService.generateBackupCodes(userId);

    this.logger.info(
      { event: 'mfa.backup_codes_generated', userId },
      'Backup codes generated',
    );

    return { plainCodes: result.plainCodes };
  }

  async verifyTotp(userId: string, code: string): Promise<boolean> {
    const result = await this.domainService.verifyTotp(userId, code);

    this.logger.info(
      { event: 'mfa.totp_verified', userId },
      'TOTP verified',
    );

    return result;
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const result = await this.domainService.verifyBackupCode(userId, code);

    this.logger.info(
      { event: 'mfa.backup_code_verified', userId },
      'Backup code verified',
    );

    return result;
  }

  async generateChallenge(userId: string, method: MfaMethod): Promise<MfaChallenge> {
    const challenge = await this.domainService.generateChallenge(userId, method);

    this.logger.info(
      { event: 'mfa.challenge_generated', userId, method, challengeId: challenge.id },
      'Challenge generated',
    );

    return challenge;
  }

  async verifyChallenge(challengeId: string, code: string): Promise<MfaVerificationResult> {
    const result = await this.domainService.verifyChallenge(challengeId, code);

    this.logger.info(
      { event: 'mfa.challenge_verified', userId: result.userId, method: result.method },
      'Challenge verified',
    );

    return result;
  }

  async isTrustedDevice(userId: string, deviceId: string): Promise<boolean> {
    return this.domainService.isTrustedDevice(userId, deviceId);
  }

  async trustDevice(userId: string, deviceId: string): Promise<TrustedDevice> {
    const device = await this.domainService.trustDevice(userId, deviceId);

    this.logger.info(
      { event: 'mfa.trusted_device_added', userId, deviceId },
      'Trusted device added',
    );

    return device;
  }

  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    await this.domainService.removeTrustedDevice(userId, deviceId);

    this.logger.info(
      { event: 'mfa.trusted_device_removed', userId, deviceId },
      'Trusted device removed',
    );
  }

  async disableMfa(userId: string): Promise<void> {
    await this.domainService.disableMfa(userId);

    this.logger.info(
      { event: 'mfa.disabled', userId },
      'MFA disabled',
    );
  }

  async disableMethod(userId: string, method: MfaMethod): Promise<void> {
    await this.domainService.disableMethod(userId, method);

    this.logger.info(
      { event: 'mfa.method_disabled', userId, method },
      'MFA method disabled',
    );
  }

  async startRecovery(userId: string): Promise<{ token: string }> {
    const result = await this.domainService.startRecovery(userId);

    this.logger.info(
      { event: 'mfa.recovery_started', userId, tokenId: result.tokenId },
      'Recovery started',
    );

    return { token: result.token };
  }

  async completeRecovery(userId: string, token: string): Promise<void> {
    await this.domainService.completeRecovery(userId, token);

    this.logger.info(
      { event: 'mfa.recovery_completed', userId },
      'Recovery completed',
    );
  }

  async resetMfa(userId: string): Promise<void> {
    await this.domainService.resetMfa(userId);

    this.logger.info(
      { event: 'mfa.reset', userId },
      'MFA reset',
    );
  }
}
