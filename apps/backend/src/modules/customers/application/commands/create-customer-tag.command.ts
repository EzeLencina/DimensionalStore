export class CreateCustomerTagCommand {
  constructor(public readonly tenantId: string, public readonly name: string, public readonly slug: string, public readonly description?: string | null) {}
}
