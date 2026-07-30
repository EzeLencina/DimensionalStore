export class UpdateCustomerNoteCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly noteId: string, public readonly content: string) {}
}
