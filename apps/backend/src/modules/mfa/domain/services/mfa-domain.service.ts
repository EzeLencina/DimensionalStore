import { randomUUID } from 'node:crypto';
import type {
  MfaMethod,
  MfaEnrollment,
  MfaState,
  TotpSecretData,
  MfaEnrollmentResult,
  BackupCodeResult,
  MfaChallenge,
  MfaVerificationResult,
  TrustedDevice,
  RecoveryToken,
} from '../types';
import { MfaException, MFA_ERROR_CODES } from '../exceptions';
import type { IEnrollmentStore, IChallengeStore, IBackupCodeStore, ITrustedDeviceStore, IRecoveryTokenStore, ITotpProvider, IHashingProvider } from './stores';
import { BackupCodeDomainService } from './backup-code-domain.service';
import { TrustedDeviceDomainService } from './trusted-device-domain.service';
import { MFA_CONSTANTS } from '../../constants';

export class MfaDomainService {
  constructor(
    private readonly enrollmentStore: IEnrollmentStore,
    private readonly challengeStore: IChallengeStore,
    private readonly backupCodeStore: IBackupCodeStore,
    private readonly trustedDeviceStore: ITrustedDeviceStore,
    private readonly recoveryTokenStore: IRecoveryTokenStore,
    private readonly totpProvider: ITotpProvider,
    private readonly hashingProvider: IHashingProvider,
    private readonly backupCodeService: BackupCodeDomainService,
    private readonly trustedDeviceService: TrustedDeviceDomainService,
  ) {}

  async getState(userId: string): Promise<MfaState> {
    const enrollments = await this.enrollmentStore.findByUserId(userId);
    return {
      userId,
      status: enrollments.length > 0 ? 'enabled' : 'disabled',
      enrolledMethods: enrollments.filter(e => e.status === 'active').map(e => e.method),
      enrolledAt: enrollments.length > 0 ? enrollments[0]!.enabledAt : undefined,
    };
  }

  async enrollTotp(userId: string, issuer?: string): Promise<MfaEnrollmentResult> {
    const existing = await this.enrollmentStore.findByUserIdAndMethod(userId, 'totp');
    if (existing && existing.status === 'active') {
      throw new MfaException(MFA_ERROR_CODES.MFA_ALREADY_ENABLED, 'TOTP is already enrolled');
    }

    const secretData = this.totpProvider.generateSecret();

    const enrollment: MfaEnrollment = {
      userId,
      method: 'totp',
      status: 'active',
      enabledAt: new Date(),
      secret: secretData.base32,
    };
    await this.enrollmentStore.save(enrollment);

    const secretInfo: TotpSecretData = {
      secret: secretData.base32,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      issuer: issuer ?? MFA_CONSTANTS.TOTP_ISSUER,
      accountName: userId,
    };

    return {
      userId,
      method: 'totp',
      status: 'active',
      secretData: secretInfo,
      enrolledAt: enrollment.enabledAt,
    };
  }

  async generateBackupCodes(userId: string): Promise<BackupCodeResult> {
    const { plainCodes, hashedCodes } = await this.backupCodeService.generateCodes();

    const existing = await this.enrollmentStore.findByUserIdAndMethod(userId, 'backup_codes');
    if (existing && existing.status === 'active') {
      await this.backupCodeStore.deleteByUserId(userId);
    }

    const enrollment: MfaEnrollment = {
      userId,
      method: 'backup_codes',
      status: 'active',
      enabledAt: new Date(),
    };
    await this.enrollmentStore.save(enrollment);
    await this.backupCodeStore.saveMany(hashedCodes);

    return { plainCodes, hashedCodes };
  }

  async verifyTotp(userId: string, code: string): Promise<boolean> {
    const enrollment = await this.enrollmentStore.findByUserIdAndMethod(userId, 'totp');
    if (!enrollment || enrollment.status !== 'active') {
      throw new MfaException(MFA_ERROR_CODES.MFA_NOT_ENABLED, 'TOTP is not enabled');
    }
    if (!enrollment.secret) {
      throw new MfaException(MFA_ERROR_CODES.MFA_SECRET_GENERATION_FAILED, 'TOTP secret not found');
    }

    const isValid = this.totpProvider.verifyCode(enrollment.secret!, code, MFA_CONSTANTS.TOTP_CLOCK_SKEW_STEPS);
    if (!isValid) {
      throw new MfaException(MFA_ERROR_CODES.MFA_INVALID_TOTP_CODE, 'Invalid TOTP code');
    }

    return true;
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const unusedCodes = await this.backupCodeStore.findUnusedByUserId(userId);
    if (unusedCodes.length === 0) {
      throw new MfaException(MFA_ERROR_CODES.MFA_NO_BACKUP_CODES, 'No unused backup codes available');
    }

    for (const stored of unusedCodes) {
      const matches = await this.hashingProvider.verify(stored.hashedCode, code);
      if (matches) {
        stored.used = true;
        stored.usedAt = new Date();
        await this.backupCodeStore.update(stored);
        return true;
      }
    }

    throw new MfaException(MFA_ERROR_CODES.MFA_INVALID_BACKUP_CODE, 'Invalid backup code');
  }

  async isTrustedDevice(userId: string, deviceId: string): Promise<boolean> {
    return this.trustedDeviceService.isTrusted(userId, deviceId);
  }

