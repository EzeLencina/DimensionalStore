export class GetSessionQuery {
  constructor(
    public readonly sessionId: string,
  ) {}
}

export class GetUserSessionsQuery {
  constructor(
    public readonly userId: string,
  ) {}
}
