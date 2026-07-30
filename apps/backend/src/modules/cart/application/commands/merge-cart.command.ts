export class MergeCartCommand {
  constructor(public readonly tenantId: string, public readonly sourceGuestTokenHash: string) {}
}
