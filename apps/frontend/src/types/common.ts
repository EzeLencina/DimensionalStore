export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type SortDirection = 'asc' | 'desc';

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: SortDirection;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
