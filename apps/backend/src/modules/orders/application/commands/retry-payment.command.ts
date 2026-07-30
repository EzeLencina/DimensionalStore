export class RetryPaymentCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string) {}
}
