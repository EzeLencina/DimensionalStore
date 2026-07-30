export class AssignCustomerTagCommand {
  constructor(public readonly tenantId: string, public readonly customerId: string, public readonly tagId: string, public readonly assignedBy: string) {}
}
