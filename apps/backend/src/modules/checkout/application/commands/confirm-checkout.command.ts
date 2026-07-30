export class ConfirmCheckoutCommand {
  constructor(public readonly tenantId: string, public readonly idempotencyKey: string) {}
}
