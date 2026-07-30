import type { RedisNamespace, SerializationFormat } from '../types';
import { RedisSerializationException } from '../exceptions';
import { NAMESPACE_MAP, REDIS_NAMESPACE_SEPARATOR } from '../constants';

export class RedisNamespaceBuilder {
  private readonly prefix: string;

  constructor(prefix: string = 'tienda') {
    this.prefix = prefix;
  }

  build(
    namespace: RedisNamespace,
    ...keys: string[]
  ): string {
    const ns = NAMESPACE_MAP[namespace] ?? namespace;
    return [this.prefix, ns, ...keys].join(REDIS_NAMESPACE_SEPARATOR);
  }

  cacheKey(...keys: string[]): string {
    return this.build('cache', ...keys);
  }

  queueKey(...keys: string[]): string {
    return this.build('queue', ...keys);
  }

  sessionKey(...keys: string[]): string {
    return this.build('session', ...keys);
  }

  lockKey(...keys: string[]): string {
    return this.build('lock', ...keys);
  }

  configKey(...keys: string[]): string {
    return this.build('config', ...keys);
  }

  rateLimitKey(...keys: string[]): string {
    return this.build('rate-limit', ...keys);
  }

  pubSubKey(...keys: string[]): string {
    return this.build('pubsub', ...keys);
  }

  appKey(...keys: string[]): string {
    return this.build('app', ...keys);
  }
}

export class RedisSerializer {
  serialize<T>(value: T, format: SerializationFormat = 'json'): string | Buffer {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(value);
        case 'string':
          return String(value);
        case 'buffer':
          return Buffer.from(String(value));
        case 'raw':
          return String(value);
        default:
          return JSON.stringify(value);
      }
    } catch (error) {
      throw new RedisSerializationException(
        `Failed to serialize value: ${(error as Error).message}`,
        { format, valueType: typeof value },
      );
    }
  }

  deserialize<T>(data: string | Buffer | null, format: SerializationFormat = 'json'): T | null {
    if (data === null || data === undefined) return null;

    try {
      const str = Buffer.isBuffer(data) ? data.toString() : data;

      switch (format) {
        case 'json':
          return JSON.parse(str) as T;
        case 'string':
          return str as unknown as T;
        case 'buffer':
          return Buffer.from(str) as unknown as T;
        case 'raw':
          return str as unknown as T;
        default:
          return JSON.parse(str) as T;
      }
    } catch (error) {
      throw new RedisSerializationException(
        `Failed to deserialize value: ${(error as Error).message}`,
        { format },
      );
    }
  }
}

export function calculateTtl(
  strategy: { type: 'ttl' | 'sliding' | 'absolute' | 'none'; ttl?: number; maxTtl?: number; expireAt?: Date },
): number | undefined {
  switch (strategy.type) {
    case 'ttl':
      return strategy.ttl;
    case 'sliding':
      return strategy.ttl;
    case 'absolute': {
      if (!strategy.expireAt) return undefined;
      const remaining = Math.max(0, Math.floor((strategy.expireAt.getTime() - Date.now()) / 1000));
      return remaining > 0 ? remaining : 1;
    }
    case 'none':
      return undefined;
  }
}

export function isRedisError(error: unknown): error is Error & { code?: string; errno?: number } {
  return error instanceof Error && 'code' in error;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
