import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { Worker as BullWorker } from 'bullmq';
import type { IWorkerAdapter, IBullConnectionFactory } from '../interfaces';
import { BullWorkerAdapter, BullConnectionFactory } from '../bull';
import { QueueConfigurationFactory } from '../config';
import type { WorkerOptions } from '../types';
import { WorkerErrorException, ConfigurationErrorException } from '../exceptions';

@Injectable()
export class WorkerManagerService implements OnApplicationShutdown {
  private readonly workers: Map<string, IWorkerAdapter> = new Map();
  private readonly logger = new Logger(WorkerManagerService.name);

  constructor(
    private readonly configFactory: QueueConfigurationFactory,
    private readonly connectionFactory: BullConnectionFactory,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.stopAll();
  }

  createWorker(
    queueName: string,
    processor: (job: unknown) => Promise<unknown>,
    options?: WorkerOptions,
  ): IWorkerAdapter {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName) as IWorkerAdapter;
    }

    const connection = this.connectionFactory.getClient();
    if (!connection) {
      throw new ConfigurationErrorException(
        'BullMQ Redis connection not available. Initialize connection first.',
      );
    }

    const config = this.configFactory.getConfiguration();
    const concurrency = options?.concurrency ?? config.defaultConcurrency;

    const bullWorker = new BullWorker(queueName, processor, {
      connection,
      concurrency,
      prefix: options?.prefix ?? config.prefix,
      autorun: options?.autorun ?? true,
      lockDuration: options?.lockDuration,
      lockRenewTime: options?.lockRenewTime,
      stalledInterval: options?.stalledInterval,
      maxStalledCount: options?.maxStalledCount,
      drainDelay: options?.drainDelay,
    });

    const adapter = new BullWorkerAdapter(bullWorker, queueName, this.logger);
    this.workers.set(queueName, adapter);

    bullWorker.on('error', (error: Error) => {
      this.logger.error({
        message: `Worker error [${queueName}]: ${error.message}`,
        context: 'WorkerManagerService',
        data: { queue: queueName, error: error.message },
      });
    });

    bullWorker.on('failed', (job, error) => {
      this.logger.error({
        message: `Job failed [${queueName}]: ${error.message}`,
        context: 'WorkerManagerService',
        data: { queue: queueName, jobId: job?.id, error: error.message },
      });
    });

    bullWorker.on('completed', (job) => {
      this.logger.debug({
        message: `Job completed [${queueName}]: ${job?.id}`,
        context: 'WorkerManagerService',
        data: { queue: queueName, jobId: job?.id },
      });
    });

    this.logger.log({
      message: `Worker created for queue: ${queueName}`,
      context: 'WorkerManagerService',
      data: { queue: queueName, concurrency },
    });

    return adapter;
  }

  getWorker(queueName: string): IWorkerAdapter | null {
    return this.workers.get(queueName) ?? null;
  }

  getWorkers(): Map<string, IWorkerAdapter> {
    return new Map(this.workers);
  }

  async pauseWorker(queueName: string): Promise<void> {
    const worker = this.workers.get(queueName);
    if (!worker) {
      throw new WorkerErrorException(`Worker not found: ${queueName}`, { queueName });
    }
    await worker.pause();
  }

  async resumeWorker(queueName: string): Promise<void> {
    const worker = this.workers.get(queueName);
    if (!worker) {
      throw new WorkerErrorException(`Worker not found: ${queueName}`, { queueName });
    }
    await worker.resume();
  }

  async stopWorker(queueName: string): Promise<void> {
    const worker = this.workers.get(queueName);
    if (!worker) return;

    await worker.close();
    this.workers.delete(queueName);

    this.logger.log({
      message: `Worker stopped: ${queueName}`,
      context: 'WorkerManagerService',
    });
  }

  async stopAll(): Promise<void[]> {
    const promises: Promise<void>[] = [];
    for (const [name] of this.workers) {
      promises.push(this.stopWorker(name));
    }
    return Promise.all(promises);
  }

  getActiveWorkers(): string[] {
    return Array.from(this.workers.keys());
  }
}
