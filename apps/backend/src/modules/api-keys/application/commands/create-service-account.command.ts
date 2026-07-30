export class CreateServiceAccountCommand {
  constructor(
    public readonly name: string,
    public readonly ownerId: string,
    public readonly description?: string,
    public readonly tenantId?: string,
    public readonly branchId?: string,
    public readonly metadata?: Record<string, unknown>,
  ) {}
}
