export type SearchMode = 'global' | 'field' | 'fulltext';

export interface GlobalSearchParams {
  query: string;
  mode: 'global';
}

export interface FieldSearchParams {
  query: string;
  mode: 'field';
  fields: string[];
}

export type SearchParams = GlobalSearchParams | FieldSearchParams;

export interface SearchInput {
  search?: string;
  searchFields?: string;
  mode?: SearchMode;
  minLength?: number;
  maxLength?: number;
}
