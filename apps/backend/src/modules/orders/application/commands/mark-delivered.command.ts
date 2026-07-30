export class MarkDeliveredCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string) {}
}
