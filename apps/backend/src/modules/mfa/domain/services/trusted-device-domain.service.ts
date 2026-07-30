import { randomUUID } from 'node:crypto';
import type { TrustedDevice } from '../types';
import { MfaException, MFA_ERROR_CODES } from '../exceptions';
import type { ITrustedDeviceStore } from './stores';
import { MFA_CONSTANTS } from '../../constants';

export class TrustedDeviceDomainService {
  constructor(private readonly store: ITrustedDeviceStore) {}

  async isTrusted(userId: string, deviceId: string): Promise<boolean> {
    const record = await this.store.findByUserIdAndDeviceId(userId, deviceId);
    if (!record) {
      return false;
    }

    if (record.status !== 'active') {
      return false;
    }

    if (record.expiresAt <= new Date()) {
      const updated: TrustedDevice = { ...record, status: 'expired' };
      await this.store.update(updated);
      return false;
    }

    return true;
  }

  async trust(userId: string, deviceId: string): Promise<TrustedDevice> {
    const existing = await this.store.findByUserIdAndDeviceId(userId, deviceId);
    if (existing && existing.status === 'active') {
      return existing;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + MFA_CONSTANTS.TRUSTED_DEVICE_TTL_DAYS * 24 * 60 * 60 * 1000);

    const device: TrustedDevice = {
      id: randomUUID(),
      userId,
      deviceId,
      trustedAt: now,
      expiresAt,
      status: 'active',
      lastUsedAt: now,
    };

    await this.store.save(device);
    return device;
  }

  async remove(userId: string, deviceId: string): Promise<void> {
    const record = await this.store.findByUserIdAndDeviceId(userId, deviceId);
    if (!record) {
      throw new MfaException(MFA_ERROR_CODES.MFA_TRUSTED_DEVICE_NOT_FOUND, 'Trusted device not found');
    }

    const updated: TrustedDevice = { ...record, status: 'revoked' };
    await this.store.update(updated);
  }

  async cleanExpired(): Promise<number> {
    const records = await this.store.findByUserId('');
    let count = 0;
    const now = new Date();
    for (const record of records) {
      if (record.expiresAt <= now) {
        const updated: TrustedDevice = { ...record, status: 'expired' };
        await this.store.update(updated);
        count++;
      }
    }
    return count;
  }
}
