export class CreatePriceListCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly currency?: string,
    public readonly type?: string,
    public readonly priority?: number,
    public readonly channel?: string | null,
    public readonly customerGroup?: string | null,
    public readonly startsAt?: Date | null,
    public readonly endsAt?: Date | null,
    public readonly isDefault?: boolean,
  ) {}
}
