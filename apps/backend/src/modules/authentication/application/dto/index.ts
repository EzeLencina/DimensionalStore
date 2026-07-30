export interface LoginRequestDto {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  expiresAt: string;
}

export interface LogoutRequestDto {
  sessionId: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface TokenPairDto {
  accessToken: string;
  refreshToken: string;
}

export interface ValidateCredentialsResultDto {
  valid: boolean;
  userId?: string;
  email?: string;
}
