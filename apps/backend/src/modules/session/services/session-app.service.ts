import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';
import { LOGGER_TOKEN } from '@tienda/logger/nest';
import { ISessionService } from '../application/interfaces';
import { SessionManager, SessionFactory, SessionValidator } from '../domain/services';
import { Session } from '../domain/entities/session.entity';
import { Device } from '../domain/entities/device.entity';
import { CreateSessionParams, SessionMetadata, RenewSessionResult, DeviceInfo, SessionPolicy } from '../domain/types';
import { RedisSessionRepository, RedisDeviceRepository } from '../infrastructure/redis';
import { SessionCreatedEvent, SessionRevokedEvent, SessionRefreshedEvent, DeviceRegisteredEvent, ConcurrentSessionDetectedEvent } from '../domain/events';
import { AUTH_CONSTANTS } from '../constants';

@Injectable()
export class SessionAppService implements ISessionService {
  private readonly manager: SessionManager;

  constructor(
    @Inject(RedisService)
    private readonly redis: RedisService,
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {
    const sessionRepo = new RedisSessionRepository(this.redis);
    const deviceRepo = new RedisDeviceRepository(this.redis);
    const factory = new SessionFactory();
    const validator = new SessionValidator();
    const policy: SessionPolicy = {
      maxConcurrentSessions: AUTH_CONSTANTS.MAX_CONCURRENT_SESSIONS,
      idleTimeoutMinutes: AUTH_CONSTANTS.IDLE_TIMEOUT_MINUTES,
      absoluteTimeoutMinutes: AUTH_CONSTANTS.ABSOLUTE_TIMEOUT_MINUTES,
    };
    this.manager = new SessionManager(sessionRepo, deviceRepo, factory, validator, policy);
  }

  async createSession(params: CreateSessionParams): Promise<Session> {
    const session = await this.manager.createSession(params);

    this.logger.info({
      event: 'session.created',
      sessionId: session.getSessionId().getValue(),
      userId: session.getUserId(),
      deviceType: session.getDevice().type,
      ipAddress: session.getIpAddress(),
    }, 'Session created');

    return session;
  }

  async getValidSession(sessionId: string): Promise<Session> {
    return this.manager.getValidSession(sessionId);
  }

  async refreshSession(sessionId: string): Promise<RenewSessionResult> {
    const result = await this.manager.refreshSession(sessionId);

    this.logger.info({
      event: 'session.refreshed',
      sessionId,
      expiresAt: result.session.expiresAt,
    }, 'Session refreshed');

    return result;
  }

  async revokeSession(sessionId: string, reason?: string): Promise<void> {
    await this.manager.revokeSession(sessionId, reason);

    this.logger.info({
      event: 'session.revoked',
      sessionId,
      reason,
    }, 'Session revoked');
  }

  async revokeAllUserSessions(userId: string, reason?: string): Promise<void> {
    await this.manager.revokeAllUserSessions(userId, reason);

    this.logger.info({
      event: 'session.revoked_all',
      userId,
      reason,
    }, 'All user sessions revoked');
  }

  async touchSession(sessionId: string): Promise<void> {
    await this.manager.touchSession(sessionId);
  }

  async getUserSessions(userId: string): Promise<SessionMetadata[]> {
    return this.manager.getUserSessions(userId);
  }

  async getUserDevices(userId: string): Promise<Device[]> {
    return this.manager.getUserDevices(userId);
  }
}
