import { Injectable } from '@nestjs/common';
import type { PaginationMeta, PaginationLinks, OffsetPaginationInput } from '../types';
import type { IPaginationService } from '../interfaces';
import { ApiConfigurationFactory } from '../config';
import { ApiInvalidPaginationException } from '../exceptions';

@Injectable()
export class OffsetPaginationService implements IPaginationService {
  readonly type = 'offset' as const;

  constructor(private readonly configFactory: ApiConfigurationFactory) {}

  validate(params: OffsetPaginationInput): void {
    const maxLimit = params.maxLimit ?? this.configFactory.getMaxLimit();
    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();

    if (limit < 1) {
      throw new ApiInvalidPaginationException('Page size must be greater than 0', { limit });
    }

    if (limit > maxLimit) {
      throw new ApiInvalidPaginationException(
        `Page size exceeds maximum of ${maxLimit}`,
        { limit, maxLimit },
      );
    }

    const page = params.page ?? 1;
    if (page < 1) {
      throw new ApiInvalidPaginationException('Page must be greater than 0', { page });
    }
  }

  buildMeta(
    totalCount: number,
    params: OffsetPaginationInput,
  ): PaginationMeta {
    this.validate(params);

    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();
    const page = params.page ?? 1;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      type: 'offset',
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  buildLinks(
    baseUrl: string,
    params: OffsetPaginationInput,
    totalCount: number,
  ): PaginationLinks {
    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();
    const page = params.page ?? 1;
    const totalPages = Math.ceil(totalCount / limit);

    const buildUrl = (p: number): string => {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}page=${p}&limit=${limit}`;
    };

    return {
      self: buildUrl(page),
      first: buildUrl(1),
      last: buildUrl(totalPages),
      next: page < totalPages ? buildUrl(page + 1) : undefined,
      previous: page > 1 ? buildUrl(page - 1) : undefined,
    };
  }

  getSkip(params: OffsetPaginationInput): number {
    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();
    const page = params.page ?? 1;
    return (page - 1) * limit;
  }
}
