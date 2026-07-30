export class CreateCustomerCommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly source?: string,
    public readonly locale?: string,
    public readonly preferredCurrency?: string,
    public readonly userId?: string | null,
    public readonly phone?: string | null,
  ) {}
}
