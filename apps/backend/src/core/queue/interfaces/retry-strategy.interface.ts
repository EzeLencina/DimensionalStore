import type { RetryOptions, BackoffStrategyConfig } from '../types';

export interface IRetryStrategy {
  getOptions(): RetryOptions;
  getBackoff(): BackoffStrategyConfig;
  shouldRetry(attemptsMade: number, error: Error): boolean;
  calculateDelay(attemptsMade: number): number;
}
