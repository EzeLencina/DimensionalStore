export class RecalculateCustomerMetricsCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string) {}
}
