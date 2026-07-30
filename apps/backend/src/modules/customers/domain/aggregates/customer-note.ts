import { CustomerNoteId } from '../value-objects';

export type CustomerNotePrimitives = { id: string; tenantId: string; customerId: string; content: string; createdBy: string; createdAt: Date; updatedAt: Date; deletedAt: Date | null };

export class CustomerNote {
  private id!: CustomerNoteId;
  constructor(private tenantId: string, private customerId: string, private content: string, private createdBy: string, private createdAt: Date = new Date(), private updatedAt: Date = new Date(), private deletedAt: Date | null = null) {
    this.id = new CustomerNoteId();
  }
  static fromPrimitives(p: CustomerNotePrimitives): CustomerNote {
    const note = new CustomerNote(p.tenantId, p.customerId, p.content, p.createdBy, p.createdAt, p.updatedAt, p.deletedAt);
    (note as unknown as { id: CustomerNoteId }).id = new CustomerNoteId(p.id);
    return note;
  }
  toPrimitives(): CustomerNotePrimitives { return { id: this.id.toString(), tenantId: this.tenantId, customerId: this.customerId, content: this.content, createdBy: this.createdBy, createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt }; }
  getId(): string { return this.id.toString(); }
  softDelete(now: Date): void { this.deletedAt = now; this.updatedAt = now; }
}
