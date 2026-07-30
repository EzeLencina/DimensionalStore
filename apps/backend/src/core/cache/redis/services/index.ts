import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import type { SerializationFormat } from '../types';
import { REDIS_TOKENS } from '../constants';
import { RedisSerializer } from '../utils';
import {
  RedisConnectionException,
  RedisCommandException,
  RedisTimeoutException,
} from '../exceptions';
import type { IRedisService } from '../interfaces';

@Injectable()
export class RedisService implements IRedisService {
  private readonly serializer: RedisSerializer;
  private readonly logger: Logger;

  constructor(
    @Inject(REDIS_TOKENS.DEFAULT_CLIENT)
    private readonly client: Redis,
  ) {
    this.serializer = new RedisSerializer();
    this.logger = new Logger(RedisService.name);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (data === null) return null;
      return this.serializer.deserialize<T>(data, 'json');
    } catch (error) {
      throw this.wrapError(error, `GET ${key}`);
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = this.serializer.serialize(value, 'json');
      if (ttl !== undefined) {
        await this.client.setex(key, ttl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      throw this.wrapError(error, `SET ${key}`);
    }
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.set(key, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      throw this.wrapError(error, `DEL ${key}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      throw this.wrapError(error, `EXISTS ${key}`);
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, ttl);
      return result === 1;
    } catch (error) {
      throw this.wrapError(error, `EXPIRE ${key}`);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      throw this.wrapError(error, `TTL ${key}`);
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      throw this.wrapError(error, `KEYS ${pattern}`);
    }
  }

  async ping(): Promise<number> {
    const start = Date.now();
    try {
      await this.client.ping();
      return Date.now() - start;
    } catch (error) {
      throw this.wrapError(error, 'PING');
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const results = await this.client.mget(keys);
      return results.map((r) => (r ? this.serializer.deserialize<T>(r, 'json') : null));
    } catch (error) {
      throw this.wrapError(error, `MGET [${keys.length} keys]`);
    }
  }

  async mset<T>(entries: Record<string, T>): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      for (const [key, value] of Object.entries(entries)) {
        pipeline.set(key, this.serializer.serialize(value, 'json'));
      }
      await pipeline.exec();
    } catch (error) {
      throw this.wrapError(error, `MSET [${Object.keys(entries).length} keys]`);
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      throw this.wrapError(error, `INCR ${key}`);
    }
  }

  async incrBy(key: string, amount: number): Promise<number> {
    try {
      return await this.client.incrby(key, amount);
    } catch (error) {
      throw this.wrapError(error, `INCRBY ${key}`);
    }
  }

  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      throw this.wrapError(error, `DECR ${key}`);
    }
  }

  async decrBy(key: string, amount: number): Promise<number> {
    try {
      return await this.client.decrby(key, amount);
    } catch (error) {
      throw this.wrapError(error, `DECRBY ${key}`);
    }
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.sadd(key, ...members);
    } catch (error) {
      throw this.wrapError(error, `SADD ${key}`);
    }
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.srem(key, ...members);
    } catch (error) {
      throw this.wrapError(error, `SREM ${key}`);
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.smembers(key);
    } catch (error) {
      throw this.wrapError(error, `SMEMBERS ${key}`);
    }
  }

  async hset(key: string, field: string, value: unknown): Promise<number> {
    try {
      const serialized = this.serializer.serialize(value, 'json');
      return await this.client.hset(key, field, serialized);
    } catch (error) {
      throw this.wrapError(error, `HSET ${key}`);
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const data = await this.client.hget(key, field);
      if (data === null) return null;
      return this.serializer.deserialize<T>(data, 'json');
    } catch (error) {
      throw this.wrapError(error, `HGET ${key}`);
    }
  }

  async hgetall<T = Record<string, string>>(key: string): Promise<T> {
    try {
      const data = await this.client.hgetall(key);
      return data as unknown as T;
    } catch (error) {
      throw this.wrapError(error, `HGETALL ${key}`);
    }
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.client.hdel(key, ...fields);
    } catch (error) {
      throw this.wrapError(error, `HDEL ${key}`);
    }
  }

  pipeline(): any {
    return this.client.pipeline();
  }

  multi(): any {
    return this.client.multi();
  }

  async flushDb(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      throw this.wrapError(error, 'FLUSHDB');
    }
  }

  getClient(): Redis {
    return this.client;
  }

  private wrapError(error: unknown, operation: string): never {
    if (error instanceof RedisConnectionException) throw error;
    if (error instanceof RedisTimeoutException) throw error;
    if (error instanceof RedisCommandException) throw error;

    const err = error as Error;
    if (err.message?.includes('ECONNREFUSED')) {
      throw new RedisConnectionException(`Connection refused during ${operation}`, {
        operation,
        error: err.message,
      });
    }
    if (err.message?.includes('ETIMEOUT') || err.message?.includes('timeout')) {
      throw new RedisTimeoutException(`Timeout during ${operation}`, {
        operation,
        error: err.message,
      });
    }
    throw new RedisCommandException(`Command failed ${operation}: ${err.message}`, {
      operation,
      error: err.message,
    });
  }
}
