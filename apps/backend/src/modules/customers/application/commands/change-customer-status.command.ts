export class ChangeCustomerStatusCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly status: string) {}
}
