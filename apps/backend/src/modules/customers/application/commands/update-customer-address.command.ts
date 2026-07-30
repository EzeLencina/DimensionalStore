export class UpdateCustomerAddressCommand {
  constructor(
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly addressId: string,
    public readonly label: string | null,
    public readonly recipientName: string,
    public readonly phone: string | null,
    public readonly street: string,
    public readonly number: string,
    public readonly apartment: string | null,
    public readonly city: string,
    public readonly province: string,
    public readonly postalCode: string,
    public readonly country: string,
    public readonly notes: string | null,
  ) {}
}
