import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';
import { IContextStore } from '../../domain/services/context-manager.service';
import { TenantContext } from '../../domain/types';

const CONTEXT_PREFIX = 'tenant_context:';
const CONTEXT_TTL = 300;

@Injectable()
export class RedisContextStore implements IContextStore {
  constructor(
    @Inject(RedisService) private readonly redis: RedisService,
  ) {}

  async save(context: TenantContext): Promise<void> {
    const key = `${CONTEXT_PREFIX}${context.user.id}:${context.tenant.id}`;
    await this.redis.setJson(key, context, CONTEXT_TTL);
  }

  async load(userId: string, tenantId: string): Promise<TenantContext | null> {
    const key = `${CONTEXT_PREFIX}${userId}:${tenantId}`;
    const data = await this.redis.get<Record<string, unknown>>(key);
    if (!data) return null;
    return this.normalize(data);
  }

  async delete(userId: string, tenantId: string): Promise<void> {
    const key = `${CONTEXT_PREFIX}${userId}:${tenantId}`;
    await this.redis.del(key);
  }

  private normalize(data: Record<string, unknown>): TenantContext {
    return {
      tenant: data['tenant'] as any,
      branch: data['branch'] as any,
      user: data['user'] as any,
      settings: data['settings'] as any,
      resolvedAt: new Date(data['resolvedAt'] as string),
    };
  }
}
