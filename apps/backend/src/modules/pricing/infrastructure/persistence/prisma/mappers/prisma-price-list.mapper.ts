import type { Prisma } from '@tienda/database';
import { PriceList, type PriceListPrimitives } from '../../../../domain';

export type PriceListPrismaModel = Prisma.PriceListGetPayload<{}>;

export class PrismaPriceListMapper {
  static toDomain(model: PriceListPrismaModel): PriceList {
    return PriceList.fromPrimitives({
      id: model.id, tenantId: model.tenantId, name: model.name,
      code: model.code, currency: model.currency, type: model.type as any,
      priority: model.priority, status: model.status, channel: model.channel,
      customerGroup: model.customerGroup, startsAt: model.startsAt, endsAt: model.endsAt,
      isDefault: model.isDefault, deletedAt: model.deletedAt,
      version: model.version, createdAt: model.createdAt, updatedAt: model.updatedAt,
    } as PriceListPrimitives);
  }

  static toCreateInput(pl: PriceList): Prisma.PriceListCreateInput {
    const p = pl.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, name: p.name, code: p.code,
      currency: p.currency, type: p.type as any, priority: p.priority,
      status: p.status, channel: p.channel as any, customerGroup: p.customerGroup,
      startsAt: p.startsAt, endsAt: p.endsAt, isDefault: p.isDefault,
      createdAt: p.createdAt, updatedAt: p.updatedAt,
    };
  }

  static toUpdateInput(pl: PriceList): Prisma.PriceListUpdateInput {
    const p = pl.toPrimitives();
    return {
      name: p.name, code: p.code, currency: p.currency,
      type: p.type as any, priority: p.priority, status: p.status,
      channel: p.channel as any, customerGroup: p.customerGroup,
      startsAt: p.startsAt, endsAt: p.endsAt, isDefault: p.isDefault,
      deletedAt: p.deletedAt, updatedAt: p.updatedAt, version: p.version,
    };
  }
}
