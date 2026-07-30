import type { PriceList } from '../../domain';
import type { PriceListResponseDto } from '../dto';

export class PriceListMapper {
  static toResponse(pl: PriceList): PriceListResponseDto {
    const p = pl.toPrimitives();
    return {
      id: p.id, tenantId: p.tenantId, name: p.name, code: p.code,
      currency: p.currency, type: p.type, priority: p.priority, status: p.status,
      channel: p.channel, customerGroup: p.customerGroup,
      startsAt: p.startsAt?.toISOString() ?? null,
      endsAt: p.endsAt?.toISOString() ?? null,
      isDefault: p.isDefault, deletedAt: p.deletedAt?.toISOString() ?? null,
      version: p.version, createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  static toResponseList(items: PriceList[], total: number, page: number, limit: number) {
    return {
      data: items.map(PriceListMapper.toResponse),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
