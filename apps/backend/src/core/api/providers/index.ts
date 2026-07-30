import { Provider } from '@nestjs/common';
import { API_TOKENS } from '../constants/api-tokens';
import { UriVersioningService } from '../versioning/uri-versioning.service';
import { OffsetPaginationService } from '../pagination/offset-pagination.service';
import { ResponseBuilder } from '../builders/response.builder';
import { FilteringService } from '../filtering';
import { SortingService } from '../sorting';
import { SearchService } from '../search';
import { FieldSelectionService } from '../field-selection';
import { MetadataService } from '../metadata';

export const apiProviders: Provider[] = [
  { provide: API_TOKENS.RESPONSE_BUILDER, useClass: ResponseBuilder },
  { provide: API_TOKENS.VERSIONING, useClass: UriVersioningService },
  { provide: API_TOKENS.PAGINATION, useClass: OffsetPaginationService },
  { provide: API_TOKENS.FILTERING, useClass: FilteringService },
  { provide: API_TOKENS.SORTING, useClass: SortingService },
  { provide: API_TOKENS.SEARCH, useClass: SearchService },
  { provide: API_TOKENS.FIELD_SELECTION, useClass: FieldSelectionService },
  { provide: API_TOKENS.METADATA, useClass: MetadataService },
];
