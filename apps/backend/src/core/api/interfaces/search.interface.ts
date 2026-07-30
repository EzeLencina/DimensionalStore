import type { SearchParams, SearchInput } from '../types';

export interface ISearchService {
  parse(input: SearchInput): SearchParams;

  validate(params: SearchParams): void;

  buildQuery(params: SearchParams): Record<string, unknown>;

  isSearchable(input: SearchInput): boolean;
}
