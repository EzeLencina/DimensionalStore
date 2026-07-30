export type SessionStatus = 'active' | 'expired' | 'revoked';

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'browser' | 'api_client';

export interface DeviceInfo {
  type: DeviceType;
  name?: string;
  os?: string;
  browser?: string;
  isTrusted: boolean;
  isRemembered: boolean;
}

export interface SessionMetadata {
  sessionId: string;
  userId: string;
  deviceId: string;
  device: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  timezone: string;
  locale: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  revokedAt?: Date;
  revocationReason?: string;
  status: SessionStatus;
}

export interface SessionPolicy {
  maxConcurrentSessions: number;
  idleTimeoutMinutes: number;
  absoluteTimeoutMinutes: number;
}

export interface CreateSessionParams {
  userId: string;
  deviceId: string;
  device: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  timezone?: string;
  locale?: string;
}

export interface RenewSessionResult {
  session: SessionMetadata;
  renewed: boolean;
}
