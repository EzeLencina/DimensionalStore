import type { RedisConnectionOptions, RedisHealthStatus, SerializationFormat } from '../types';

export interface IRedisClient {
  getClient(): any;
  isConnected(): boolean;
  onEvent<K extends keyof import('../types').RedisEventMap>(
    event: K,
    listener: import('../types').RedisEventMap[K],
  ): void;
}

export interface IRedisService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  setJson<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttl: number): Promise<boolean>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  ping(): Promise<number>;
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  mset<T>(entries: Record<string, T>): Promise<void>;
  incr(key: string): Promise<number>;
  incrBy(key: string, amount: number): Promise<number>;
  decr(key: string): Promise<number>;
  decrBy(key: string, amount: number): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  hset(key: string, field: string, value: unknown): Promise<number>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hgetall<T = Record<string, string>>(key: string): Promise<T>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  pipeline(): any;
  multi(): any;
  flushDb(): Promise<void>;
  getClient(): any;
}

export interface IConnectionFactory {
  createConnection(options?: Partial<RedisConnectionOptions>): any;
  createSubscriberConnection(options?: Partial<RedisConnectionOptions>): any;
  validateOptions(options: RedisConnectionOptions): void;
}

export interface IRedisHealthIndicator {
  isHealthy(): Promise<RedisHealthStatus>;
  getStatus(): RedisHealthStatus;
  reset(): void;
}

export interface ISerializationAdapter {
  serialize<T>(value: T, format?: SerializationFormat): string | Buffer;
  deserialize<T>(data: string | Buffer | null, format?: SerializationFormat): T | null;
}

export interface IRedisConfigProvider {
  getConnectionOptions(): RedisConnectionOptions;
  getKeyPrefix(): string;
  getHealthCheckInterval(): number;
}
