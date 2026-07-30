export class LoginRequestDto {
  email!: string;
  password!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  refreshToken!: string;
  sessionId!: string;
  expiresAt!: string;
}
