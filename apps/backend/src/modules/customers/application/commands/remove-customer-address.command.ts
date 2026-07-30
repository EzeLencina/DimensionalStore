export class RemoveCustomerAddressCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly addressId: string) {}
}
