import type { FieldSelectionParams, FieldSelectionInput } from '../types';

export interface IFieldSelectionService {
  parse(input: FieldSelectionInput): FieldSelectionParams;

  validate(params: FieldSelectionParams, allowedFields: string[]): void;

  filterFields<T extends Record<string, unknown>>(data: T, fields: string[]): Partial<T>;

  expandFields<T extends Record<string, unknown>>(
    data: T,
    expand: string[],
  ): T & Record<string, unknown>;
}
