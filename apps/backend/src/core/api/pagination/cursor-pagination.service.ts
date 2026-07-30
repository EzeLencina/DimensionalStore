import { Injectable } from '@nestjs/common';
import type { PaginationMeta, PaginationLinks, CursorPaginationInput } from '../types';
import type { IPaginationService } from '../interfaces';
import { ApiConfigurationFactory } from '../config';
import { ApiInvalidPaginationException } from '../exceptions';

@Injectable()
export class CursorPaginationService implements IPaginationService {
  readonly type = 'cursor' as const;

  constructor(private readonly configFactory: ApiConfigurationFactory) {}

  validate(params: CursorPaginationInput): void {
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
  }

  buildMeta(
    _totalCount: number,
    params: CursorPaginationInput,
  ): PaginationMeta {
    this.validate(params);

    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();

    return {
      type: 'cursor',
      limit,
      hasNextPage: false,
      hasPreviousPage: !!params.cursor,
      nextCursor: undefined,
      previousCursor: params.cursor,
    };
  }

  buildLinks(
    baseUrl: string,
    params: CursorPaginationInput,
    _totalCount: number,
  ): PaginationLinks {
    const limit = params.limit ?? params.defaultLimit ?? this.configFactory.getDefaultLimit();

    const buildUrl = (cursor?: string): string => {
      const separator = baseUrl.includes('?') ? '&' : '?';
      if (cursor) {
        return `${baseUrl}${separator}cursor=${cursor}&limit=${limit}`;
      }
      return `${baseUrl}${separator}limit=${limit}`;
    };

    return {
      self: buildUrl(params.cursor),
      next: undefined,
      previous: params.cursor ? buildUrl(undefined) : undefined,
    };
  }

  getSkip(_params: CursorPaginationInput): number {
    return 0;
  }
}
