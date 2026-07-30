import type { Prisma } from '@tienda/database';
import { VariantPrice, type VariantPricePrimitives } from '../../../../domain';

export type VariantPricePrismaModel = Prisma.VariantPriceGetPayload<{}>;

export class PrismaVariantPriceMapper {
  static toDomain(model: VariantPricePrismaModel): VariantPrice {
    return VariantPrice.fromPrimitives({
      id: model.id, tenantId: model.tenantId, priceListId: model.priceListId,
      productVariantId: model.productVariantId, sku: model.sku,
      costAmount: model.costAmount, listAmount: model.listAmount,
      saleAmount: model.saleAmount, promotionalAmount: model.promotionalAmount,
      promotionalStartsAt: model.promotionalStartsAt,
      promotionalEndsAt: model.promotionalEndsAt,
      minimumQuantity: model.minimumQuantity, deletedAt: model.deletedAt,
      version: model.version, createdAt: model.createdAt, updatedAt: model.updatedAt,
    } as VariantPricePrimitives);
  }

  static toCreateInput(vp: VariantPrice): Prisma.VariantPriceCreateInput {
    const p = vp.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, priceListId: p.priceListId,
      productVariantId: p.productVariantId, sku: p.sku,
      costAmount: p.costAmount, listAmount: p.listAmount,
      saleAmount: p.saleAmount, promotionalAmount: p.promotionalAmount,
      promotionalStartsAt: p.promotionalStartsAt,
      promotionalEndsAt: p.promotionalEndsAt,
      minimumQuantity: p.minimumQuantity, createdAt: p.createdAt,
    };
  }

  static toUpdateInput(vp: VariantPrice): Prisma.VariantPriceUpdateInput {
    const p = vp.toPrimitives();
    return {
      costAmount: p.costAmount, listAmount: p.listAmount,
      saleAmount: p.saleAmount, promotionalAmount: p.promotionalAmount,
      promotionalStartsAt: p.promotionalStartsAt,
      promotionalEndsAt: p.promotionalEndsAt,
      minimumQuantity: p.minimumQuantity, deletedAt: p.deletedAt,
      updatedAt: p.updatedAt, version: p.version,
    };
  }
}
