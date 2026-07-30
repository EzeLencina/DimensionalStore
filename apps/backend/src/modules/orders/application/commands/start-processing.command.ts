export class StartProcessingCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string) {}
}
