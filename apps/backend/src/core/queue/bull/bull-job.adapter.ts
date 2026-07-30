import type { Job } from 'bullmq';
import type { IJobAdapter } from '../interfaces';

export class BullJobAdapter<T = unknown> implements IJobAdapter<T> {
  readonly id: string;
  readonly name: string;
  readonly data: T;
  readonly attemptsMade: number;
  readonly failedReason?: string;
  readonly stacktrace?: string[];
  readonly returnvalue?: unknown;
  readonly timestamp: number;
  readonly processedOn?: number;
  readonly finishedOn?: number;
  readonly delay: number;

  constructor(private readonly job: Job<T>) {
    this.id = job.id ?? '';
    this.name = job.name;
    this.data = job.data as unknown as T;
    this.attemptsMade = job.attemptsMade;
    this.failedReason = job.failedReason;
    this.stacktrace = job.stacktrace ?? undefined;
    this.returnvalue = job.returnvalue;
    this.timestamp = job.timestamp;
    this.processedOn = job.processedOn ?? undefined;
    this.finishedOn = job.finishedOn ?? undefined;
    this.delay = job.delay;
  }

  async update(data: T): Promise<void> {
    await this.job.updateData(data as any);
  }

  async updateProgress(progress: number | Record<string, unknown>): Promise<void> {
    await this.job.updateProgress(progress);
  }

  async remove(): Promise<void> {
    await this.job.remove();
  }

  async retry(): Promise<void> {
    await this.job.retry();
  }

  async discard(): Promise<void> {
    await this.job.discard();
  }

  async isCompleted(): Promise<boolean> {
    return this.job.isCompleted();
  }

  async isFailed(): Promise<boolean> {
    return this.job.isFailed();
  }

  async isDelayed(): Promise<boolean> {
    return this.job.isDelayed();
  }

  async isWaiting(): Promise<boolean> {
    return this.job.isWaiting();
  }

  async isActive(): Promise<boolean> {
    return this.job.isActive();
  }
}
