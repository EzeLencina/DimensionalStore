import { SessionId } from '../value-objects/session-id.value-object';
import { DeviceId } from '../value-objects/device-id.value-object';
import { SessionStatus, DeviceInfo, SessionMetadata } from '../types';

export class Session {
  private readonly sessionId: SessionId;
  private readonly userId: string;
  private readonly deviceId: DeviceId;
  private device: DeviceInfo;
  private ipAddress: string;
  private userAgent: string;
  private timezone: string;
  private locale: string;
  private readonly createdAt: Date;
  private lastActivity: Date;
  private expiresAt: Date;
  private revokedAt: Date | null;
  private revocationReason: string | null;
  private status: SessionStatus;

  constructor(params: {
    sessionId?: SessionId;
    userId: string;
    deviceId?: DeviceId;
    device: DeviceInfo;
    ipAddress: string;
    userAgent: string;
    timezone?: string;
    locale?: string;
    createdAt?: Date;
    lastActivity?: Date;
    expiresAt?: Date;
    revokedAt?: Date | null;
    revocationReason?: string | null;
    status?: SessionStatus;
  }) {
    this.sessionId = params.sessionId ?? new SessionId();
    this.userId = params.userId;
    this.deviceId = params.deviceId ?? new DeviceId();
    this.device = { ...params.device };
    this.ipAddress = params.ipAddress;
    this.userAgent = params.userAgent;
    this.timezone = params.timezone ?? 'UTC';
    this.locale = params.locale ?? 'en';
    this.createdAt = params.createdAt ?? new Date();
    this.lastActivity = params.lastActivity ?? new Date();
    this.expiresAt = params.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    this.revokedAt = params.revokedAt ?? null;
    this.revocationReason = params.revocationReason ?? null;
    this.status = params.status ?? 'active';
  }

  getSessionId(): SessionId { return this.sessionId; }
  getUserId(): string { return this.userId; }
  getDeviceId(): DeviceId { return this.deviceId; }
  getDevice(): DeviceInfo { return { ...this.device }; }
  getIpAddress(): string { return this.ipAddress; }
  getUserAgent(): string { return this.userAgent; }
  getTimezone(): string { return this.timezone; }
  getLocale(): string { return this.locale; }
  getCreatedAt(): Date { return this.createdAt; }
  getLastActivity(): Date { return this.lastActivity; }
  getExpiresAt(): Date { return this.expiresAt; }
  getRevokedAt(): Date | null { return this.revokedAt; }
  getRevocationReason(): string | null { return this.revocationReason; }
  getStatus(): SessionStatus { return this.status; }

  isActive(): boolean {
    return this.status === 'active' && new Date() < this.expiresAt;
  }

  isExpired(): boolean {
    return new Date() >= this.expiresAt || this.status === 'expired';
  }

  isRevoked(): boolean {
    return this.status === 'revoked';
  }

  touch(): void {
    this.lastActivity = new Date();
  }

  renew(ttlMs: number): void {
    this.expiresAt = new Date(Date.now() + ttlMs);
    this.lastActivity = new Date();
    this.status = 'active';
  }

  revoke(reason?: string): void {
    this.status = 'revoked';
    this.revokedAt = new Date();
    this.revocationReason = reason ?? null;
  }

  expire(): void {
    this.status = 'expired';
  }

  updateIp(ip: string): void {
    this.ipAddress = ip;
    this.touch();
  }

  updateDevice(device: DeviceInfo): void {
    this.device = { ...device };
    this.touch();
  }

  toMetadata(): SessionMetadata {
    return {
      sessionId: this.sessionId.getValue(),
      userId: this.userId,
      deviceId: this.deviceId.getValue(),
      device: { ...this.device },
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      timezone: this.timezone,
      locale: this.locale,
      createdAt: this.createdAt,
      lastActivity: this.lastActivity,
      expiresAt: this.expiresAt,
      revokedAt: this.revokedAt ?? undefined,
      revocationReason: this.revocationReason ?? undefined,
      status: this.status,
    };
  }

  static fromMetadata(meta: SessionMetadata): Session {
    return new Session({
      sessionId: new SessionId(meta.sessionId),
      userId: meta.userId,
      deviceId: new DeviceId(meta.deviceId),
      device: meta.device,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      timezone: meta.timezone,
      locale: meta.locale,
      createdAt: meta.createdAt,
      lastActivity: meta.lastActivity,
      expiresAt: meta.expiresAt,
      revokedAt: meta.revokedAt ?? null,
      revocationReason: meta.revocationReason ?? null,
      status: meta.status,
    });
  }
}
