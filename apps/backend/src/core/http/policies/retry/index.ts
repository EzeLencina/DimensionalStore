import { Injectable, Logger } from '@nestjs/common';
import type { RetryPolicyConfig } from '../../types';
import { HTTP_DEFAULTS } from '../../constants/http-defaults';
import { HttpRetryExceededException } from '../../exceptions';

export interface RetryPolicy {
  canRetry(attempt: number, error: Error): boolean;
  getDelay(attempt: number): number;
  getConfig(): RetryPolicyConfig;
}

@Injectable()
export class DefaultRetryPolicy implements RetryPolicy {
  private readonly logger = new Logger(DefaultRetryPolicy.name);
  private readonly config: RetryPolicyConfig;

  constructor() {
    this.config = {
      maxRetries: HTTP_DEFAULTS.MAX_RETRIES,
      baseDelay: HTTP_DEFAULTS.RETRY_DELAY,
      maxDelay: HTTP_DEFAULTS.RETRY_DELAY * 10,
      strategy: HTTP_DEFAULTS.RETRY_STRATEGY as RetryPolicyConfig['strategy'],
    };
  }

  canRetry(attempt: number, _error: Error): boolean {
    return attempt < this.config.maxRetries;
  }

  getDelay(attempt: number): number {
    switch (this.config.strategy) {
      case 'exponential':
        return this.exponentialDelay(attempt);
      case 'linear':
        return this.linearDelay(attempt);
      case 'jitter':
        return this.jitterDelay(attempt);
      default:
        return this.exponentialDelay(attempt);
    }
  }

  private exponentialDelay(attempt: number): number {
    const delay = this.config.baseDelay * Math.pow(2, attempt);
    return Math.min(delay, this.config.maxDelay);
  }

  private linearDelay(attempt: number): number {
    return Math.min(
      this.config.baseDelay * (attempt + 1),
      this.config.maxDelay,
    );
  }

  private jitterDelay(attempt: number): number {
    const base = this.exponentialDelay(attempt);
    return base * (0.5 + Math.random() * 0.5);
  }

  getConfig(): RetryPolicyConfig {
    return { ...this.config };
  }
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  policy: RetryPolicy,
  logger: Logger,
  operationName = 'HTTP request',
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= policy.getConfig().maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === policy.getConfig().maxRetries) {
        break;
      }

      if (!policy.canRetry(attempt, error as Error)) {
        break;
      }

      const delay = policy.getDelay(attempt);
      logger.warn({
        message: `${operationName} failed, retrying (${attempt + 1}/${policy.getConfig().maxRetries})`,
        context: 'RetryPolicy',
        data: { attempt, delay, error: (error as Error).message },
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new HttpRetryExceededException(
    `${operationName} failed after ${policy.getConfig().maxRetries + 1} attempts`,
    { lastError: lastError?.message },
  );
}
