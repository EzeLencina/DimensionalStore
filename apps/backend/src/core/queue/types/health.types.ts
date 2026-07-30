export interface QueueHealthStatus {
  readonly queue: string;
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly waiting: number;
  readonly active: number;
  readonly completed: number;
  readonly failed: number;
  readonly delayed: number;
  readonly paused: boolean;
  readonly workerActive: boolean;
  readonly error?: string;
}

export interface QueueHealthSummary {
  readonly overall: 'healthy' | 'degraded' | 'unhealthy';
  readonly redis: { connected: boolean; latency: number };
  readonly queues: QueueHealthStatus[];
  readonly timestamp: Date;
}

export interface WorkerHealthStatus {
  readonly queueName: string;
  readonly running: boolean;
  readonly concurrency: number;
  readonly processed: number;
  readonly failed: number;
  readonly active: boolean;
  readonly lastError?: string;
}

export interface ConnectionHealth {
  readonly connected: boolean;
  readonly latency: number;
  readonly error?: string;
}
