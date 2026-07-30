import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';
import { ISessionStore } from '../../domain/services/session-manager.service';
import { Session } from '../../domain/entities/session.entity';
import { SessionException, SESSION_ERROR_CODES } from '../../domain/exceptions';

const SESSION_PREFIX = 'session:';
const USER_SESSIONS_PREFIX = 'user_sessions:';
const SESSION_TTL = 7 * 24 * 60 * 60;

@Injectable()
export class RedisSessionRepository implements ISessionStore {
  constructor(
    @Inject(RedisService)
    private readonly redis: RedisService,
  ) {}

  async save(session: Session): Promise<void> {
    const sessionKey = `${SESSION_PREFIX}${session.getSessionId().getValue()}`;
    const userKey = `${USER_SESSIONS_PREFIX}${session.getUserId()}`;

    const metadata = session.toMetadata();

    await Promise.all([
      this.redis.setJson(sessionKey, metadata, SESSION_TTL),
      this.redis.sadd(userKey, session.getSessionId().getValue()),
      this.redis.expire(userKey, SESSION_TTL),
    ]);
  }

  async findById(sessionId: string): Promise<Session | null> {
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const metadata = await this.redis.get<Record<string, unknown>>(sessionKey);
    if (!metadata) return null;

    try {
      return Session.fromMetadata(this.normalizeMetadata(metadata));
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const userKey = `${USER_SESSIONS_PREFIX}${userId}`;
    const sessionIds = await this.redis.smembers(userKey);

    if (sessionIds.length === 0) return [];

    const keys = sessionIds.map(id => `${SESSION_PREFIX}${id}`);
    const results = await this.redis.mget<Record<string, unknown>>(keys);

    return results
      .filter((r): r is Record<string, unknown> => r !== null)
      .map(r => {
        try {
          return Session.fromMetadata(this.normalizeMetadata(r));
        } catch {
          return null;
        }
      })
      .filter((s): s is Session => s !== null);
  }

  async delete(sessionId: string): Promise<void> {
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const metadata = await this.redis.get<Record<string, unknown>>(sessionKey);
    if (metadata) {
      const userId = metadata['userId'] as string;
      const userKey = `${USER_SESSIONS_PREFIX}${userId}`;
      await Promise.all([
        this.redis.del(sessionKey),
        this.redis.srem(userKey, sessionId),
      ]);
    }
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const userKey = `${USER_SESSIONS_PREFIX}${userId}`;
    const sessionIds = await this.redis.smembers(userKey);

    if (sessionIds.length > 0) {
      const deletions = sessionIds.map(id => this.redis.del(`${SESSION_PREFIX}${id}`));
      deletions.push(this.redis.del(userKey));
      await Promise.all(deletions);
    }
  }

  async countByUserId(userId: string): Promise<number> {
    const userKey = `${USER_SESSIONS_PREFIX}${userId}`;
    const sessionIds = await this.redis.smembers(userKey);
    return sessionIds.length;
  }

  async updateActivity(sessionId: string): Promise<void> {
    const sessionKey = `${SESSION_PREFIX}${sessionId}`;
    const existing = await this.redis.get<Record<string, unknown>>(sessionKey);
    if (existing) {
      existing['lastActivity'] = new Date().toISOString();
      await this.redis.setJson(sessionKey, existing, SESSION_TTL);
    }
  }

  private normalizeMetadata(data: Record<string, unknown>): any {
    return {
      ...data,
      createdAt: new Date(data['createdAt'] as string),
      lastActivity: new Date(data['lastActivity'] as string),
      expiresAt: new Date(data['expiresAt'] as string),
      revokedAt: data['revokedAt'] ? new Date(data['revokedAt'] as string) : undefined,
      device: typeof data['device'] === 'object' && data['device'] !== null
        ? data['device']
        : { type: 'browser', isTrusted: false, isRemembered: false },
    };
  }
}
