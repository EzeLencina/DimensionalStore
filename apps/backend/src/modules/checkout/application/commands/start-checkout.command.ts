export class StartCheckoutCommand {
  constructor(public readonly tenantId: string, public readonly cartId: string) {}
}
