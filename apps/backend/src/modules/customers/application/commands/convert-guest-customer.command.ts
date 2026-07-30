export class ConvertGuestCustomerCommand {
  constructor(public readonly tenantId: string, public readonly email: string, public readonly userId: string) {}
}
