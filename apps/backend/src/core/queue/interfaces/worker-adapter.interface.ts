export interface IWorkerAdapter {
  readonly queueName: string;
  readonly concurrency: number;
  readonly running: boolean;
  readonly paused: boolean;

  pause(): Promise<void>;
  resume(): Promise<void>;
  close(): Promise<void>;
  isPaused(): Promise<boolean>;
  getMetrics(): Promise<{ processed: number; failed: number }>;
}
