export class FailPaymentCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string, public readonly reason?: string) {}
}
