export class SchedulePromotionCommand {
  constructor(
    public readonly tenantId: string,
    public readonly promotionalAmount: number,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
  ) {}
}
