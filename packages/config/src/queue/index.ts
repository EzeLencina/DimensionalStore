import { getEnv } from '../validation';

export interface QueueConfig {
  readonly redisUrl?: string;
  readonly defaultPrefix: string;
}

let cached: QueueConfig | null = null;

export function queueConfig(): QueueConfig {
  if (cached) return cached;

  const env = getEnv();
  cached = {
    redisUrl: env.QUEUE_REDIS_URL ?? env.REDIS_URL,
    defaultPrefix: 'queue:',
  };

  return cached;
}

export function resetQueueConfig(): void {
  cached = null;
}
