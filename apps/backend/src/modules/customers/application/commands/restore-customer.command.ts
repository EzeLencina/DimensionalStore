export class RestoreCustomerCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string) {}
}
