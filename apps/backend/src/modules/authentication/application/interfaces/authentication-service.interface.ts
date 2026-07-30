import { LoginResult, SessionInfo } from '../../domain/types';

export interface IAuthenticationService {
  login(email: string, password: string, ip?: string, userAgent?: string): Promise<LoginResult>;
  logout(userId: string, sessionId: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<LoginResult>;
  validateCredentials(email: string, password: string): Promise<{ userId: string; email: string }>;
  bootstrapSession(userId: string): Promise<LoginResult>;
}
