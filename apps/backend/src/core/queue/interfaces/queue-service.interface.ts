import type { IJobAdapter } from './job-adapter.interface';
import type { JobOptions, JobCounts } from '../types';

export interface IQueueService {
  add<T>(queueName: string, jobName: string, data: T, opts?: Partial<JobOptions>): Promise<IJobAdapter>;

  addBulk<T>(
    queueName: string,
    jobs: { name: string; data: T; opts?: Partial<JobOptions> }[],
  ): Promise<IJobAdapter[]>;

  getJob(queueName: string, jobId: string): Promise<IJobAdapter | null>;

  getJobCounts(queueName: string): Promise<JobCounts>;

  pauseQueue(queueName: string): Promise<void>;

  resumeQueue(queueName: string): Promise<void>;

  isQueuePaused(queueName: string): Promise<boolean>;

  removeQueue(queueName: string): Promise<void>;

  drainQueue(queueName: string, delayed?: boolean): Promise<void>;
}
