export class CancelOrderCommand {
  constructor(
    public readonly tenantId: string,
    public readonly orderId: string,
    public readonly reasonCode: string,
    public readonly reasonText?: string,
    public readonly idempotencyKey?: string,
  ) {}
}
