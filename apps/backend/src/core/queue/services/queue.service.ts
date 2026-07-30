import { Injectable } from '@nestjs/common';
import type { IQueueService, IQueueManager, IJobAdapter } from '../interfaces';
import type { JobOptions, JobCounts } from '../types';
import { QueueManagerService } from './queue-manager.service';
import { QueueUnavailableException } from '../exceptions';

@Injectable()
export class QueueService implements IQueueService {
  constructor(
    private readonly manager: QueueManagerService,
  ) {}

  async add<T>(
    queueName: string,
    jobName: string,
    data: T,
    opts?: Partial<JobOptions>,
  ): Promise<IJobAdapter> {
    const queue = this.resolveQueue(queueName);
    return queue.add(jobName, data, opts);
  }

  async addBulk<T>(
    queueName: string,
    jobs: { name: string; data: T; opts?: Partial<JobOptions> }[],
  ): Promise<IJobAdapter[]> {
    const queue = this.resolveQueue(queueName);
    return queue.addBulk(jobs);
  }

  async getJob(queueName: string, jobId: string): Promise<IJobAdapter | null> {
    const queue = this.resolveQueue(queueName);
    return queue.getJob(jobId);
  }

  async getJobCounts(queueName: string): Promise<JobCounts> {
    const queue = this.resolveQueue(queueName);
    return queue.getJobCounts();
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.resolveQueue(queueName);
    await queue.pause();
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.resolveQueue(queueName);
    await queue.resume();
  }

  async isQueuePaused(queueName: string): Promise<boolean> {
    const queue = this.resolveQueue(queueName);
    return queue.isPaused();
  }

  async removeQueue(queueName: string): Promise<void> {
    await this.manager.removeQueue(queueName);
  }

  async drainQueue(queueName: string, delayed?: boolean): Promise<void> {
    const queue = this.resolveQueue(queueName);
    await queue.drain(delayed);
  }

  private resolveQueue(queueName: string) {
    const queue = this.manager.getQueue(queueName);
    if (!queue) {
      throw new QueueUnavailableException(
        `Queue not found: ${queueName}`,
        { queueName },
      );
    }
    return queue;
  }
}
