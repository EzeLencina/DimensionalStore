import { PipeTransform, Injectable } from '@nestjs/common';
import type { OffsetPaginationInput } from '../types';
import { OffsetPaginationService } from '../pagination/offset-pagination.service';
import { API_DEFAULTS } from '../constants/api-defaults';

@Injectable()
export class PaginationPipe implements PipeTransform {
  constructor(private readonly paginationService: OffsetPaginationService) {}

  transform(value: Record<string, unknown>): OffsetPaginationInput {
    const page = value['page'] ? Number(value['page']) : API_DEFAULTS.DEFAULT_PAGE;
    const limit = value['limit'] ? Number(value['limit']) : API_DEFAULTS.DEFAULT_LIMIT;

    const params: OffsetPaginationInput = {
      page: isNaN(page) ? API_DEFAULTS.DEFAULT_PAGE : page,
      limit: isNaN(limit) ? API_DEFAULTS.DEFAULT_LIMIT : limit,
    };

    this.paginationService.validate(params);
    return params;
  }
}
