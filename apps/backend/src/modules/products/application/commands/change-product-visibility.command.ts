export class ChangeProductVisibilityCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly visibility: string,
  ) {}
}
