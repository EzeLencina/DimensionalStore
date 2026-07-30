import { Injectable } from '@nestjs/common';
import { redisConfig } from '@tienda/config';
import type { RedisConnectionOptions } from '../types';
import { RedisConfigurationException } from '../exceptions';

@Injectable()
export class RedisConfigurationFactory {
  private readonly options: RedisConnectionOptions;

  constructor() {
    const config = redisConfig();

    this.options = {
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db,
      tls: config.tls,
      keyPrefix: config.keyPrefix,
      connectTimeout: config.connectTimeout,
      retryMaxAttempts: config.retryMaxAttempts,
      retryBaseDelay: config.retryBaseDelay,
      retryMaxDelay: config.retryMaxDelay,
      keepAlive: config.keepAlive,
      family: config.family,
      enableOfflineQueue: config.enableOfflineQueue,
      lazyConnect: config.lazyConnect,
    };
  }

  getConnectionOptions(): RedisConnectionOptions {
    return { ...this.options };
  }

  getKeyPrefix(): string {
    return this.options.keyPrefix;
  }

  getHealthCheckInterval(): number {
    return 30_000;
  }

  getTlsOptions(): { tls: boolean } {
    return { tls: this.options.tls as boolean };
  }

  validate(): void {
    const { host, port } = this.options;
    if (!host) {
      throw new RedisConfigurationException('Redis host is not configured');
    }
    if (!port || port < 1 || port > 65535) {
      throw new RedisConfigurationException('Redis port is invalid');
    }
  }
}
