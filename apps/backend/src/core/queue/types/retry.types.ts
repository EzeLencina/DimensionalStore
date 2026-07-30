export type BackoffStrategyType = 'fixed' | 'exponential';

export interface BackoffStrategyConfig {
  readonly type: BackoffStrategyType;
  readonly delay: number;
}

export interface RetryStrategyConfig {
  readonly maxAttempts: number;
  readonly backoff: BackoffStrategyConfig;
  readonly timeout?: number;
  readonly deadLetterQueue?: string;
}

export interface RetryOptions {
  readonly attempts: number;
  readonly backoff: BackoffStrategyConfig;
  readonly timeout?: number;
}

export interface ExponentialBackoffConfig {
  readonly type: 'exponential';
  readonly delay: number;
  readonly maxDelay?: number;
  readonly factor?: number;
}

export interface FixedBackoffConfig {
  readonly type: 'fixed';
  readonly delay: number;
}
