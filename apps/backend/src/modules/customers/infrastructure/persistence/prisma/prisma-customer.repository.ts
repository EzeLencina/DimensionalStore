import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { Customer } from '../../../../customers/domain';
import type { CustomerRepository, CustomerListFilters, CustomerListResult, CustomerId } from '../../../../customers/domain';
import { PrismaCustomerMapper } from './mappers/prisma-customer.mapper';

type CustomerTagRow = { tag: { id: string; tenantId: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null } };
type CustomerRow = {
  id: string; tenantId: string; userId: string | null; email: string; firstName: string; lastName: string; phone: string | null;
  documentType: string | null; documentNumber: string | null; status: string; source: string; locale: string; preferredCurrency: string;
  acceptsMarketing: boolean; emailVerified: boolean; phoneVerified: boolean; lastOrderAt: Date | null; firstOrderAt: Date | null;
  totalOrders: number; totalSpent: number; averageOrderValue: number; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number;
  addresses: Array<{ id: string; tenantId: string; customerId: string; type: string; label: string | null; recipientName: string; phone: string | null; street: string; number: string; apartment: string | null; city: string; province: string; postalCode: string; country: string; notes: string | null; isDefaultShipping: boolean; isDefaultBilling: boolean; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
  preferences: { customerId: string; language: string; currency: string; marketingEmail: boolean; marketingWhatsApp: boolean; marketingSms: boolean; orderNotifications: boolean; productRecommendations: boolean; updatedAt: Date } | null;
  tags: Array<{ id: string; tenantId: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
  notes: Array<{ id: string; tenantId: string; customerId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
};

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(@Inject('PRISMA_CLIENT_CUSTOMERS') private readonly prisma: PrismaClient) {}

  async save(customer: Customer): Promise<Customer> {
    const data = PrismaCustomerMapper.toPrisma(customer);
    await this.prisma.customer.upsert({ where: { id: customer.getId().toString() }, create: data as never, update: data as never });
    return customer;
  }

  async findById(id: CustomerId, tenantId: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findFirst({ where: { id: id.toString(), tenantId }, include: { addresses: true, preferences: true, tags: { include: { tag: true } }, notes: true } });
    if (!raw) return null;
    return PrismaCustomerMapper.toDomain({
      ...raw,
      tags: raw.tags.map((a: CustomerTagRow) => a.tag),
    } as unknown as CustomerRow);
  }

  async findByEmail(email: string, tenantId: string): Promise<Customer | null> { const raw = await this.prisma.customer.findFirst({ where: { email: email.toLowerCase(), tenantId }, include: { addresses: true, preferences: true, tags: { include: { tag: true } }, notes: true } }); return raw ? PrismaCustomerMapper.toDomain({ ...raw, tags: raw.tags.map((a: CustomerTagRow) => a.tag) } as unknown as CustomerRow) : null; }
  async findByUserId(userId: string, tenantId: string): Promise<Customer | null> { const raw = await this.prisma.customer.findFirst({ where: { userId, tenantId }, include: { addresses: true, preferences: true, tags: { include: { tag: true } }, notes: true } }); return raw ? PrismaCustomerMapper.toDomain({ ...raw, tags: raw.tags.map((a: CustomerTagRow) => a.tag) } as unknown as CustomerRow) : null; }
  async existsByEmail(email: string, tenantId: string): Promise<boolean> { return (await this.findByEmail(email, tenantId)) !== null; }
  async list(tenantId: string, filters?: CustomerListFilters): Promise<CustomerListResult> {
    const where: { tenantId: string; email?: { contains: string }; status?: string; source?: string } = { tenantId };
    if (filters?.email) where.email = { contains: filters.email.toLowerCase() };
    if (filters?.status) where.status = filters.status;
    if (filters?.source) where.source = filters.source;
    const limit = Math.min(filters?.limit ?? 20, 100);
    const offset = filters?.offset ?? 0;
    const [rows, total] = await Promise.all([
      this.prisma.customer.findMany({ where: where as never, take: limit, skip: offset, orderBy: { createdAt: 'desc' }, include: { addresses: true, preferences: true, tags: { include: { tag: true } }, notes: true } }),
      this.prisma.customer.count({ where: where as never }),
    ]);
    return { items: rows.map(r => PrismaCustomerMapper.toDomain({ ...r, tags: r.tags.map((a: CustomerTagRow) => a.tag) } as unknown as CustomerRow)), total, limit, offset };
  }
  async findForUpdate(id: CustomerId, tenantId: string): Promise<Customer | null> { return this.findById(id, tenantId); }
  async countByStatus(tenantId: string): Promise<Record<string, number>> { const grouped = await this.prisma.customer.groupBy({ by: ['status'], where: { tenantId } as never, _count: { status: true } } as never); const counts: Record<string, number> = {}; for (const row of grouped as Array<{ status: string; _count: { status: number } }>) counts[row.status] = row._count.status; return counts; }
}
