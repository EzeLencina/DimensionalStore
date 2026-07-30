import { Global, Module } from '@nestjs/common';
import { ApiConfigurationFactory } from './config';
import { ResponseBuilder } from './builders/response.builder';
import { UriVersioningService, HeaderVersioningService, MediaTypeVersioningService } from './versioning';
import { OffsetPaginationService, CursorPaginationService } from './pagination';
import { FilteringService } from './filtering';
import { SortingService } from './sorting';
import { SearchService } from './search';
import { FieldSelectionService } from './field-selection';
import { MetadataService } from './metadata';
import { JsonSerializer, CsvSerializer, XmlSerializer } from './serializers';
import { OpenApiService } from './openapi';
import { ApiHealthService } from './health';
import { ResponseFormatInterceptor, ExecutionTimeInterceptor, MetadataInterceptor, ApiVersionInterceptor } from './interceptors';
import { PaginationPipe, SortingPipe, FilteringPipe, SearchPipe, FieldSelectionPipe } from './pipes';
import { apiProviders } from './providers';

@Global()
@Module({
  providers: [
    ApiConfigurationFactory,
    ResponseBuilder,
    UriVersioningService,
    HeaderVersioningService,
    MediaTypeVersioningService,
    OffsetPaginationService,
    CursorPaginationService,
    FilteringService,
    SortingService,
    SearchService,
    FieldSelectionService,
    MetadataService,
    JsonSerializer,
    CsvSerializer,
    XmlSerializer,
    OpenApiService,
    ApiHealthService,
    ResponseFormatInterceptor,
    ExecutionTimeInterceptor,
    MetadataInterceptor,
    ApiVersionInterceptor,
    PaginationPipe,
    SortingPipe,
    FilteringPipe,
    SearchPipe,
    FieldSelectionPipe,
    ...apiProviders,
  ],
  exports: [
    ApiConfigurationFactory,
    ResponseBuilder,
    UriVersioningService,
    HeaderVersioningService,
    MediaTypeVersioningService,
    OffsetPaginationService,
    CursorPaginationService,
    FilteringService,
    SortingService,
    SearchService,
    FieldSelectionService,
    MetadataService,
    JsonSerializer,
    CsvSerializer,
    XmlSerializer,
    OpenApiService,
    ApiHealthService,
    ResponseFormatInterceptor,
    ExecutionTimeInterceptor,
    MetadataInterceptor,
    ApiVersionInterceptor,
    PaginationPipe,
    SortingPipe,
    FilteringPipe,
    SearchPipe,
    FieldSelectionPipe,
  ],
})
export class ApiModule {}
