import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient } from '@tienda/database';
import { CustomerAddress } from '../../../../customers/domain';
import type { CustomerAddressRepository } from '../../../../customers/domain';

type Row = { id: string; tenantId: string; customerId: string; type: string; label: string | null; recipientName: string; phone: string | null; street: string; number: string; apartment: string | null; city: string; province: string; postalCode: string; country: string; notes: string | null; isDefaultShipping: boolean; isDefaultBilling: boolean; createdAt: Date; updatedAt: Date; deletedAt: Date | null };

@Injectable()
export class PrismaCustomerAddressRepository implements CustomerAddressRepository {
  constructor(@Inject('PRISMA_CLIENT_CUSTOMERS') private readonly prisma: PrismaClient) {}
  async save(address: CustomerAddress): Promise<CustomerAddress> { await this.prisma.customerAddress.upsert({ where: { id: address.getId() }, create: address.toPrimitives() as never, update: address.toPrimitives() as never }); return address; }
  async findById(id: string, tenantId: string): Promise<CustomerAddress | null> { const raw = await this.prisma.customerAddress.findFirst({ where: { id, tenantId } }); return raw ? CustomerAddress.fromPrimitives(raw as Row) : null; }
  async listByCustomer(customerId: string, tenantId: string): Promise<CustomerAddress[]> { const rows = await this.prisma.customerAddress.findMany({ where: { customerId, tenantId } }); return rows.map((r: Row) => CustomerAddress.fromPrimitives(r)); }
  async findDefaultShipping(customerId: string, tenantId: string): Promise<CustomerAddress | null> { const raw = await this.prisma.customerAddress.findFirst({ where: { customerId, tenantId, isDefaultShipping: true } }); return raw ? CustomerAddress.fromPrimitives(raw as Row) : null; }
  async findDefaultBilling(customerId: string, tenantId: string): Promise<CustomerAddress | null> { const raw = await this.prisma.customerAddress.findFirst({ where: { customerId, tenantId, isDefaultBilling: true } }); return raw ? CustomerAddress.fromPrimitives(raw as Row) : null; }
  async softDelete(id: string, tenantId: string): Promise<void> { await this.prisma.customerAddress.updateMany({ where: { id, tenantId }, data: { deletedAt: new Date() } }); }
}
