import { PipeTransform, Injectable } from '@nestjs/common';
import { sortingSchema } from '@tienda/schemas';

export interface SortingInput {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SortingOutput {
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

@Injectable()
export class SortingPipe implements PipeTransform<SortingInput> {
  transform(value: SortingInput): SortingOutput {
    return sortingSchema.parse(value ?? {});
  }
}
