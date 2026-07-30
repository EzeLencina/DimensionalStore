import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';
import { IDeviceStore } from '../../domain/services/session-manager.service';
import { Device } from '../../domain/entities/device.entity';

const DEVICE_PREFIX = 'device:';
const USER_DEVICES_PREFIX = 'user_devices:';

@Injectable()
export class RedisDeviceRepository implements IDeviceStore {
  constructor(
    @Inject(RedisService)
    private readonly redis: RedisService,
  ) {}

  async save(device: Device): Promise<void> {
    const deviceKey = `${DEVICE_PREFIX}${device.getDeviceId().getValue()}`;
    const userKey = `${USER_DEVICES_PREFIX}${device.getUserId()}`;

    const data = {
      deviceId: device.getDeviceId().getValue(),
      userId: device.getUserId(),
      type: device.getType(),
      name: device.getName(),
      os: device.getOs(),
      browser: device.getBrowser(),
      isTrusted: device.isTrustedDevice(),
      isRemembered: device.isRememberedDevice(),
      firstSeen: device.getFirstSeen().toISOString(),
      lastSeen: device.getLastSeen().toISOString(),
    };

    await Promise.all([
      this.redis.setJson(deviceKey, data),
      this.redis.sadd(userKey, device.getDeviceId().getValue()),
    ]);
  }

  async findById(deviceId: string): Promise<Device | null> {
    const deviceKey = `${DEVICE_PREFIX}${deviceId}`;
    const data = await this.redis.get<Record<string, unknown>>(deviceKey);
    if (!data) return null;

    try {
      return new Device({
        deviceId: undefined,
        userId: data['userId'] as string,
        type: data['type'] as any,
        name: data['name'] as string,
        os: data['os'] as string,
        browser: data['browser'] as string,
        isTrusted: data['isTrusted'] as boolean,
        isRemembered: data['isRemembered'] as boolean,
        firstSeen: new Date(data['firstSeen'] as string),
        lastSeen: new Date(data['lastSeen'] as string),
      });
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const userKey = `${USER_DEVICES_PREFIX}${userId}`;
    const deviceIds = await this.redis.smembers(userKey);

    if (deviceIds.length === 0) return [];

    const keys = deviceIds.map(id => `${DEVICE_PREFIX}${id}`);
    const results = await this.redis.mget<Record<string, unknown>>(keys);

    return results
      .filter((r): r is Record<string, unknown> => r !== null)
      .map(r => {
        try {
          return new Device({
            deviceId: undefined,
            userId: r['userId'] as string,
            type: r['type'] as any,
            name: r['name'] as string,
            os: r['os'] as string,
            browser: r['browser'] as string,
            isTrusted: r['isTrusted'] as boolean,
            isRemembered: r['isRemembered'] as boolean,
            firstSeen: new Date(r['firstSeen'] as string),
            lastSeen: new Date(r['lastSeen'] as string),
          });
        } catch {
          return null;
        }
      })
      .filter((d): d is Device => d !== null);
  }

  async delete(deviceId: string): Promise<void> {
    const deviceKey = `${DEVICE_PREFIX}${deviceId}`;
    const data = await this.redis.get<Record<string, unknown>>(deviceKey);
    if (data) {
      const userId = data['userId'] as string;
      const userKey = `${USER_DEVICES_PREFIX}${userId}`;
      await Promise.all([
        this.redis.del(deviceKey),
        this.redis.srem(userKey, deviceId),
      ]);
    }
  }
}
