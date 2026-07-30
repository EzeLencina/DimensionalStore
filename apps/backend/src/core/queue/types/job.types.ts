import type { JobOptions } from './queue.types';

export interface JobData<T = unknown> {
  readonly id?: string;
  readonly name: string;
  readonly data: T;
  readonly opts?: JobOptions;
  readonly timestamp?: Date;
  readonly processedBy?: string;
}

export interface JobResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly duration?: number;
  readonly attempts?: number;
  readonly timestamp?: Date;
}

export type JobType = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';

export interface JobStatus {
  readonly id: string;
  readonly name: string;
  readonly data: unknown;
  readonly opts: JobOptions;
  readonly progress: number | Record<string, unknown>;
  readonly attemptsMade: number;
  readonly failedReason?: string;
  readonly stacktrace?: string[];
  readonly returnvalue?: unknown;
  readonly finishedOn?: number;
  readonly processedOn?: number;
  readonly timestamp: number;
  readonly delay: number;
}
