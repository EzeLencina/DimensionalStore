import { randomUUID } from 'node:crypto';

export type OrderStatusHistoryPrimitives = {
  id: string; tenantId: string; orderId: string;
  fromStatus: string | null; toStatus: string;
  reason: string | null; metadata: Record<string, unknown> | null;
  changedByType: string; changedById: string | null;
  createdAt: Date;
};

type CreateParams = {
  tenantId: string; orderId: string;
  fromStatus: string | null; toStatus: string;
  reason?: string | null; metadata?: Record<string, unknown> | null;
  changedByType: string; changedById?: string | null;
};

export class OrderStatusHistory {
  private readonly id!: string;
  private readonly tenantId!: string;
  private readonly orderId!: string;
  private readonly fromStatus!: string | null;
  private readonly toStatus!: string;
  private readonly reason!: string | null;
  private readonly metadata!: Record<string, unknown> | null;
  private readonly changedByType!: string;
  private readonly changedById!: string | null;
  private readonly createdAt!: Date;

  private constructor() {}

  static create(params: CreateParams): OrderStatusHistory {
    const h = new OrderStatusHistory();
    (h as any).id = randomUUID();
    (h as any).tenantId = params.tenantId;
    (h as any).orderId = params.orderId;
    (h as any).fromStatus = params.fromStatus ?? null;
    (h as any).toStatus = params.toStatus;
    (h as any).reason = params.reason ?? null;
    (h as any).metadata = params.metadata ?? null;
    (h as any).changedByType = params.changedByType;
    (h as any).changedById = params.changedById ?? null;
    (h as any).createdAt = new Date();
    Object.freeze(h);
    return h;
  }

  static fromPrimitives(p: OrderStatusHistoryPrimitives): OrderStatusHistory {
    const h = new OrderStatusHistory();
    (h as any).id = p.id;
    (h as any).tenantId = p.tenantId;
    (h as any).orderId = p.orderId;
    (h as any).fromStatus = p.fromStatus;
    (h as any).toStatus = p.toStatus;
    (h as any).reason = p.reason;
    (h as any).metadata = p.metadata;
    (h as any).changedByType = p.changedByType;
    (h as any).changedById = p.changedById;
    (h as any).createdAt = p.createdAt;
    Object.freeze(h);
    return h;
  }

  toPrimitives(): OrderStatusHistoryPrimitives {
    return {
      id: this.id, tenantId: this.tenantId, orderId: this.orderId,
      fromStatus: this.fromStatus, toStatus: this.toStatus,
      reason: this.reason, metadata: this.metadata,
      changedByType: this.changedByType, changedById: this.changedById,
      createdAt: this.createdAt,
    };
  }

  getId(): string { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getOrderId(): string { return this.orderId; }
  getToStatus(): string { return this.toStatus; }
  getFromStatus(): string | null { return this.fromStatus; }
  getCreatedAt(): Date { return this.createdAt; }
}
