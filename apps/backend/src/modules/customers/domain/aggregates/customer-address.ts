import { AddressId } from '../value-objects';

export type CustomerAddressPrimitives = {
  id: string; tenantId: string; customerId: string; type: string; label: string | null;
  recipientName: string; phone: string | null; street: string; number: string; apartment: string | null;
  city: string; province: string; postalCode: string; country: string; notes: string | null;
  isDefaultShipping: boolean; isDefaultBilling: boolean; createdAt: Date; updatedAt: Date; deletedAt: Date | null;
};

export class CustomerAddress {
  private id!: AddressId;
  constructor(
    private tenantId: string,
    private customerId: string,
    private type: 'SHIPPING' | 'BILLING' | 'BOTH',
    private label: string | null,
    private recipientName: string,
    private phone: string | null,
    private street: string,
    private number: string,
    private apartment: string | null,
    private city: string,
    private province: string,
    private postalCode: string,
    private country: string,
    private notes: string | null,
    private isDefaultShipping: boolean,
    private isDefaultBilling: boolean,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private deletedAt: Date | null = null,
  ) { this.id = new AddressId(); }

  static fromPrimitives(p: CustomerAddressPrimitives): CustomerAddress {
    const a = new CustomerAddress(p.tenantId, p.customerId, p.type as 'SHIPPING' | 'BILLING' | 'BOTH', p.label, p.recipientName, p.phone, p.street, p.number, p.apartment, p.city, p.province, p.postalCode, p.country, p.notes, p.isDefaultShipping, p.isDefaultBilling, p.createdAt, p.updatedAt, p.deletedAt);
    (a as unknown as { id: AddressId }).id = new AddressId(p.id);
    return a;
  }

  toPrimitives(): CustomerAddressPrimitives {
    return { id: this.id.toString(), tenantId: this.tenantId, customerId: this.customerId, type: this.type, label: this.label, recipientName: this.recipientName, phone: this.phone, street: this.street, number: this.number, apartment: this.apartment, city: this.city, province: this.province, postalCode: this.postalCode, country: this.country, notes: this.notes, isDefaultShipping: this.isDefaultShipping, isDefaultBilling: this.isDefaultBilling, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt };
  }

  getId(): string { return this.id.toString(); }
  getCustomerId(): string { return this.customerId; }
  getTenantId(): string { return this.tenantId; }
  getType(): string { return this.type; }
  getIsDefaultShipping(): boolean { return this.isDefaultShipping; }
  getIsDefaultBilling(): boolean { return this.isDefaultBilling; }
  softDelete(now: Date): void { this.deletedAt = now; this.updatedAt = now; }
  setDefaultShipping(value: boolean): void { this.isDefaultShipping = value; this.updatedAt = new Date(); }
  setDefaultBilling(value: boolean): void { this.isDefaultBilling = value; this.updatedAt = new Date(); }
}
