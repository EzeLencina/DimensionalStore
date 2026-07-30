import { Injectable } from '@nestjs/common';
import type { SortingParams, SortingInput, SortField } from '../types';
import type { ISortingService } from '../interfaces';
import { ApiInvalidSortingException } from '../exceptions';

@Injectable()
export class SortingService implements ISortingService {
  parse(input: SortingInput): SortingParams {
    if (!input.sort) {
      return { sort: input.defaultSort ?? [] };
    }

    const fields = input.sort.split(',');
    const sort: SortField[] = [];

    for (const field of fields) {
      const trimmed = field.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('-')) {
        sort.push({ field: trimmed.slice(1), direction: 'DESC' });
      } else if (trimmed.startsWith('+')) {
        sort.push({ field: trimmed.slice(1), direction: 'ASC' });
      } else {
        sort.push({ field: trimmed, direction: 'ASC' });
      }
    }

    return { sort: sort.length > 0 ? sort : (input.defaultSort ?? []) };
  }

  validate(params: SortingParams, allowedFields: string[]): void {
    for (const sortField of params.sort) {
      if (!allowedFields.includes(sortField.field)) {
        throw new ApiInvalidSortingException(
          `Sort field "${sortField.field}" is not allowed`,
          { field: sortField.field, allowedFields },
        );
      }
    }
  }

  buildQuery(params: SortingParams): Record<string, 'asc' | 'desc'> {
    const query: Record<string, 'asc' | 'desc'> = {};

    for (const sortField of params.sort) {
      query[sortField.field] = sortField.direction === 'ASC' ? 'asc' : 'desc';
    }

    return query;
  }

  addSort(sorts: SortField[], field: string, direction: 'ASC' | 'DESC'): SortField[] {
    const existing = sorts.findIndex(s => s.field === field);
    if (existing >= 0) {
      sorts[existing] = { field, direction };
      return [...sorts];
    }
    return [...sorts, { field, direction }];
  }
}
