import { Injectable, Inject } from '@nestjs/common';
import { LOGGER_TOKEN } from '@tienda/logger/nest';

@Injectable()
export class SessionEventHandler {
  constructor(
    @Inject(LOGGER_TOKEN) private readonly logger: any,
  ) {}

  handleSessionCreated(event: { sessionId: string; userId: string; deviceId: string }): void {
    this.logger.info({ event: 'session.event.created', ...event }, 'Session created event');
  }

  handleSessionRevoked(event: { sessionId: string; userId: string; reason?: string }): void {
    this.logger.info({ event: 'session.event.revoked', ...event }, 'Session revoked event');
  }

  handleSessionExpired(event: { sessionId: string; userId: string }): void {
    this.logger.info({ event: 'session.event.expired', ...event }, 'Session expired event');
  }

  handleSessionRefreshed(event: { sessionId: string; userId: string }): void {
    this.logger.info({ event: 'session.event.refreshed', ...event }, 'Session refreshed event');
  }

  handleDeviceRegistered(event: { deviceId: string; userId: string }): void {
    this.logger.info({ event: 'session.event.device_registered', ...event }, 'Device registered event');
  }

  handleDeviceRemoved(event: { deviceId: string; userId: string }): void {
    this.logger.info({ event: 'session.event.device_removed', ...event }, 'Device removed event');
  }

  handleConcurrentSessionDetected(event: { userId: string; currentSessionCount: number; maxSessions: number }): void {
    this.logger.warn({ event: 'session.event.concurrent_detected', ...event }, 'Concurrent session detected event');
  }
}
