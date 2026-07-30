import type { BackoffStrategyConfig } from '../types';

export function calculateBackoffDelay(
  backoff: BackoffStrategyConfig,
  attempt: number,
): number {
  if (backoff.type === 'exponential') {
    return Math.min(backoff.delay * Math.pow(2, attempt - 1), 30_000);
  }
  return backoff.delay;
}

export function createBullBackoff(
  config: BackoffStrategyConfig,
): { type: 'fixed' | 'exponential'; delay: number } {
  return {
    type: config.type,
    delay: config.delay,
  };
}

export function resolveBackoff(
  backoff?: BackoffStrategyConfig,
): { type: 'fixed' | 'exponential'; delay: number } | undefined {
  if (!backoff) return undefined;
  return createBullBackoff(backoff);
}
