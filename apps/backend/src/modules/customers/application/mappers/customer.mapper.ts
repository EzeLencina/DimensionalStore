import type { Customer } from '../../domain';
import type { CustomerResponseDto, CustomerAddressDto, CustomerPreferencesDto, CustomerNoteDto, CustomerTagDto } from '../dto';

export class CustomerMapper {
  static toResponse(customer: Customer): CustomerResponseDto {
    const p = customer.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, userId: p.userId, email: p.email, firstName: p.firstName, lastName: p.lastName, phone: p.phone,
      documentType: p.documentType, documentNumber: p.documentNumber, status: p.status, source: p.source, locale: p.locale, preferredCurrency: p.preferredCurrency,
      acceptsMarketing: p.acceptsMarketing, emailVerified: p.emailVerified, phoneVerified: p.phoneVerified,
      lastOrderAt: p.lastOrderAt?.toISOString() ?? null, firstOrderAt: p.firstOrderAt?.toISOString() ?? null,
      totalOrders: p.totalOrders, totalSpent: p.totalSpent, averageOrderValue: p.averageOrderValue,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(), deletedAt: p.deletedAt?.toISOString() ?? null, version: p.version,
      addresses: p.addresses.map((a): CustomerAddressDto => ({ id: a.id, type: a.type, label: a.label, recipientName: a.recipientName, phone: a.phone, street: a.street, number: a.number, apartment: a.apartment, city: a.city, province: a.province, postalCode: a.postalCode, country: a.country, notes: a.notes, isDefaultShipping: a.isDefaultShipping, isDefaultBilling: a.isDefaultBilling })),
      preferences: p.preferences ? { language: p.preferences.language, currency: p.preferences.currency, marketingEmail: p.preferences.marketingEmail, marketingWhatsApp: p.preferences.marketingWhatsApp, marketingSms: p.preferences.marketingSms, orderNotifications: p.preferences.orderNotifications, productRecommendations: p.preferences.productRecommendations } as CustomerPreferencesDto : null,
      tags: p.tags.map((t): CustomerTagDto => ({ id: t.id, name: t.name, slug: t.slug, description: t.description })),
      notes: p.notes.map((n): CustomerNoteDto => ({ id: n.id, content: n.content, createdBy: n.createdBy, createdAt: n.createdAt.toISOString(), updatedAt: n.updatedAt.toISOString(), deletedAt: n.deletedAt?.toISOString() ?? null })),
    };
  }
}
