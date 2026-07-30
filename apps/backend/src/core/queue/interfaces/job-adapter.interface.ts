export interface IJobAdapter<T = unknown> {
  readonly id: string;
  readonly name: string;
  readonly data: T;
  readonly attemptsMade: number;
  readonly failedReason?: string;
  readonly stacktrace?: string[];
  readonly returnvalue?: unknown;
  readonly timestamp: number;
  readonly processedOn?: number;
  readonly finishedOn?: number;
  readonly delay: number;

  update(data: unknown): Promise<void>;
  updateProgress(progress: number | Record<string, unknown>): Promise<void>;
  remove(): Promise<void>;
  retry(): Promise<void>;
  discard(): Promise<void>;
  isCompleted(): Promise<boolean>;
  isFailed(): Promise<boolean>;
  isDelayed(): Promise<boolean>;
  isWaiting(): Promise<boolean>;
  isActive(): Promise<boolean>;
}
