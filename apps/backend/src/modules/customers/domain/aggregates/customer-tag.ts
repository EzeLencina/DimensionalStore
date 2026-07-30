import { CustomerTagId } from '../value-objects';

export type CustomerTagPrimitives = { id: string; tenantId: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date; deletedAt: Date | null };

export class CustomerTag {
  private id!: CustomerTagId;
  constructor(private tenantId: string, private name: string, private slug: string, private description: string | null, private createdAt: Date = new Date(), private updatedAt: Date = new Date(), private deletedAt: Date | null = null) {
    this.id = new CustomerTagId();
  }
  static fromPrimitives(p: CustomerTagPrimitives): CustomerTag {
    const tag = new CustomerTag(p.tenantId, p.name, p.slug, p.description, p.createdAt, p.updatedAt, p.deletedAt);
    (tag as unknown as { id: CustomerTagId }).id = new CustomerTagId(p.id);
    return tag;
  }
  toPrimitives(): CustomerTagPrimitives { return { id: this.id.toString(), tenantId: this.tenantId, name: this.name, slug: this.slug, description: this.description, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt }; }
  getId(): string { return this.id.toString(); }
}
