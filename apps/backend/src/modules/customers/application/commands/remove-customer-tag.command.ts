export class RemoveCustomerTagCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly tagId: string) {}
}
