import { PipeTransform, Injectable } from '@nestjs/common';
import { paginationSchema } from '@tienda/schemas';

export interface PaginationInput {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOutput {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  skip: number;
}

@Injectable()
export class PaginationPipe implements PipeTransform<PaginationInput> {
  transform(value: PaginationInput): PaginationOutput {
    const parsed = paginationSchema.parse(value ?? {});

    return {
      page: parsed.page,
      perPage: parsed.perPage,
      sortBy: parsed.sortBy,
      sortOrder: parsed.sortOrder,
      skip: (parsed.page - 1) * parsed.perPage,
    };
  }
}
