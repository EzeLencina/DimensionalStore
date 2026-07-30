import type { Prisma } from '@tienda/database';
import { ProductVariant, type VariantPrimitives } from '../../../../domain';

export type VariantPrismaModel = Prisma.ProductVariantGetPayload<{}>;

export class PrismaVariantMapper {
  static toDomain(model: VariantPrismaModel): ProductVariant {
    const attrs = (model.attributes as { name: string; value: string }[]) ?? [];
    return ProductVariant.fromPrimitives({
      id: model.id,
      tenantId: model.tenantId,
      productId: model.productId,
      sku: model.sku,
      name: model.name,
      barcode: model.barcode,
      status: model.status as any,
      attributes: attrs,
      isDefault: model.isDefault,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      version: model.version,
    } as VariantPrimitives);
  }

  static toCreateInput(variant: ProductVariant): Prisma.ProductVariantCreateInput {
    const p = variant.toPrimitives();
    return {
      id: p.id,
      tenantId: p.tenantId,
      productId: p.productId,
      sku: p.sku,
      name: p.name,
      barcode: p.barcode,
      status: p.status as any,
      attributes: p.attributes ?? [],
      isDefault: p.isDefault,
      createdAt: p.createdAt,
    };
  }

  static toUpdateInput(variant: ProductVariant): Prisma.ProductVariantUpdateInput {
    const p = variant.toPrimitives();
    return {
      sku: p.sku,
      name: p.name,
      barcode: p.barcode,
      status: p.status as any,
      attributes: p.attributes ?? [],
      isDefault: p.isDefault,
      updatedAt: p.updatedAt,
      deletedAt: p.deletedAt,
      version: p.version,
    };
  }
}
