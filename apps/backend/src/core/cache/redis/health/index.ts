import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import type { RedisHealthStatus } from '../types';
import { REDIS_TOKENS, REDIS_HEALTH_CHECK_INTERVAL } from '../constants';
import { RedisUnavailableException } from '../exceptions';
import type { IRedisHealthIndicator } from '../interfaces';

@Injectable()
export class RedisHealthIndicator implements IRedisHealthIndicator {
  private status: RedisHealthStatus;
  private readonly logger: Logger;
  private connectionStartTime: number;

  constructor(
    @Inject(REDIS_TOKENS.DEFAULT_CLIENT)
    private readonly client: Redis,
  ) {
    this.logger = new Logger(RedisHealthIndicator.name);
    this.connectionStartTime = Date.now();
    this.status = this.createInitialStatus();

    this.attachListeners();
  }

  async isHealthy(): Promise<RedisHealthStatus> {
    try {
      const start = Date.now();
      await this.client.ping();
      const latency = Date.now() - start;

      this.status = {
        ...this.status,
        connected: true,
        ping: latency,
        latency,
        connectionError: null,
        uptime: Date.now() - this.connectionStartTime,
      };
    } catch (error) {
      this.status = {
        ...this.status,
        connected: false,
        ping: -1,
        latency: -1,
        connectionError: (error as Error).message,
      };
    }

    return { ...this.status };
  }

  getStatus(): RedisHealthStatus {
    return { ...this.status };
  }

  reset(): void {
    this.status = this.createInitialStatus();
    this.connectionStartTime = Date.now();
  }

  private createInitialStatus(): RedisHealthStatus {
    return {
      connected: false,
      ping: -1,
      latency: -1,
      reconnectAttempts: 0,
      lastReconnect: null,
      uptime: 0,
      activeCommands: 0,
      connectionError: null,
    };
  }

  private attachListeners(): void {
    this.client.on('connect', () => {
      this.status = { ...this.status, connected: true, connectionError: null };
    });

    this.client.on('close', () => {
      this.status = { ...this.status, connected: false };
    });

    this.client.on('reconnecting', (_delay: number, attempt: number) => {
      this.status = {
        ...this.status,
        reconnectAttempts: attempt,
        lastReconnect: new Date(),
      };
    });

    this.client.on('error', (error: Error) => {
      this.logger.error({
        message: `Redis health check error: ${error.message}`,
        context: 'RedisHealthIndicator',
      });
    });
  }
}
