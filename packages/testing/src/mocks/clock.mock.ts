export class ClockMock {
  private currentTimestamp: number;
  private autoIncrement = 0;

  constructor(fixedDate?: Date) {
    this.currentTimestamp = fixedDate?.getTime() ?? Date.now();
  }

  now(): Date {
    return new Date(this.currentTimestamp);
  }

  nowISO(): string {
    return this.now().toISOString();
  }

  nowUnix(): number {
    return Math.floor(this.currentTimestamp / 1000);
  }

  advance(ms: number): void {
    this.currentTimestamp += ms;
  }

  advanceSeconds(seconds: number): void {
    this.advance(seconds * 1000);
  }

  advanceMinutes(minutes: number): void {
    this.advance(minutes * 60 * 1000);
  }

  advanceHours(hours: number): void {
    this.advance(hours * 60 * 60 * 1000);
  }

  advanceDays(days: number): void {
    this.advance(days * 24 * 60 * 60 * 1000);
  }

  setTime(date: Date): void {
    this.currentTimestamp = date.getTime();
  }

  setAutoIncrement(ms: number): void {
    this.autoIncrement = ms;
  }

  tick(): Date {
    if (this.autoIncrement > 0) {
      this.advance(this.autoIncrement);
    }
    return this.now();
  }

  reset(): void {
    this.currentTimestamp = Date.now();
    this.autoIncrement = 0;
  }
}
