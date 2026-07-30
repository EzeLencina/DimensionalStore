export class UpdateCustomerProfileCommand {
  constructor(
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone?: string | null,
    public readonly documentType?: string | null,
    public readonly documentNumber?: string | null,
  ) {}
}
