import { Session } from '../entities/session.entity';
import { Device } from '../entities/device.entity';
import { CreateSessionParams, SessionMetadata, SessionPolicy, DeviceInfo } from '../types';

export class SessionFactory {
  private readonly defaultPolicy: SessionPolicy = {
    maxConcurrentSessions: 5,
    idleTimeoutMinutes: 30,
    absoluteTimeoutMinutes: 1440,
  };

  createSession(params: CreateSessionParams, policy?: Partial<SessionPolicy>): Session {
    const mergedPolicy = { ...this.defaultPolicy, ...policy };
    const absoluteTimeoutMs = mergedPolicy.absoluteTimeoutMinutes * 60 * 1000;

    return new Session({
      userId: params.userId,
      device: params.device,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      timezone: params.timezone ?? 'UTC',
      locale: params.locale ?? 'en',
      expiresAt: new Date(Date.now() + absoluteTimeoutMs),
    });
  }

  createDevice(userId: string, deviceInfo: DeviceInfo): Device {
    return new Device({
      userId,
      type: deviceInfo.type,
      name: deviceInfo.name,
      os: deviceInfo.os,
      browser: deviceInfo.browser,
      isTrusted: deviceInfo.isTrusted,
      isRemembered: deviceInfo.isRemembered,
    });
  }

  restoreSession(metadata: SessionMetadata): Session {
    return Session.fromMetadata(metadata);
  }

  getDefaultPolicy(): SessionPolicy {
    return { ...this.defaultPolicy };
  }
}
