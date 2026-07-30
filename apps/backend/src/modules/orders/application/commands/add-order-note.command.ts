export class AddOrderNoteCommand {
  constructor(
    public readonly tenantId: string,
    public readonly orderId: string,
    public readonly content: string,
    public readonly visibility: string,
    public readonly createdBy: string,
  ) {}
}
