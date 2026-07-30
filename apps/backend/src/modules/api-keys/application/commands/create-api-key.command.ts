export class CreateApiKeyCommand {
  constructor(
    public readonly serviceAccountId: string,
    public readonly displayName: string,
    public readonly scopes: string[],
    public readonly description?: string,
    public readonly expiresAt?: Date,
    public readonly prefix?: string,
  ) {}
}
