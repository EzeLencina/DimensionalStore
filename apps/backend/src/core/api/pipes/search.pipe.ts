import { PipeTransform, Injectable } from '@nestjs/common';
import type { SearchParams } from '../types';
import { SearchService } from '../search';

@Injectable()
export class SearchPipe implements PipeTransform {
  constructor(private readonly searchService: SearchService) {}

  transform(value: Record<string, unknown>): SearchParams | null {
    const search = value['search'] as string | undefined;

    if (!search) return null;

    const searchFields = value['searchFields'] as string | undefined;
    const mode = value['searchMode'] as 'global' | 'field' | undefined;

    const params = this.searchService.parse({ search, searchFields, mode });
    this.searchService.validate(params);
    return params;
  }
}
