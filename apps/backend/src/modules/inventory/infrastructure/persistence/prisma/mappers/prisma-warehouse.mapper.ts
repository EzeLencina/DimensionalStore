import type { Prisma } from '@tienda/database';
import { Warehouse } from '../../../../domain';

export type WarehousePrismaModel = Prisma.WarehouseGetPayload<{}>;

export class PrismaWarehouseMapper {
  static toDomain(model: WarehousePrismaModel): Warehouse {
    return Warehouse.fromPrimitives({
      id: model.id, tenantId: model.tenantId, name: model.name,
      code: model.code, address: model.address,
      status: model.status as string, isDefault: model.isDefault,
      deletedAt: model.deletedAt, createdAt: model.createdAt, updatedAt: model.updatedAt,
    } as any);
  }

  static toCreateInput(w: Warehouse): Prisma.WarehouseCreateInput {
    const p = w.toPrimitives();
    return { id: p.id, tenantId: p.tenantId, name: p.name, code: p.code, address: p.address, status: p.status as any, isDefault: p.isDefault, createdAt: p.createdAt };
  }

  static toUpdateInput(w: Warehouse): Prisma.WarehouseUpdateInput {
    const p = w.toPrimitives();
    return { name: p.name, address: p.address, status: p.status as any, isDefault: p.isDefault, updatedAt: p.updatedAt, deletedAt: p.deletedAt };
  }
}
