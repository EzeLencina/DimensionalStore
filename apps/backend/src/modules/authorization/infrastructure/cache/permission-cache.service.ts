import { Injectable } from '@nestjs/common';
import { Permission } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/role.entity';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable()
export class PermissionCacheService {
  private readonly userPermissionsCache: Map<string, CacheEntry<Permission[]>> = new Map();
  private readonly roleCache: Map<string, CacheEntry<Role>> = new Map();
  private readonly defaultTtlMs = 5 * 60 * 1000;

  setUserPermissions(userId: string, permissions: Permission[], ttlMs?: number): void {
    this.userPermissionsCache.set(userId, {
      data: permissions,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  getUserPermissions(userId: string): Permission[] | null {
    const entry = this.userPermissionsCache.get(userId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.userPermissionsCache.delete(userId);
      return null;
    }
    return entry.data;
  }

  setRole(roleId: string, role: Role, ttlMs?: number): void {
    this.roleCache.set(roleId, {
      data: role,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  getRole(roleId: string): Role | null {
    const entry = this.roleCache.get(roleId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.roleCache.delete(roleId);
      return null;
    }
    return entry.data;
  }

  invalidateUser(userId: string): void {
    this.userPermissionsCache.delete(userId);
  }

  invalidateRole(roleId: string): void {
    this.roleCache.delete(roleId);
  }

  invalidateAll(): void {
    this.userPermissionsCache.clear();
    this.roleCache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.userPermissionsCache) {
      if (now > entry.expiresAt) this.userPermissionsCache.delete(key);
    }
    for (const [key, entry] of this.roleCache) {
      if (now > entry.expiresAt) this.roleCache.delete(key);
    }
  }
}
