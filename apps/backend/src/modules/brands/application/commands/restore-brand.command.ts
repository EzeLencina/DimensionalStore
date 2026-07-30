export class RestoreBrandCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