  async trustDevice(userId: string, deviceId: string): Promise<TrustedDevice> {
    return this.trustedDeviceService.trust(userId, deviceId);
  }

  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    await this.trustedDeviceService.remove(userId, deviceId);
  }

  async generateChallenge(userId: string, method: MfaMethod): Promise<MfaChallenge> {
    const enrollment = await this.enrollmentStore.findByUserIdAndMethod(userId, method);
    if (!enrollment || enrollment.status !== 'active') {
      throw new MfaException(MFA_ERROR_CODES.MFA_NOT_ENABLED, `MFA method ${method} is not enabled`);
    }

    const now = new Date();
    const challenge: MfaChallenge = {
      id: randomUUID(),
      userId,
      method,
      status: 'pending',
      createdAt: now,
      expiresAt: new Date(now.getTime() + MFA_CONSTANTS.CHALLENGE_TTL_MINUTES * 60 * 1000),
      attempts: 0,
      maxAttempts: MFA_CONSTANTS.CHALLENGE_MAX_ATTEMPTS,
    };

    await this.challengeStore.save(challenge);
    return challenge;
  }

  async verifyChallenge(challengeId: string, code: string): Promise<MfaVerificationResult> {
    const challenge = await this.challengeStore.findById(challengeId);
    if (!challenge) {
      throw new MfaException(MFA_ERROR_CODES.MFA_CHALLENGE_INVALID, 'Challenge not found');
    }

    if (challenge.status !== 'pending') {
      throw new MfaException(MFA_ERROR_CODES.MFA_CHALLENGE_INVALID, `Challenge is ${challenge.status}`);
    }

    if (challenge.expiresAt <= new Date()) {
      challenge.status = 'expired';
      await this.challengeStore.update(challenge);
      throw new MfaException(MFA_ERROR_CODES.MFA_CHALLENGE_EXPIRED, 'Challenge has expired');
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      challenge.status = 'failed';
      await this.challengeStore.update(challenge);
      throw new MfaException(MFA_ERROR_CODES.MFA_MAX_ATTEMPTS_EXCEEDED, 'Maximum verification attempts exceeded');
    }

    challenge.attempts += 1;

    try {
      if (challenge.method === 'totp') {
        await this.verifyTotp(challenge.userId, code);
      } else if (challenge.method === 'backup_codes') {
        await this.verifyBackupCode(challenge.userId, code);
      } else {
        throw new MfaException(MFA_ERROR_CODES.MFA_METHOD_NOT_SUPPORTED, `Method ${challenge.method} not supported`);
      }
    } catch (error) {
      if (challenge.attempts >= challenge.maxAttempts) {
        challenge.status = 'failed';
      }
      await this.challengeStore.update(challenge);
      throw error;
    }

    challenge.status = 'verified';
    challenge.verifiedAt = new Date();
    await this.challengeStore.update(challenge);

    return {
      verified: true,
      userId: challenge.userId,
      method: challenge.method,
      challengeId,
    };
  }

  async disableMfa(userId: string): Promise<void> {
    const enrollments = await this.enrollmentStore.findByUserId(userId);
    if (enrollments.length === 0) {
      throw new MfaException(MFA_ERROR_CODES.MFA_NOT_ENABLED, 'MFA is not enabled');
    }

    await this.enrollmentStore.deleteAllByUserId(userId);
    await this.backupCodeStore.deleteByUserId(userId);
    await this.trustedDeviceStore.deleteByUserId(userId);
    await this.recoveryTokenStore.deleteByUserId(userId);

    const challenges = await this.challengeStore.findByUserId(userId);
    for (const c of challenges) {
      await this.challengeStore.delete(c.id);
    }
  }

  async disableMethod(userId: string, method: MfaMethod): Promise<void> {
    const enrollment = await this.enrollmentStore.findByUserIdAndMethod(userId, method);
    if (!enrollment) {
      throw new MfaException(MFA_ERROR_CODES.MFA_ENROLLMENT_NOT_FOUND, `Enrollment for ${method} not found`);
    }

    await this.enrollmentStore.deleteByUserIdAndMethod(userId, method);

    if (method === 'backup_codes') {
      await this.backupCodeStore.deleteByUserId(userId);
    }
  }

  async startRecovery(userId: string): Promise<{ token: string; tokenId: string }> {
    const enrollment = await this.enrollmentStore.findByUserId(userId);
    if (enrollment.length === 0) {
      throw new MfaException(MFA_ERROR_CODES.MFA_NOT_ENABLED, 'MFA is not enabled');
    }

    const rawToken = randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '');
    const hashedToken = await this.hashingProvider.hash(rawToken);

    const now = new Date();
    const recoveryToken: RecoveryToken = {
      id: randomUUID(),
      userId,
      hashedToken,
      used: false,
      expiresAt: new Date(now.getTime() + MFA_CONSTANTS.RECOVERY_TOKEN_TTL_HOURS * 60 * 60 * 1000),
      createdAt: now,
    };

    await this.recoveryTokenStore.save(recoveryToken);

    return { token: rawToken, tokenId: recoveryToken.id };
  }

  async completeRecovery(userId: string, rawToken: string): Promise<void> {
    const existing = await this.recoveryTokenStore.findByUserIdActive(userId);
    if (!existing || existing.used) {
      throw new MfaException(MFA_ERROR_CODES.MFA_INVALID_RECOVERY_TOKEN, 'No active recovery token found');
    }

    if (existing.expiresAt <= new Date()) {
      throw new MfaException(MFA_ERROR_CODES.MFA_RECOVERY_TOKEN_EXPIRED, 'Recovery token has expired');
    }

    const isValid = await this.hashingProvider.verify(existing.hashedToken, rawToken);
    if (!isValid) {
      throw new MfaException(MFA_ERROR_CODES.MFA_INVALID_RECOVERY_TOKEN, 'Invalid recovery token');
    }

    existing.used = true;
    existing.usedAt = new Date();
    await this.recoveryTokenStore.update(existing);

    await this.disableMfa(userId);
  }

  async resetMfa(userId: string): Promise<void> {
    await this.disableMfa(userId);
  }
}
