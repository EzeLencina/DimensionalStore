import { Injectable } from '@nestjs/common';
import type { SearchParams, SearchInput } from '../types';
import type { ISearchService } from '../interfaces';
import { ApiInvalidSearchException } from '../exceptions';

@Injectable()
export class SearchService implements ISearchService {
  parse(input: SearchInput): SearchParams {
    if (!input.search) {
      throw new ApiInvalidSearchException('Search query is required');
    }

    const mode = input.mode ?? 'global';

    if (mode === 'field') {
      const fields = input.searchFields
        ? input.searchFields.split(',').map(f => f.trim()).filter(Boolean)
        : [];

      if (fields.length === 0) {
        throw new ApiInvalidSearchException(
          'Search fields are required for field search mode',
          { searchFields: input.searchFields },
        );
      }

      return { query: input.search, mode: 'field', fields };
    }

    return { query: input.search, mode: 'global' };
  }

  validate(params: SearchParams): void {
    const minLength = 2;
    const maxLength = 200;

    if (params.query.length < minLength) {
      throw new ApiInvalidSearchException(
        `Search query must be at least ${minLength} characters`,
        { query: params.query, minLength },
      );
    }

    if (params.query.length > maxLength) {
      throw new ApiInvalidSearchException(
        `Search query must not exceed ${maxLength} characters`,
        { query: params.query, maxLength },
      );
    }
  }

  buildQuery(params: SearchParams): Record<string, unknown> {
    if (params.mode === 'field') {
      return {
        search: params.query,
        searchFields: params.fields,
        mode: 'field',
      };
    }

    return {
      search: params.query,
      mode: 'global',
    };
  }

  isSearchable(input: SearchInput): boolean {
    return !!input.search && input.search.length >= 2;
  }
}
