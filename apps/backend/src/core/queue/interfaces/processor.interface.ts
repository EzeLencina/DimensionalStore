import type { IJobAdapter } from './job-adapter.interface';

export interface IProcessor<T = unknown, R = unknown> {
  readonly name: string;
  process(job: IJobAdapter<T>): Promise<R>;
}
