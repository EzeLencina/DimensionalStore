export interface WorkerOptions {
  concurrency?: number;
  limiter?: { max: number; duration: number };
  prefix?: string;
  autorun?: boolean;
  lockDuration?: number;
  lockRenewTime?: number;
  stalledInterval?: number;
  maxStalledCount?: number;
  drainDelay?: number;
}

export interface WorkerDefinition {
  readonly queueName: string;
  readonly processor: string;
  readonly options?: WorkerOptions;
}

export interface WorkerMetrics {
  readonly queueName: string;
  readonly active: boolean;
  readonly concurrency: number;
  readonly processed: number;
  readonly failed: number;
  readonly completed: number;
}
