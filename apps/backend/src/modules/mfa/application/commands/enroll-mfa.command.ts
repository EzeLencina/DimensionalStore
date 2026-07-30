export class EnrollMfaCommand {
  constructor(
    public readonly userId: string,
    public readonly method: 'totp',
    public readonly issuer?: string,
  ) {}
}
