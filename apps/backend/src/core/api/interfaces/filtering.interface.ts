import type { FilteringParams, FilteringInput, FilterCondition, FilterGroup } from '../types';

export interface IFilteringService {
  parse(input: FilteringInput): FilteringParams;

  validate(params: FilteringParams, allowedFields: string[]): void;

  buildQuery(params: FilteringParams): Record<string, unknown>;

  addCondition(group: FilterGroup, condition: FilterCondition): FilterGroup;

  createGroup(logic: 'AND' | 'OR', conditions?: FilterCondition[]): FilterGroup;
}
