export class ChangeCategoryStatusCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly status: string,
  ) {}
}
