export class MarkShippedCommand {
  constructor(
    public readonly tenantId: string,
    public readonly orderId: string,
    public readonly carrierCode?: string,
    public readonly trackingNumber?: string,
    public readonly trackingUrl?: string,
  ) {}
}
