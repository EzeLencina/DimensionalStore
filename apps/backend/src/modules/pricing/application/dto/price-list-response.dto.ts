export type PriceListResponseDto = {
  id: string; tenantId: string; name: string; code: string;
  currency: string; type: string; priority: number; status: string;
  channel: string | null; customerGroup: string | null;
  startsAt: string | null; endsAt: string | null;
  isDefault: boolean; deletedAt: string | null;
  version: number; createdAt: string; updatedAt: string;
};

export type PaginatedPriceListResponseDto = {
  data: PriceListResponseDto[]; total: number; page: number; limit: number; totalPages: number;
};
