import { PriceListId, PriceListType, type PriceListTypeValue } from '../value-objects';
import { PricingException, PRICING_ERROR_CODES } from '../exceptions';

export type PriceListPrimitives = {
  id: string; tenantId: string; name: string; code: string;
  currency: string; type: string; priority: number; status: string;
  channel: string | null; customerGroup: string | null;
  startsAt: Date | null; endsAt: Date | null;
  isDefault: boolean; deletedAt: Date | null;
  version: number; createdAt: Date; updatedAt: Date;
};

type PriceListCreateParams = {
  tenantId: string; name: string; code: string;
  currency?: string; type?: string; priority?: number;
  channel?: string | null; customerGroup?: string | null;
  startsAt?: Date | null; endsAt?: Date | null;
  isDefault?: boolean;
};

export class PriceList {
  private id!: PriceListId; private tenantId!: string; private name!: string;
  private code!: string; private currency!: string; private type!: PriceListType;
  private priority!: number; private status!: string; private channel!: string | null;
  private customerGroup!: string | null; private startsAt!: Date | null;
  private endsAt!: Date | null; private isDefault!: boolean;
  private deletedAt!: Date | null; private version!: number;
  private createdAt!: Date; private updatedAt!: Date;

  private constructor() {}

  static create(params: PriceListCreateParams): PriceList {
    const pl = new PriceList();
    pl.id = new PriceListId(); pl.tenantId = params.tenantId;
    pl.name = params.name.trim(); pl.code = params.code.toUpperCase().trim();
    pl.currency = params.currency ?? 'ARS'; pl.type = PriceListType.create(params.type ?? 'RETAIL');
    pl.priority = params.priority ?? 0; pl.status = 'ACTIVE';
    pl.channel = params.channel ?? null; pl.customerGroup = params.customerGroup ?? null;
    pl.startsAt = params.startsAt ?? null; pl.endsAt = params.endsAt ?? null;
    pl.isDefault = params.isDefault ?? false;
    pl.deletedAt = null; pl.version = 1;
    pl.createdAt = new Date(); pl.updatedAt = new Date();
    if (!pl.name || !pl.code) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, 'Name and code are required');
    if (pl.startsAt && pl.endsAt && pl.startsAt > pl.endsAt) throw new PricingException(PRICING_ERROR_CODES.INVALID_PROMOTION_DATE_RANGE, 'startsAt must be before endsAt');
    return pl;
  }

  static fromPrimitives(p: PriceListPrimitives): PriceList {
    const pl = new PriceList();
    pl.id = new PriceListId(p.id); pl.tenantId = p.tenantId; pl.name = p.name;
    pl.code = p.code; pl.currency = p.currency; pl.type = PriceListType.create(p.type);
    pl.priority = p.priority; pl.status = p.status; pl.channel = p.channel;
    pl.customerGroup = p.customerGroup; pl.startsAt = p.startsAt; pl.endsAt = p.endsAt;
    pl.isDefault = p.isDefault; pl.deletedAt = p.deletedAt; pl.version = p.version;
    pl.createdAt = p.createdAt; pl.updatedAt = p.updatedAt;
    return pl;
  }

  toPrimitives(): PriceListPrimitives {
    return {
      id: this.id.toString(), tenantId: this.tenantId, name: this.name,
      code: this.code, currency: this.currency, type: this.type.toString(),
      priority: this.priority, status: this.status, channel: this.channel,
      customerGroup: this.customerGroup, startsAt: this.startsAt, endsAt: this.endsAt,
      isDefault: this.isDefault, deletedAt: this.deletedAt, version: this.version,
      createdAt: this.createdAt, updatedAt: this.updatedAt,
    };
  }

  getId(): PriceListId { return this.id; }
  getTenantId(): string { return this.tenantId; }
  getName(): string { return this.name; }
  getCode(): string { return this.code; }
  getCurrency(): string { return this.currency; }
  getType(): PriceListType { return this.type; }
  getPriority(): number { return this.priority; }
  getStatus(): string { return this.status; }
  getChannel(): string | null { return this.channel; }
  getCustomerGroup(): string | null { return this.customerGroup; }
  getIsDefault(): boolean { return this.isDefault; }
  getVersion(): number { return this.version; }
  hasBeenDeleted(): boolean { return this.deletedAt !== null; }

  isActive(): boolean { return this.status === 'ACTIVE' && !this.hasBeenDeleted(); }
  isApplicable(date: Date): boolean {
    if (!this.isActive()) return false;
    if (this.startsAt && date < this.startsAt) return false;
    if (this.endsAt && date > this.endsAt) return false;
    return true;
  }

  setAsDefault(): void { this.isDefault = true; this.touch(); }
  unsetDefault(): void { this.isDefault = false; this.touch(); }
  activate(): void { this.assertNotDeleted(); this.status = 'ACTIVE'; this.touch(); }
  deactivate(): void { this.assertNotDeleted(); this.status = 'INACTIVE'; this.touch(); }
  softDelete(): void { if (this.deletedAt !== null) return; this.deletedAt = new Date(); this.touch(); }

  private touch(): void { this.updatedAt = new Date(); this.version++; }
  private assertNotDeleted(): void {
    if (this.deletedAt !== null) throw new PricingException(PRICING_ERROR_CODES.PRICING_INVALID_DATA, 'Cannot modify a deleted price list');
  }
}
