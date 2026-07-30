export class CreateWarehouseCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly address?: string | null,
    public readonly status?: string,
    public readonly isDefault?: boolean,
  ) {}
}
