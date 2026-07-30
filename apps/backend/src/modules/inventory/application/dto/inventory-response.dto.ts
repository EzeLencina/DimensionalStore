export type WarehouseResponseDto = {
  id: string; tenantId: string; name: string; code: string;
  address: string | null; status: string; isDefault: boolean;
  createdAt: string; updatedAt: string;
};

export type InventoryItemResponseDto = {
  id: string; tenantId: string; warehouseId: string;
  productVariantId: string; sku: string;
  onHand: number; reserved: number; available: number;
  minimumStock: number; version: number;
  createdAt: string; updatedAt: string;
};

export type StockMovementResponseDto = {
  id: string; tenantId: string; warehouseId: string;
  productVariantId: string; type: string; quantity: number;
  previousOnHand: number; resultingOnHand: number;
  reason: string; createdBy: string;
  referenceType: string | null; referenceId: string | null;
  metadata: Record<string, any> | null; createdAt: string;
};

export type StockReservationResponseDto = {
  id: string; tenantId: string; warehouseId: string;
  productVariantId: string; quantity: number; status: string;
  referenceType: string; referenceId: string;
  expiresAt: string | null; createdAt: string; updatedAt: string;
};

export type PaginatedResponseDto<T> = {
  data: T[]; total: number; page: number; limit: number; totalPages: number;
};
