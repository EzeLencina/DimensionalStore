export class MarkReadyCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string) {}
}
