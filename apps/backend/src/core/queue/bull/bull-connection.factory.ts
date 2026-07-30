import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import type { ConnectionHealth } from '../types';
import type { IBullConnectionFactory } from '../interfaces';
import { QueueConfigurationFactory } from '../config';
import { QueueUnavailableException } from '../exceptions';

@Injectable()
export class BullConnectionFactory implements IBullConnectionFactory, OnApplicationShutdown {
  private client: Redis | null = null;
  private readonly logger = new Logger(BullConnectionFactory.name);

  constructor(
    private readonly configFactory: QueueConfigurationFactory,
  ) {}

  async create(): Promise<Redis> {
    if (this.client) return this.client;

    const config = this.configFactory.getConfiguration();

    this.client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 10) {
          this.logger.error('BullMQ Redis max retries exceeded');
          return null;
        }
        return Math.min(times * 200, 5000);
      },
      lazyConnect: true,
    });

    try {
      await this.client.connect();
      this.logger.log({ message: 'BullMQ Redis connected', context: 'BullConnectionFactory' });
    } catch (error) {
      this.client = null;
      throw new QueueUnavailableException(
        'Failed to connect BullMQ Redis',
        { error: (error as Error).message },
      );
    }

    this.client.on('error', (error) => {
      this.logger.error({
        message: `BullMQ Redis error: ${error.message}`,
        context: 'BullConnectionFactory',
        data: { error: error.message },
      });
    });

    this.client.on('close', () => {
      this.logger.warn({
        message: 'BullMQ Redis connection closed',
        context: 'BullConnectionFactory',
      });
    });

    this.client.on('reconnecting', () => {
      this.logger.warn({
        message: 'BullMQ Redis reconnecting',
        context: 'BullConnectionFactory',
      });
    });

    return this.client;
  }

  getClient(): Redis | null {
    return this.client;
  }

  isConnected(): boolean {
    return this.client?.status === 'ready';
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.logger.log({ message: 'BullMQ Redis connection closed', context: 'BullConnectionFactory' });
    }
  }

  async health(): Promise<ConnectionHealth> {
    if (!this.client || this.client.status !== 'ready') {
      return { connected: false, latency: -1 };
    }

    try {
      const start = Date.now();
      await this.client.ping();
      const latency = Date.now() - start;
      return { connected: true, latency };
    } catch (error) {
      return { connected: false, latency: -1, error: (error as Error).message };
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }
}
