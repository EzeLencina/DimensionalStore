export class RemoveOrderNoteCommand {
  constructor(public readonly tenantId: string, public readonly orderId: string, public readonly noteId: string) {}
}
