export type SortDirection = 'ASC' | 'DESC';

export interface SortField {
  field: string;
  direction: SortDirection;
}

export interface SortingParams {
  sort: SortField[];
}

export interface SortingInput {
  sort?: string;
  allowedFields?: string[];
  defaultSort?: SortField[];
}
