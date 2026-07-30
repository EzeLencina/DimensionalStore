import type { InventoryPrimitives } from '../aggregates/inventory-item.aggregate';

export type InventoryFilter = {
  tenantId: string;
  warehouseId?: string;
  sku?: string;
  productVariantId?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
