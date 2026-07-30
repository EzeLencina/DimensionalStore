import { Customer } from '../../../../../customers/domain';
import type { CustomerPrimitives } from '../../../../../customers/domain';

export class PrismaCustomerMapper {
  static toDomain(raw: {
    id: string; tenantId: string; userId: string | null; email: string; firstName: string; lastName: string; phone: string | null;
    documentType: string | null; documentNumber: string | null; status: string; source: string; locale: string; preferredCurrency: string;
    acceptsMarketing: boolean; emailVerified: boolean; phoneVerified: boolean; lastOrderAt: Date | null; firstOrderAt: Date | null;
    totalOrders: number; totalSpent: number; averageOrderValue: number; createdAt: Date; updatedAt: Date; deletedAt: Date | null; version: number;
    addresses?: Array<{ id: string; tenantId: string; customerId: string; type: string; label: string | null; recipientName: string; phone: string | null; street: string; number: string; apartment: string | null; city: string; province: string; postalCode: string; country: string; notes: string | null; isDefaultShipping: boolean; isDefaultBilling: boolean; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
    preferences?: { customerId: string; language: string; currency: string; marketingEmail: boolean; marketingWhatsApp: boolean; marketingSms: boolean; orderNotifications: boolean; productRecommendations: boolean; updatedAt: Date } | null;
    tags?: Array<{ id: string; tenantId: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
    notes?: Array<{ id: string; tenantId: string; customerId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date; deletedAt: Date | null }>;
  }): Customer {
    return Customer.fromPrimitives({
      id: raw.id, tenantId: raw.tenantId, userId: raw.userId, email: raw.email, firstName: raw.firstName, lastName: raw.lastName, phone: raw.phone,
      documentType: raw.documentType, documentNumber: raw.documentNumber, status: raw.status, source: raw.source, locale: raw.locale, preferredCurrency: raw.preferredCurrency,
      acceptsMarketing: raw.acceptsMarketing, emailVerified: raw.emailVerified, phoneVerified: raw.phoneVerified, lastOrderAt: raw.lastOrderAt, firstOrderAt: raw.firstOrderAt,
      totalOrders: raw.totalOrders, totalSpent: raw.totalSpent, averageOrderValue: raw.averageOrderValue, createdAt: raw.createdAt, updatedAt: raw.updatedAt, deletedAt: raw.deletedAt, version: raw.version,
      addresses: raw.addresses?.map(a => ({ id: a.id, tenantId: a.tenantId, customerId: a.customerId, type: a.type, label: a.label, recipientName: a.recipientName, phone: a.phone, street: a.street, number: a.number, apartment: a.apartment, city: a.city, province: a.province, postalCode: a.postalCode, country: a.country, notes: a.notes, isDefaultShipping: a.isDefaultShipping, isDefaultBilling: a.isDefaultBilling, createdAt: a.createdAt, updatedAt: a.updatedAt, deletedAt: a.deletedAt })) ?? [],
      preferences: raw.preferences ? { customerId: raw.preferences.customerId, language: raw.preferences.language, currency: raw.preferences.currency, marketingEmail: raw.preferences.marketingEmail, marketingWhatsApp: raw.preferences.marketingWhatsApp, marketingSms: raw.preferences.marketingSms, orderNotifications: raw.preferences.orderNotifications, productRecommendations: raw.preferences.productRecommendations, updatedAt: raw.preferences.updatedAt } : null,
      tags: raw.tags?.map(t => ({ id: t.id, tenantId: t.tenantId, name: t.name, slug: t.slug, description: t.description, createdAt: t.createdAt, updatedAt: t.updatedAt, deletedAt: t.deletedAt })) ?? [],
      notes: raw.notes?.map(n => ({ id: n.id, tenantId: n.tenantId, customerId: n.customerId, content: n.content, createdBy: n.createdBy, createdAt: n.createdAt, updatedAt: n.updatedAt, deletedAt: n.deletedAt })) ?? [],
    });
  }

  static toPrisma(customer: Customer): Record<string, unknown> {
    const p = customer.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, userId: p.userId, email: p.email, firstName: p.firstName, lastName: p.lastName, phone: p.phone,
      documentType: p.documentType, documentNumber: p.documentNumber, status: p.status, source: p.source, locale: p.locale, preferredCurrency: p.preferredCurrency,
      acceptsMarketing: p.acceptsMarketing, emailVerified: p.emailVerified, phoneVerified: p.phoneVerified, lastOrderAt: p.lastOrderAt, firstOrderAt: p.firstOrderAt,
      totalOrders: p.totalOrders, totalSpent: p.totalSpent, averageOrderValue: p.averageOrderValue, deletedAt: p.deletedAt, version: p.version,
    };
  }
}
