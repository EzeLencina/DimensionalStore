import { FactoryProvider, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import type { RedisConnectionOptions } from '../types';
import { REDIS_TOKENS } from '../constants';
import { RedisConfigurationFactory } from '../config';
import { RedisConnectionException, RedisConfigurationException } from '../exceptions';

export const redisClientProvider: FactoryProvider = {
  provide: REDIS_TOKENS.DEFAULT_CLIENT,
  useFactory: (configFactory: RedisConfigurationFactory, logger: Logger) => {
    const options = configFactory.getConnectionOptions();
    return createRedisClient(options, 'default', logger);
  },
  inject: [RedisConfigurationFactory, Logger],
};

export const redisSubscriberProvider: FactoryProvider = {
  provide: REDIS_TOKENS.SUBSCRIBER_CLIENT,
  useFactory: (configFactory: RedisConfigurationFactory, logger: Logger) => {
    const options = configFactory.getConnectionOptions();
    return createRedisClient(
      { ...options, db: options.db, keyPrefix: '' },
      'subscriber',
      logger,
    );
  },
  inject: [RedisConfigurationFactory, Logger],
};

function createRedisClient(
  options: RedisConnectionOptions,
  name: string,
  logger: Logger,
): Redis {
  validateOptions(options);

  const client = new Redis({
    host: options.host,
    port: options.port,
    password: options.password,
    db: options.db,
    keyPrefix: options.keyPrefix,
    connectTimeout: options.connectTimeout,
    tls: options.tls ? {} : undefined,
    family: options.family,
    keepAlive: options.keepAlive,
    enableOfflineQueue: options.enableOfflineQueue,
    lazyConnect: options.lazyConnect,
    maxRetriesPerRequest: null,
    enableAutoPipelining: false,
    retryStrategy: buildRetryStrategy(options, name, logger),
    reconnectOnError: (err) => {
      logger.warn(`Redis reconnect on error [${name}]: ${err.message}`);
      return true;
    },
  });

  attachEventListeners(client, name, logger);

  return client;
}

function validateOptions(options: RedisConnectionOptions): void {
  if (!options.host) {
    throw new RedisConfigurationException('Redis host is required');
  }
  if (!options.port || options.port < 1 || options.port > 65535) {
    throw new RedisConfigurationException('Redis port must be between 1 and 65535');
  }
}

function buildRetryStrategy(
  options: RedisConnectionOptions,
  name: string,
  logger: Logger,
): (attempt: number) => number | null | undefined {
  return (attempt: number) => {
    if (attempt > options.retryMaxAttempts) {
      logger.error(
        `Redis max retry attempts exceeded [${name}]: ${options.retryMaxAttempts}`,
      );
      return null;
    }

    const delay = Math.min(
      options.retryBaseDelay * Math.pow(2, attempt - 1),
      options.retryMaxDelay,
    );

    const jitter = delay * (1 - Math.random() * 0.25);
    const finalDelay = Math.round(jitter);

    logger.warn(
      `Redis reconnecting [${name}]: attempt=${attempt}/${options.retryMaxAttempts} delay=${finalDelay}ms`,
    );

    return finalDelay;
  };
}

function attachEventListeners(client: Redis, name: string, logger: Logger): void {
  client.on('connect', () => {
    logger.debug(`Redis connected [${name}]`);
  });

  client.on('ready', () => {
    logger.debug(`Redis ready [${name}]`);
  });

  client.on('error', (error: Error) => {
    logger.error({
      message: `Redis error [${name}]: ${error.message}`,
      context: 'RedisClient',
      data: { name, error: error.message },
    });
  });

  client.on('close', () => {
    logger.warn(`Redis connection closed [${name}]`);
  });

  client.on('reconnecting', (delay: number, attempt: number) => {
    logger.warn(
      `Redis reconnecting [${name}]: attempt=${attempt} delay=${delay}ms`,
    );
  });

  client.on('end', () => {
    logger.warn(`Redis connection ended [${name}]`);
  });
}
