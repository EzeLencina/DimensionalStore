export type TokenType =
  | 'access'
  | 'refresh'
  | 'password_reset'
  | 'email_verification'
  | 'magic_link'
  | 'api';

export type TokenStatus = 'active' | 'revoked' | 'expired';

export interface TokenPayload {
  sub: string;
  email: string;
  type: TokenType;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  jti?: string;
  sessionId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
}

export interface LoginResult {
  tokenPair: TokenPair;
  session: SessionInfo;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}
