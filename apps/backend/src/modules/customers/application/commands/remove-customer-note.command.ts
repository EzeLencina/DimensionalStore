export class RemoveCustomerNoteCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly noteId: string) {}
}
