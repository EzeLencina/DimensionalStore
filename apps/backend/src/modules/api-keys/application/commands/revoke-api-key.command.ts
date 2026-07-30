export class RevokeApiKeyCommand {
  constructor(
    public readonly keyId: string,
    public readonly reason?: string,
  ) {}
}
