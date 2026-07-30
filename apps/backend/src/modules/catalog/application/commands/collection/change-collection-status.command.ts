export class ChangeCollectionStatusCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly status: string,
  ) {}
}
