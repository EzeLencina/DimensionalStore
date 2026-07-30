import { Queue as BullQueue } from 'bullmq';
import type { Logger } from '@nestjs/common';
import type { IQueueAdapter, IJobAdapter } from '../interfaces';
import type { JobOptions, JobCounts } from '../types';
import { BullJobAdapter } from './bull-job.adapter';

export class BullQueueAdapter implements IQueueAdapter {
  readonly name: string;
  private readonly queue: BullQueue;
  private readonly logger: Logger;

  constructor(name: string, queue: BullQueue, logger: Logger) {
    this.name = name;
    this.queue = queue;
    this.logger = logger;
  }

  async add<T>(jobName: string, data: T, opts?: Partial<JobOptions>): Promise<IJobAdapter> {
    const job = await this.queue.add(jobName, data as unknown, opts as Record<string, unknown>);
    return new BullJobAdapter(job);
  }

  async addBulk<T>(
    jobs: { name: string; data: T; opts?: Partial<JobOptions> }[],
  ): Promise<IJobAdapter[]> {
    const bullJobs = await this.queue.addBulk(
      jobs.map((j) => ({
        name: j.name,
        data: j.data as unknown,
        opts: j.opts as Record<string, unknown>,
      })),
    );
    return bullJobs.map((j) => new BullJobAdapter(j));
  }

  async getJob(jobId: string): Promise<IJobAdapter | null> {
    const job = await this.queue.getJob(jobId);
    return job ? new BullJobAdapter(job) : null;
  }

  async getJobCounts(): Promise<JobCounts> {
    const counts = await this.queue.getJobCounts();
    return {
      waiting: (counts['waiting'] as number) ?? 0,
      active: (counts['active'] as number) ?? 0,
      completed: (counts['completed'] as number) ?? 0,
      failed: (counts['failed'] as number) ?? 0,
      delayed: (counts['delayed'] as number) ?? 0,
      paused: (counts['paused'] as number) ?? 0,
    };
  }

  async getWaiting(): Promise<IJobAdapter[]> {
    const jobs = await this.queue.getWaiting();
    return jobs.map((j) => new BullJobAdapter(j));
  }

  async getActive(): Promise<IJobAdapter[]> {
    const jobs = await this.queue.getActive();
    return jobs.map((j) => new BullJobAdapter(j));
  }

  async getCompleted(): Promise<IJobAdapter[]> {
    const jobs = await this.queue.getCompleted();
    return jobs.map((j) => new BullJobAdapter(j));
  }

  async getFailed(): Promise<IJobAdapter[]> {
    const jobs = await this.queue.getFailed();
    return jobs.map((j) => new BullJobAdapter(j));
  }

  async getDelayed(): Promise<IJobAdapter[]> {
    const jobs = await this.queue.getDelayed();
    return jobs.map((j) => new BullJobAdapter(j));
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    this.logger.debug({ message: `Queue paused: ${this.name}`, context: 'BullQueueAdapter' });
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    this.logger.debug({ message: `Queue resumed: ${this.name}`, context: 'BullQueueAdapter' });
  }

  async isPaused(): Promise<boolean> {
    return this.queue.isPaused();
  }

  async close(): Promise<void> {
    await this.queue.close();
    this.logger.debug({ message: `Queue closed: ${this.name}`, context: 'BullQueueAdapter' });
  }

  async obliterate(opts?: { force?: boolean }): Promise<void> {
    await this.queue.obliterate(opts);
    this.logger.debug({ message: `Queue obliterated: ${this.name}`, context: 'BullQueueAdapter' });
  }

  async drain(delayed?: boolean): Promise<void> {
    await this.queue.drain(delayed);
    this.logger.debug({ message: `Queue drained: ${this.name}`, context: 'BullQueueAdapter' });
  }
}
