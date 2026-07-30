import { Injectable } from '@nestjs/common';
import { queueConfig } from '@tienda/config';
import { QUEUE_DEFAULTS } from '../constants/queue-defaults';
import { ConfigurationErrorException } from '../exceptions/configuration-error.exception';
import type { QueueOptions } from '../types';

export interface QueueConfiguration {
  readonly redisUrl: string;
  readonly prefix: string;
  readonly defaultConcurrency: number;
  readonly defaultAttempts: number;
  readonly defaultBackoffDelay: number;
  readonly removeOnCompleteCount: number;
  readonly removeOnFailCount: number;
}

@Injectable()
export class QueueConfigurationFactory {
  private readonly config: QueueConfiguration;

  constructor() {
    const cfg = queueConfig();

    this.config = {
      redisUrl: cfg.redisUrl ?? this.resolveDefaultRedisUrl(),
      prefix: cfg.defaultPrefix ?? QUEUE_DEFAULTS.PREFIX,
      defaultConcurrency: QUEUE_DEFAULTS.DEFAULT_CONCURRENCY,
      defaultAttempts: QUEUE_DEFAULTS.DEFAULT_ATTEMPTS,
      defaultBackoffDelay: QUEUE_DEFAULTS.DEFAULT_BACKOFF_DELAY,
      removeOnCompleteCount: QUEUE_DEFAULTS.REMOVE_ON_COMPLETE_COUNT,
      removeOnFailCount: QUEUE_DEFAULTS.REMOVE_ON_FAIL_COUNT,
    };
  }

  getConfiguration(): QueueConfiguration {
    return { ...this.config };
  }

  getQueueOptions(overrides?: Partial<QueueOptions>): QueueOptions {
    return {
      defaultJobOptions: {
        attempts: this.config.defaultAttempts,
        backoff: {
          type: 'exponential',
          delay: this.config.defaultBackoffDelay,
        },
        removeOnComplete: { count: this.config.removeOnCompleteCount } as const,
        removeOnFail: { count: this.config.removeOnFailCount } as const,
      },
      ...overrides,
    };
  }

  validate(): void {
    if (!this.config.redisUrl) {
      throw new ConfigurationErrorException('Queue Redis URL is not configured');
    }
  }

  private resolveDefaultRedisUrl(): string {
    return process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  }
}
