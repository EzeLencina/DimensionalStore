import { Worker as BullWorker } from 'bullmq';
import type { Logger } from '@nestjs/common';
import type { IWorkerAdapter } from '../interfaces';

export class BullWorkerAdapter implements IWorkerAdapter {
  readonly queueName: string;
  readonly concurrency: number;
  readonly running: boolean;
  readonly paused: boolean;

  private readonly worker: BullWorker;
  private readonly logger: Logger;
  private processed = 0;
  private failed = 0;

  constructor(worker: BullWorker, queueName: string, logger: Logger) {
    this.worker = worker;
    this.queueName = queueName;
    this.concurrency = worker.opts?.concurrency ?? 1;
    this.running = true;
    this.paused = false;
    this.logger = logger;

    this.worker.on('completed', () => {
      this.processed++;
    });

    this.worker.on('failed', () => {
      this.failed++;
    });

    this.worker.on('error', (error: Error) => {
      this.logger.error({
        message: `Worker error [${queueName}]: ${error.message}`,
        context: 'BullWorkerAdapter',
        data: { error: error.message },
      });
    });
  }

  async pause(): Promise<void> {
    await this.worker.pause();
  }

  async resume(): Promise<void> {
    await this.worker.resume();
  }

  async close(): Promise<void> {
    await this.worker.close();
  }

  async isPaused(): Promise<boolean> {
    return this.worker.isPaused();
  }

  async getMetrics(): Promise<{ processed: number; failed: number }> {
    return { processed: this.processed, failed: this.failed };
  }
}
