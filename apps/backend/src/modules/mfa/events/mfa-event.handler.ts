import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class MfaEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleMfaEnabled(event: { userId: string; method: string }): void {
    this.logger.info(
      { event: 'mfa.event.enabled', userId: event.userId, method: event.method },
      'MFA enabled event',
    );
  }

  handleMfaDisabled(event: { userId: string; method: string }): void {
    this.logger.info(
      { event: 'mfa.event.disabled', userId: event.userId, method: event.method },
      'MFA disabled event',
    );
  }

  handleMfaVerified(event: { userId: string; method: string; challengeId: string }): void {
    this.logger.info(
      { event: 'mfa.event.verified', userId: event.userId, method: event.method, challengeId: event.challengeId },
      'MFA verified event',
    );
  }

  handleChallengeCreated(event: { challengeId: string; userId: string; method: string }): void {
    this.logger.info(
      { event: 'mfa.event.challenge_created', userId: event.userId, method: event.method },
      'Challenge created event',
    );
  }

  handleRecoveryStarted(event: { userId: string; tokenId: string }): void {
    this.logger.info(
      { event: 'mfa.event.recovery_started', userId: event.userId },
      'Recovery started event',
    );
  }

  handleBackupCodeUsed(event: { userId: string; codeId: string }): void {
    this.logger.info(
      { event: 'mfa.event.backup_code_used', userId: event.userId },
      'Backup code used event',
    );
  }

  handleTrustedDeviceAdded(event: { userId: string; deviceId: string }): void {
    this.logger.info(
      { event: 'mfa.event.trusted_device_added', userId: event.userId },
      'Trusted device added event',
    );
  }

  handleTrustedDeviceRemoved(event: { userId: string; deviceId: string }): void {
    this.logger.info(
      { event: 'mfa.event.trusted_device_removed', userId: event.userId },
      'Trusted device removed event',
    );
  }
}
