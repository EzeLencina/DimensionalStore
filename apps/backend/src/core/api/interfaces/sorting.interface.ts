import type { SortingParams, SortingInput, SortField } from '../types';

export interface ISortingService {
  parse(input: SortingInput): SortingParams;

  validate(params: SortingParams, allowedFields: string[]): void;

  buildQuery(params: SortingParams): Record<string, 'asc' | 'desc'>;

  addSort(sorts: SortField[], field: string, direction: 'ASC' | 'DESC'): SortField[];
}
