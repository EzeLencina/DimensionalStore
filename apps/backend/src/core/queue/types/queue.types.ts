export interface JobOptions {
  priority?: number;
  attempts?: number;
  delay?: number;
  backoff?: BackoffOptions;
  timeout?: number;
  removeOnComplete?: boolean | number | { count: number } | { age: number; count?: number };
  removeOnFail?: boolean | number | { count: number } | { age: number; count?: number };
  stackTraceLimit?: number;
}

export interface BackoffOptions {
  type: 'fixed' | 'exponential';
  delay: number;
}

export interface JobCounts {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export interface QueueDefinition {
  name: string;
  prefix?: string;
}

export interface QueueOptions {
  defaultJobOptions?: JobOptions;
  limiter?: RateLimiterOptions;
  streams?: {
    events?: { maxLen?: number };
    jobs?: { maxLen?: number };
  };
}

export interface RateLimiterOptions {
  max: number;
  duration: number;
}

export type QueueEvent =
  | 'active'
  | 'completed'
  | 'failed'
  | 'progress'
  | 'waiting'
  | 'delayed'
  | 'paused'
  | 'resumed'
  | 'cleaned'
  | 'drained'
  | 'removed'
  | 'error';

export interface QueueEventPayload {
  event: QueueEvent;
  queue: string;
  jobId?: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}
