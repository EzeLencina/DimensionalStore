export class LinkCustomerToUserCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly userId: string) {}
}
