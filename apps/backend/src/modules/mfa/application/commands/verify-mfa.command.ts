export class VerifyMfaCommand {
  constructor(
    public readonly challengeId: string,
    public readonly code: string,
  ) {}
}
