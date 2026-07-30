import type { JobOptions, JobCounts } from '../types';
import type { IJobAdapter } from './job-adapter.interface';

export interface IQueueAdapter {
  readonly name: string;

  add<T>(jobName: string, data: T, opts?: Partial<JobOptions>): Promise<IJobAdapter>;

  addBulk<T>(
    jobs: { name: string; data: T; opts?: Partial<JobOptions> }[],
  ): Promise<IJobAdapter[]>;

  getJob(jobId: string): Promise<IJobAdapter | null>;

  getJobCounts(): Promise<JobCounts>;

  getWaiting(): Promise<IJobAdapter[]>;

  getActive(): Promise<IJobAdapter[]>;

  getCompleted(): Promise<IJobAdapter[]>;

  getFailed(): Promise<IJobAdapter[]>;

  getDelayed(): Promise<IJobAdapter[]>;

  pause(): Promise<void>;

  resume(): Promise<void>;

  isPaused(): Promise<boolean>;

  close(): Promise<void>;

  obliterate(opts?: { force?: boolean }): Promise<void>;

  drain(delayed?: boolean): Promise<void>;
}
