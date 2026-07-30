export class UpdateCustomerMetricsFromOrderCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly orderTotal: number, public readonly orderCreatedAt: Date) {}
}
