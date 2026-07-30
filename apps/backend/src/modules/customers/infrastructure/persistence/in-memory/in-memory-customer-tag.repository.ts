import type { CustomerTag } from '../../../../customers/domain';
import type { CustomerTagRepository } from '../../../../customers/domain/repositories';

export class InMemoryCustomerTagRepository implements CustomerTagRepository {
  private store = new Map<string, CustomerTag>();
  private key(id: string, tenantId: string): string { return `${tenantId}:${id}`; }
  async save(tag: CustomerTag): Promise<CustomerTag> { this.store.set(this.key(tag.getId(), tag.toPrimitives().tenantId), tag); return tag; }
  async findById(id: string, tenantId: string): Promise<CustomerTag | null> { return this.store.get(this.key(id, tenantId)) ?? null; }
  async findBySlug(slug: string, tenantId: string): Promise<CustomerTag | null> { return Array.from(this.store.values()).find(t => t.toPrimitives().tenantId === tenantId && t.toPrimitives().slug === slug) ?? null; }
  async list(tenantId: string): Promise<CustomerTag[]> { return Array.from(this.store.values()).filter(t => t.toPrimitives().tenantId === tenantId); }
  async existsBySlug(slug: string, tenantId: string): Promise<boolean> { return (await this.findBySlug(slug, tenantId)) !== null; }
}
