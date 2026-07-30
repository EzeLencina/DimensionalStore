import { Session } from '../entities/session.entity';
import { Device } from '../entities/device.entity';
import { SessionFactory } from './session-factory.service';
import { SessionValidator } from './session-validator.service';
import { CreateSessionParams, SessionPolicy, SessionMetadata, RenewSessionResult, DeviceInfo } from '../types';
import { SessionException, SESSION_ERROR_CODES } from '../exceptions';

export interface ISessionStore {
  save(session: Session): Promise<void>;
  findById(sessionId: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  delete(sessionId: string): Promise<void>;
  deleteAllByUserId(userId: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
  updateActivity(sessionId: string): Promise<void>;
}

export interface IDeviceStore {
  save(device: Device): Promise<void>;
  findById(deviceId: string): Promise<Device | null>;
  findByUserId(userId: string): Promise<Device[]>;
  delete(deviceId: string): Promise<void>;
}

export class SessionManager {
  private readonly DEFAULT_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly sessionStore: ISessionStore,
    private readonly deviceStore: IDeviceStore,
    private readonly factory: SessionFactory,
    private readonly validator: SessionValidator,
    private readonly policy: SessionPolicy,
  ) {}

  async createSession(params: CreateSessionParams): Promise<Session> {
    let device = await this.deviceStore.findById(params.deviceId);

    if (!device) {
      device = this.factory.createDevice(params.userId, params.device);
      await this.deviceStore.save(device);
    }

    const currentCount = await this.sessionStore.countByUserId(params.userId);
    this.validator.validateConcurrentSessions(currentCount, this.policy.maxConcurrentSessions);

    const session = this.factory.createSession(params, this.policy);
    await this.sessionStore.save(session);

    return session;
  }

  async loadSession(sessionId: string): Promise<Session | null> {
    return this.sessionStore.findById(sessionId);
  }

  async getValidSession(sessionId: string): Promise<Session> {
    const session = await this.sessionStore.findById(sessionId);
    return this.validator.validateSession(session);
  }

  async refreshSession(sessionId: string): Promise<RenewSessionResult> {
    const session = await this.getValidSession(sessionId);
    session.renew(this.DEFAULT_SESSION_TTL_MS);
    await this.sessionStore.save(session);
    return { session: session.toMetadata(), renewed: true };
  }

  async revokeSession(sessionId: string, reason?: string): Promise<void> {
    const session = await this.sessionStore.findById(sessionId);
    if (!session) {
      throw new SessionException(SESSION_ERROR_CODES.SESSION_NOT_FOUND, 'Session not found');
    }
    session.revoke(reason);
    await this.sessionStore.save(session);
  }

  async revokeAllUserSessions(userId: string, reason?: string): Promise<void> {
    const sessions = await this.sessionStore.findByUserId(userId);
    for (const session of sessions) {
      session.revoke(reason);
      await this.sessionStore.save(session);
    }
  }

  async touchSession(sessionId: string): Promise<void> {
    const session = await this.getValidSession(sessionId);
    session.touch();
    await this.sessionStore.updateActivity(sessionId);
  }

  async expireSession(sessionId: string): Promise<void> {
    const session = await this.sessionStore.findById(sessionId);
    if (session) {
      session.expire();
      await this.sessionStore.save(session);
    }
  }

  async getUserSessions(userId: string): Promise<SessionMetadata[]> {
    const sessions = await this.sessionStore.findByUserId(userId);
    return sessions.map(s => s.toMetadata());
  }

  async getUserDevices(userId: string): Promise<Device[]> {
    return this.deviceStore.findByUserId(userId);
  }

  async registerDevice(userId: string, deviceInfo: DeviceInfo): Promise<Device> {
    const device = this.factory.createDevice(userId, deviceInfo);
    await this.deviceStore.save(device);
    return device;
  }

  async removeDevice(deviceId: string): Promise<void> {
    await this.deviceStore.delete(deviceId);
  }
}
