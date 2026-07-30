import { randomUUID } from 'node:crypto';
import { OrderException, ORDER_ERROR_CODES } from '../exceptions';

export type NoteVisibility = 'INTERNAL' | 'CUSTOMER_VISIBLE';
const VALID_VISIBILITIES: NoteVisibility[] = ['INTERNAL', 'CUSTOMER_VISIBLE'];

export type OrderNotePrimitives = {
  id: string; tenantId: string; orderId: string;
  content: string; visibility: string;
  createdBy: string;
  createdAt: Date; updatedAt: Date; deletedAt: Date | null;
};

type CreateParams = {
  tenantId: string; orderId: string;
  content: string; visibility?: string;
  createdBy: string;
};

export class OrderNote {
  private id!: string;
  private tenantId!: string;
  private orderId!: string;
  private content!: string;
  private visibility!: NoteVisibility;
  private createdBy!: string;
  private createdAt!: Date;
  private updatedAt!: Date;
  private deletedAt: Date | null = null;

  private constructor() {}

  static create(params: CreateParams): OrderNote {
    const visibility = (params.visibility?.toUpperCase() as NoteVisibility) ?? 'INTERNAL';
    if (!VALID_VISIBILITIES.includes(visibility)) {
      throw new OrderException(ORDER_ERROR_CODES.ORDER_INVALID_NOTE_VISIBILITY, `Invalid visibility: ${params.visibility}`);
    }
    const content = params.content?.trim();
    if (!content) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOTE_NOT_FOUND, 'Note content is required');
    if (content.length > 5000) throw new OrderException(ORDER_ERROR_CODES.ORDER_NOTE_FORBIDDEN, 'Note content too long (max 5000)');

    const note = new OrderNote();
    (note as any).id = randomUUID();
    (note as any).tenantId = params.tenantId;
    (note as any).orderId = params.orderId;
    (note as any).content = content;
    (note as any).visibility = visibility;
    (note as any).createdBy = params.createdBy;
    (note as any).createdAt = new Date();
    (note as any).updatedAt = new Date();
    return note;
  }

  static fromPrimitives(p: OrderNotePrimitives): OrderNote {
    const note = new OrderNote();
    (note as any).id = p.id;
    (note as any).tenantId = p.tenantId;
    (note as any).orderId = p.orderId;
    (note as any).content = p.content;
    (note as any).visibility = p.visibility;
    (note as any).createdBy = p.createdBy;
    (note as any).createdAt = p.createdAt;
    (note as any).updatedAt = p.updatedAt;
    (note as any).deletedAt = p.deletedAt;
    return note;
  }

  toPrimitives(): OrderNotePrimitives {
    return {
      id: this.id, tenantId: this.tenantId, orderId: this.orderId,
      content: this.content, visibility: this.visibility,
      createdBy: this.createdBy,
      createdAt: this.createdAt, updatedAt: this.updatedAt, deletedAt: this.deletedAt,
    };
  }

  getId(): string { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getOrderId(): string { return this.orderId; }
  getContent(): string { return this.content; }
  getVisibility(): NoteVisibility { return this.visibility; }
  getCreatedBy(): string { return this.createdBy; }
  getCreatedAt(): Date { return this.createdAt; }
  getDeletedAt(): Date | null { return this.deletedAt; }
  isDeleted(): boolean { return this.deletedAt !== null; }
  isCustomerVisible(): boolean { return this.visibility === 'CUSTOMER_VISIBLE'; }

  softDelete(now: Date): void {
    this.deletedAt = now;
    this.updatedAt = now;
  }
}
