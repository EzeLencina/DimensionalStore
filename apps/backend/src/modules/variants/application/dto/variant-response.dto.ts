export type VariantResponseDto = {
  id: string;
  tenantId: string;
  productId: string;
  sku: string;
  name: string | null;
  barcode: string | null;
  status: string;
  attributes: { name: string; value: string }[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
};
