export class RotateApiKeyCommand {
  constructor(
    public readonly keyId: string,
    public readonly prefix?: string,
  ) {}
}
