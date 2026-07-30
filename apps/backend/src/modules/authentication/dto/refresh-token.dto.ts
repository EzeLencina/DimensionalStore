export class RefreshTokenRequestDto {
  refreshToken!: string;
}

export class RefreshTokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  sessionId!: string;
  expiresAt!: string;
}
