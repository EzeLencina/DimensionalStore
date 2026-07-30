export class GetOrCreateCustomerCartCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly currency?: string) {}
}
