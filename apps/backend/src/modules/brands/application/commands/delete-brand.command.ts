export class DeleteBrandCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
