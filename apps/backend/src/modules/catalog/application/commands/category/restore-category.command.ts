export class RestoreCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
