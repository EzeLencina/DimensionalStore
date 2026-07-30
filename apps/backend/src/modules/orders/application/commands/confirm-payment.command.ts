export class ConfirmPaymentCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string, public readonly idempotencyKey?: string) {}
}
