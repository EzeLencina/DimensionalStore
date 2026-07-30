import type { OnApplicationShutdown } from '@nestjs/common';
import type { IWorkerAdapter, IJobAdapter } from '../interfaces';
import type { WorkerOptions } from '../types';
import { WorkerManagerService } from '../services/worker-manager.service';

export abstract class BaseWorker implements OnApplicationShutdown {
  abstract readonly queueName: string;
  abstract readonly concurrency: number;

  protected worker: IWorkerAdapter | null = null;

  constructor(
    protected readonly workerManager: WorkerManagerService,
  ) {}

  abstract process(job: IJobAdapter): Promise<unknown>;

  async start(options?: Partial<WorkerOptions>): Promise<IWorkerAdapter> {
    this.worker = this.workerManager.createWorker(
      this.queueName,
      (bullJob: unknown) => this.process(bullJob as IJobAdapter),
      {
        concurrency: this.concurrency,
        ...options,
      },
    );
    return this.worker;
  }

  async stop(): Promise<void> {
    if (this.worker) {
      await this.workerManager.stopWorker(this.queueName);
      this.worker = null;
    }
  }

  async pause(): Promise<void> {
    if (this.worker) {
      await this.worker.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.worker) {
      await this.worker.resume();
    }
  }

  isRunning(): boolean {
    return this.worker?.running ?? false;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.stop();
  }
}
