import { DeviceInfo } from '../../domain/types';

export interface CreateSessionRequestDto {
  userId: string;
  deviceId: string;
  device: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  timezone?: string;
  locale?: string;
}

export interface SessionResponseDto {
  sessionId: string;
  userId: string;
  deviceId: string;
  device: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  timezone: string;
  locale: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  status: string;
}

export interface DeviceResponseDto {
  deviceId: string;
  userId: string;
  type: string;
  name: string;
  os: string;
  browser: string;
  isTrusted: boolean;
  isRemembered: boolean;
  firstSeen: string;
  lastSeen: string;
}

export interface RevokeSessionDto {
  sessionId: string;
  reason?: string;
}

export interface TouchSessionDto {
  sessionId: string;
}
