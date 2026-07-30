export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly ip?: string,
    public readonly userAgent?: string,
  ) {}
}

export class LogoutCommand {
  constructor(
    public readonly userId: string,
    public readonly sessionId: string,
  ) {}
}

export class RefreshTokenCommand {
  constructor(
    public readonly refreshToken: string,
  ) {}
}
