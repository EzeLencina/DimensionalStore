import { Session, Device } from '../../domain/entities';
import { CreateSessionParams, SessionMetadata, RenewSessionResult, DeviceInfo } from '../../domain/types';

export interface ISessionService {
  createSession(params: CreateSessionParams): Promise<Session>;
  getValidSession(sessionId: string): Promise<Session>;
  refreshSession(sessionId: string): Promise<RenewSessionResult>;
  revokeSession(sessionId: string, reason?: string): Promise<void>;
  revokeAllUserSessions(userId: string, reason?: string): Promise<void>;
  touchSession(sessionId: string): Promise<void>;
  getUserSessions(userId: string): Promise<SessionMetadata[]>;
  getUserDevices(userId: string): Promise<Device[]>;
}
