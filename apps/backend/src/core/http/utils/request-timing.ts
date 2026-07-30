import type { RequestTiming, TimingEvent } from '../types';

export class RequestTimingCollector {
  private marks: Map<string, number> = new Map();
  private events: TimingEvent[] = [];
  private startTime = 0;

  start(): () => number {
    this.startTime = performance.now();
    return () => performance.now() - this.startTime;
  }

  mark(name: string): void {
    const now = performance.now();
    this.marks.set(name, now);

    if (this.events.length > 0) {
      const prev = this.events[this.events.length - 1];
      this.events.push({
        name,
        timestamp: now,
        duration: now - prev!.timestamp,
      });
    } else {
      this.events.push({
        name,
        timestamp: now,
        duration: now - this.startTime,
      });
    }
  }

  getTiming(): RequestTiming {
    const total = performance.now() - this.startTime;

    return {
      dns: this.getDuration('dns'),
      connect: this.getDuration('connect'),
      tls: this.getDuration('tls'),
      firstByte: this.getDuration('firstByte'),
      total,
    };
  }

  getEvents(): TimingEvent[] {
    return [...this.events];
  }

  reset(): void {
    this.marks.clear();
    this.events = [];
    this.startTime = 0;
  }

  private getDuration(markName: string): number {
    const mark = this.marks.get(markName);
    if (!mark) return 0;

    const prevMark = this.getPreviousMark(markName);
    return prevMark !== undefined ? mark - prevMark : mark;
  }

  private getPreviousMark(currentMark: string): number | undefined {
    const markNames = ['dns', 'connect', 'tls', 'firstByte'] as const;
    const currentIndex = markNames.indexOf(currentMark as typeof markNames[number]);
    if (currentIndex <= 0) return undefined;

    return this.marks.get(markNames[currentIndex - 1]!);
  }
}
