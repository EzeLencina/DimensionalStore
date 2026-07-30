import type { JobOptions } from '../types';

export abstract class AbstractJob<T = unknown> {
  abstract readonly name: string;
  abstract readonly queueName: string;
  abstract readonly options: Partial<JobOptions>;

  abstract execute(data: T): Promise<unknown>;

  getJobName(): string {
    return this.name;
  }

  getQueueName(): string {
    return this.queueName;
  }

  getOptions(): Partial<JobOptions> {
    return { ...this.options };
  }
}
