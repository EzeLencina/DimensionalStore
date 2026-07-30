import { Injectable } from '@nestjs/common';
import type { FieldSelectionParams, FieldSelectionInput } from '../types';
import type { IFieldSelectionService } from '../interfaces';
import { ApiInvalidFieldSelectionException } from '../exceptions';

@Injectable()
export class FieldSelectionService implements IFieldSelectionService {
  parse(input: FieldSelectionInput): FieldSelectionParams {
    return {
      fields: input.fields ? input.fields.split(',').map(f => f.trim()).filter(Boolean) : undefined,
      expand: input.expand ? input.expand.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      include: input.include ? input.include.split(',').map(i => i.trim()).filter(Boolean) : undefined,
      exclude: input.exclude ? input.exclude.split(',').map(e => e.trim()).filter(Boolean) : undefined,
    };
  }

  validate(params: FieldSelectionParams, allowedFields: string[]): void {
    const allSelected = [
      ...(params.fields ?? []),
      ...(params.include ?? []),
      ...(params.exclude ?? []),
    ];

    for (const field of allSelected) {
      if (!allowedFields.includes(field)) {
        throw new ApiInvalidFieldSelectionException(
          `Field "${field}" is not selectable`,
          { field, allowedFields },
        );
      }
    }
  }

  filterFields<T extends Record<string, unknown>>(data: T, fields: string[]): Partial<T> {
    const result: Record<string, unknown> = {};

    for (const field of fields) {
      if (field in data) {
        result[field] = data[field];
      }
    }

    return result as Partial<T>;
  }

  expandFields<T extends Record<string, unknown>>(
    data: T,
    expand: string[],
  ): T & Record<string, unknown> {
    const result: Record<string, unknown> = { ...data };

    for (const field of expand) {
      if (field in data && typeof (data as Record<string, unknown>)[field] === 'object' && (data as Record<string, unknown>)[field] !== null) {
        result[`_${field}`] = (data as Record<string, unknown>)[field];
      }
    }

    return result as T & Record<string, unknown>;
  }
}
