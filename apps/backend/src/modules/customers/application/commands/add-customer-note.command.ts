export class AddCustomerNoteCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly content: string, public readonly createdBy: string) {}
}
