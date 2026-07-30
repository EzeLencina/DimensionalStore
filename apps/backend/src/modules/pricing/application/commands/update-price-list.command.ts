export class UpdatePriceListCommand {
  constructor(
    public readonly name?: string,
    public readonly currency?: string,
    public readonly type?: string,
    public readonly priority?: number,
    public readonly channel?: string | null,
    public readonly customerGroup?: string | null,
    public readonly startsAt?: Date | null,
    public readonly endsAt?: Date | null,
  ) {}
}
