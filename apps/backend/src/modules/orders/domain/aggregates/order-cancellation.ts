import { randomUUID } from 'node:crypto';

export type CancellationType = 'FULL' | 'PARTIAL';
export type CancellationStatus = 'REQUESTED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';

export type OrderCancellationPrimitives = {
  id: string; tenantId: string; orderId: string;
  type: string; reasonCode: string; reasonText: string | null;
  status: string;
  requestedByType: string; requestedById: string | null;
  approvedBy: string | null;
  requestedAt: Date; approvedAt: Date | null; completedAt: Date | null;
  metadata: Record<string, unknown> | null;
};

type CreateParams = {
  tenantId: string; orderId: string;
  type?: string; reasonCode: string; reasonText?: string | null;
  requestedByType: string; requestedById?: string | null;
  metadata?: Record<string, unknown> | null;
};

export class OrderCancellation {
  private id!: string;
  private tenantId!: string;
  private orderId!: string;
  private type!: CancellationType;
  private reasonCode!: string;
  private reasonText!: string | null;
  private status!: CancellationStatus;
  private requestedByType!: string;
  private requestedById!: string | null;
  private approvedBy!: string | null;
  private requestedAt!: Date;
  private approvedAt!: Date | null;
  private completedAt!: Date | null;
  private metadata!: Record<string, unknown> | null;

  private constructor() {}

  static create(params: CreateParams): OrderCancellation {
    const c = new OrderCancellation();
    (c as any).id = randomUUID();
    (c as any).tenantId = params.tenantId;
    (c as any).orderId = params.orderId;
    (c as any).type = (params.type?.toUpperCase() as CancellationType) ?? 'FULL';
    (c as any).reasonCode = params.reasonCode;
    (c as any).reasonText = params.reasonText ?? null;
    (c as any).status = 'COMPLETED';
    (c as any).requestedByType = params.requestedByType;
    (c as any).requestedById = params.requestedById ?? null;
    (c as any).approvedBy = null;
    (c as any).requestedAt = new Date();
    (c as any).approvedAt = null;
    (c as any).completedAt = new Date();
    (c as any).metadata = params.metadata ?? null;
    return c;
  }

  static fromPrimitives(p: OrderCancellationPrimitives): OrderCancellation {
    const c = new OrderCancellation();
    (c as any).id = p.id;
    (c as any).tenantId = p.tenantId;
    (c as any).orderId = p.orderId;
    (c as any).type = p.type;
    (c as any).reasonCode = p.reasonCode;
    (c as any).reasonText = p.reasonText;
    (c as any).status = p.status;
    (c as any).requestedByType = p.requestedByType;
    (c as any).requestedById = p.requestedById;
    (c as any).approvedBy = p.approvedBy;
    (c as any).requestedAt = p.requestedAt;
    (c as any).approvedAt = p.approvedAt;
    (c as any).completedAt = p.completedAt;
    (c as any).metadata = p.metadata;
    return c;
  }

  toPrimitives(): OrderCancellationPrimitives {
    return {
      id: this.id, tenantId: this.tenantId, orderId: this.orderId,
      type: this.type, reasonCode: this.reasonCode, reasonText: this.reasonText,
      status: this.status,
      requestedByType: this.requestedByType, requestedById: this.requestedById,
      approvedBy: this.approvedBy,
      requestedAt: this.requestedAt, approvedAt: this.approvedAt, completedAt: this.completedAt,
      metadata: this.metadata,
    };
  }

  getId(): string { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getOrderId(): string { return this.orderId; }
  getReasonCode(): string { return this.reasonCode; }
  getStatus(): string { return this.status; }
}
