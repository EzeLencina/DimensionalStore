import { Warehouse, InventoryItem } from '../../domain';
import { StockMovement, StockReservation } from '../../domain/value-objects';
import type {
  WarehouseResponseDto, InventoryItemResponseDto,
  StockMovementResponseDto, StockReservationResponseDto,
  PaginatedResponseDto,
} from '../dto/inventory-response.dto';

export class InventoryMapper {
  static warehouseToResponse(w: Warehouse): WarehouseResponseDto {
    const p = w.toPrimitives();
    return { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() };
  }

  static inventoryToResponse(item: InventoryItem): InventoryItemResponseDto {
    const p = item.toPrimitives();
    return { ...p, available: item.getAvailable(), createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() };
  }

  static movementToResponse(m: StockMovement): StockMovementResponseDto {
    return {
      id: m.id.toString(), tenantId: m.tenantId, warehouseId: m.warehouseId,
      productVariantId: m.productVariantId, type: m.type, quantity: m.quantity,
      previousOnHand: m.previousOnHand, resultingOnHand: m.resultingOnHand,
      reason: m.reason, createdBy: m.createdBy,
      referenceType: m.referenceType ?? null, referenceId: m.referenceId ?? null,
      metadata: m.metadata ?? null, createdAt: m.createdAt.toISOString(),
    };
  }

  static reservationToResponse(r: StockReservation): StockReservationResponseDto {
    return {
      id: r.id.toString(), tenantId: r.tenantId, warehouseId: r.warehouseId,
      productVariantId: r.productVariantId, quantity: r.quantity, status: r.status,
      referenceType: r.referenceType, referenceId: r.referenceId,
      expiresAt: r.expiresAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
    };
  }

  static toPaginated<T>(data: T[], total: number, page: number, limit: number): PaginatedResponseDto<T> {
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
