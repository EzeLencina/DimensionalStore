import type { PaginationMeta, PaginationLinks, OffsetPaginationInput, CursorPaginationInput } from '../types';

export interface IPaginationService {
  readonly type: 'offset' | 'cursor';

  buildMeta(
    totalCount: number,
    params: OffsetPaginationInput | CursorPaginationInput,
  ): PaginationMeta;

  buildLinks(
    baseUrl: string,
    params: OffsetPaginationInput | CursorPaginationInput,
    totalCount: number,
  ): PaginationLinks;

  validate(params: OffsetPaginationInput | CursorPaginationInput): void;

  getSkip(params: OffsetPaginationInput | CursorPaginationInput): number;
}
