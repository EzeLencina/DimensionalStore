export class CreateGuestCartCommand {
  constructor(public readonly tenantId: string, public readonly currency?: string) {}
}
