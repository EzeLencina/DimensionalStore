import { Injectable } from '@nestjs/common';
import { TrustedDevice, TrustedDeviceStatus } from '../../domain/types';

@Injectable()
export class InMemoryTrustedDeviceStore {
  private devices = new Map<string, TrustedDevice>();

  async save(device: TrustedDevice): Promise<void> {
    this.devices.set(device.id, { ...device });
  }

  async findById(id: string): Promise<TrustedDevice | null> {
    const found = this.devices.get(id);
    return found ? { ...found } : null;
  }

  async findByUserId(userId: string): Promise<TrustedDevice[]> {
    return Array.from(this.devices.values())
      .filter(d => d.userId === userId)
      .map(d => ({ ...d }));
  }

  async findByUserIdAndDeviceId(userId: string, deviceId: string): Promise<TrustedDevice | null> {
    const found = Array.from(this.devices.values())
      .find(d => d.userId === userId && d.deviceId === deviceId);
    return found ? { ...found } : null;
  }

  async update(device: TrustedDevice): Promise<void> {
    this.devices.set(device.id, { ...device });
  }

  async delete(id: string): Promise<void> {
    this.devices.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [key, d] of this.devices) {
      if (d.userId === userId) {
        this.devices.delete(key);
      }
    }
  }

  async cleanExpired(): Promise<number> {
    let count = 0;
    const now = new Date();
    for (const [id, d] of this.devices) {
      if (d.expiresAt <= now || d.status === 'expired') {
        this.devices.delete(id);
        count++;
      }
    }
    return count;
  }
}
