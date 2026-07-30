import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class ApiKeyEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleKeyCreated(event: { keyId: string; serviceAccountId: string }): void {
    this.logger.info(
      { event: 'api_keys.event.key_created', keyId: event.keyId, serviceAccountId: event.serviceAccountId },
      'Key created event',
    );
  }

  handleKeyRotated(event: { keyId: string; oldKeyId: string; serviceAccountId: string; oldVersion: number; newVersion: number }): void {
    this.logger.info(
      { event: 'api_keys.event.key_rotated', keyId: event.keyId, oldKeyId: event.oldKeyId, serviceAccountId: event.serviceAccountId, oldVersion: event.oldVersion, newVersion: event.newVersion },
      'Key rotated event',
    );
  }

  handleKeyRevoked(event: { keyId: string; serviceAccountId: string; reason?: string }): void {
    this.logger.info(
      { event: 'api_keys.event.key_revoked', keyId: event.keyId, serviceAccountId: event.serviceAccountId, reason: event.reason },
      'Key revoked event',
    );
  }

  handleKeyExpired(event: { keyId: string; serviceAccountId: string }): void {
    this.logger.info(
      { event: 'api_keys.event.key_expired', keyId: event.keyId, serviceAccountId: event.serviceAccountId },
      'Key expired event',
    );
  }

  handleKeyUsed(event: { keyId: string; serviceAccountId: string }): void {
    this.logger.info(
      { event: 'api_keys.event.key_used', keyId: event.keyId, serviceAccountId: event.serviceAccountId },
      'Key used event',
    );
  }

  handleServiceAccountCreated(event: { serviceAccountId: string; name: string; ownerId: string }): void {
    this.logger.info(
      { event: 'api_keys.event.service_account_created', serviceAccountId: event.serviceAccountId, name: event.name, ownerId: event.ownerId },
      'Service account created event',
    );
  }

  handleServiceAccountDisabled(event: { serviceAccountId: string; reason?: string }): void {
    this.logger.info(
      { event: 'api_keys.event.service_account_disabled', serviceAccountId: event.serviceAccountId, reason: event.reason },
      'Service account disabled event',
    );
  }

  handleMachineAuthenticated(event: { serviceAccountId: string; keyId: string; scopes: string[] }): void {
    this.logger.info(
      { event: 'api_keys.event.machine_authenticated', serviceAccountId: event.serviceAccountId, scopes: event.scopes },
      'Machine authenticated event',
    );
  }
}
