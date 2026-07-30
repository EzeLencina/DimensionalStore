import type { IRetryStrategy } from '../interfaces';
import type { RetryOptions, BackoffStrategyConfig, ExponentialBackoffConfig, FixedBackoffConfig } from '../types';
import { QUEUE_DEFAULTS } from '../constants/queue-defaults';

export class ExponentialBackoffStrategy implements IRetryStrategy {
  private readonly config: {
    readonly type: 'exponential';
    readonly delay: number;
    readonly maxDelay: number;
    readonly factor: number;
  };

  constructor(config: Partial<ExponentialBackoffConfig> = {}) {
    const delay = config.delay ?? QUEUE_DEFAULTS.DEFAULT_BACKOFF_DELAY;
    const maxDelay = config.maxDelay ?? 30_000;
    const factor = config.factor ?? 2;
    this.config = {
      type: 'exponential',
      delay,
      maxDelay,
      factor,
    };
  }

  getOptions(): RetryOptions {
    return {
      attempts: QUEUE_DEFAULTS.DEFAULT_ATTEMPTS,
      backoff: { type: 'exponential', delay: this.config.delay },
    };
  }

  getBackoff(): BackoffStrategyConfig {
    return { type: 'exponential', delay: this.config.delay };
  }

  shouldRetry(attemptsMade: number, _error: Error): boolean {
    return attemptsMade < QUEUE_DEFAULTS.DEFAULT_ATTEMPTS;
  }

  calculateDelay(attemptsMade: number): number {
    const delay = this.config.delay * Math.pow(this.config.factor, attemptsMade - 1);
    return Math.min(delay, this.config.maxDelay);
  }
}

export class FixedBackoffStrategy implements IRetryStrategy {
  private readonly config: FixedBackoffConfig;

  constructor(config: Partial<FixedBackoffConfig> = {}) {
    this.config = {
      type: 'fixed',
      delay: config.delay ?? QUEUE_DEFAULTS.DEFAULT_BACKOFF_DELAY,
    };
  }

  getOptions(): RetryOptions {
    return {
      attempts: QUEUE_DEFAULTS.DEFAULT_ATTEMPTS,
      backoff: { type: 'fixed', delay: this.config.delay },
    };
  }

  getBackoff(): BackoffStrategyConfig {
    return { type: 'fixed', delay: this.config.delay };
  }

  shouldRetry(attemptsMade: number, _error: Error): boolean {
    return attemptsMade < QUEUE_DEFAULTS.DEFAULT_ATTEMPTS;
  }

  calculateDelay(_attemptsMade: number): number {
    return this.config.delay;
  }
}

export class CustomRetryStrategy implements IRetryStrategy {
  constructor(
    private readonly config: RetryOptions & { maxRetries?: number },
  ) {}

  getOptions(): RetryOptions {
    return {
      attempts: this.config.attempts,
      backoff: this.config.backoff,
    };
  }

  getBackoff(): BackoffStrategyConfig {
    return this.config.backoff;
  }

  shouldRetry(attemptsMade: number, _error: Error): boolean {
    return attemptsMade < this.config.attempts;
  }

  calculateDelay(attemptsMade: number): number {
    if (this.config.backoff.type === 'exponential') {
      return this.config.backoff.delay * Math.pow(2, attemptsMade - 1);
    }
    return this.config.backoff.delay;
  }
}

export function createRetryStrategy(
  config?: Partial<RetryOptions>,
): IRetryStrategy {
  if (!config) return new ExponentialBackoffStrategy();

  const delay = config.backoff?.delay ?? QUEUE_DEFAULTS.DEFAULT_BACKOFF_DELAY;
  if (config.backoff?.type === 'fixed') {
    return new FixedBackoffStrategy({ delay });
  }

  return new ExponentialBackoffStrategy({ delay });
}
