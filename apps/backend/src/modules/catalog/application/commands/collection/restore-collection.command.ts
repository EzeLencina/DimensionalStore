export class RestoreCollectionCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
