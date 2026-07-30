export { ApiModule } from './api.module';
export { ApiConfigurationFactory } from './config';

export { UriVersioningService, HeaderVersioningService, MediaTypeVersioningService } from './versioning';
export { OffsetPaginationService, CursorPaginationService } from './pagination';
export { FilteringService } from './filtering';
export { SortingService } from './sorting';
export { SearchService } from './search';
export { FieldSelectionService } from './field-selection';
export { MetadataService } from './metadata';

export { ResponseBuilder } from './builders/response.builder';
export { JsonSerializer, CsvSerializer, XmlSerializer } from './serializers';
export type { ISerializer } from './serializers/json.serializer';
export { OpenApiService } from './openapi';
export { ApiHealthService } from './health';

export { ResponseFormatInterceptor, ExecutionTimeInterceptor, MetadataInterceptor, ApiVersionInterceptor } from './interceptors';
export { PaginationPipe, SortingPipe, FilteringPipe, SearchPipe, FieldSelectionPipe } from './pipes';

export {
  ApiPagination,
  ApiSorting,
  ApiFiltering,
  ApiSearch,
  ApiStandardResponse,
  ApiArrayResponse,
  ApiPaginatedResponse as ApiPaginatedResponseDecorator,
  ApiVersion as ApiVersionDecorator,
  ApiMetadata,
  ApiFieldSelection,
  API_VERSION_METADATA,
} from './decorators';

export { API_TAGS, API_TAG_DESCRIPTIONS, createSwaggerConfig, swaggerCustomOptions, setupSwagger } from './swagger';
export { apiProviders } from './providers';
export { ApiUrlBuilder } from './utils';

export { API_TOKENS, API_DEFAULTS, API_ERROR_CODES } from './constants';

export type {
  ApiResponse,
  ApiPaginatedResponse,
  ApiErrorResponse,
  ResponseMeta,
  ValidationError,
  ResponseFormat,
} from './types/response.types';

export type {
  PaginationType,
  OffsetPaginationParams,
  CursorPaginationParams,
  PaginationParams,
  PaginationMeta,
  PaginationLinks,
  OffsetPaginationInput,
  CursorPaginationInput,
} from './types/pagination.types';

export type {
  SortDirection,
  SortField,
  SortingParams,
  SortingInput,
} from './types/sorting.types';

export type {
  FilterOperator,
  FilterCondition,
  FilterGroup,
  FilteringParams,
  FilteringInput,
} from './types/filtering.types';

export type {
  SearchMode,
  SearchParams,
  SearchInput,
} from './types/search.types';

export type {
  RequestMetadata,
  RateLimitMetadata,
  ApiMetadataContext,
} from './types/metadata.types';

export type {
  VersioningType,
  ApiVersion,
  VersioningConfig,
  VersionedRequest,
} from './types/versioning.types';

export type {
  FieldSelectionParams,
  FieldSelectionInput,
} from './types/field-selection.types';

export type {
  IResponseBuilder,
  IVersioningService,
  IPaginationService,
  IFilteringService,
  ISortingService,
  ISearchService,
  IMetadataService,
  IFieldSelectionService,
} from './interfaces';

export {
  ApiVersionNotSupportedException,
  ApiVersionNotFoundException,
  ApiInvalidPaginationException,
  ApiInvalidSortingException,
  ApiInvalidFilterException,
  ApiInvalidSearchException,
  ApiInvalidFieldSelectionException,
  ApiInvalidResponseFormatException,
  ApiOpenApiConfigException,
  ApiVersioningConfigException,
} from './exceptions';
