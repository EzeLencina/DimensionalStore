# API Module — Infraestructura REST Estandarizada

Módulo completamente desacoplado que provee la infraestructura base para todas las APIs REST de la plataforma Tienda. Define el estándar único para respuestas, versionado, paginación, filtrado, ordenamiento, búsqueda, selección de campos, metadatos y documentación OpenAPI.

---

## 1. Árbol del Módulo

```
src/core/api/
├── index.ts                          # Barrel export público
├── api.module.ts                    # Módulo NestJS @Global()
├── README.md                        # Documentación
│
├── config/
│   └── index.ts                     # ApiConfigurationFactory
│
├── types/
│   ├── index.ts                     # Barrel
│   ├── response.types.ts            # ApiResponse, ApiPaginatedResponse, ApiErrorResponse
│   ├── pagination.types.ts          # OffsetPaginationParams, CursorPaginationParams, PaginationMeta
│   ├── sorting.types.ts             # SortField, SortDirection, SortingParams
│   ├── filtering.types.ts           # FilterCondition, FilterGroup, FilterOperator
│   ├── search.types.ts              # SearchParams, SearchMode
│   ├── metadata.types.ts            # RequestMetadata, RateLimitMetadata
│   ├── versioning.types.ts          # VersioningType, ApiVersion, VersioningConfig
│   └── field-selection.types.ts     # FieldSelectionParams, FieldSelectionInput
│
├── interfaces/
│   ├── index.ts                     # Barrel
│   ├── response.interface.ts        # IResponseBuilder
│   ├── versioning.interface.ts      # IVersioningService
│   ├── pagination.interface.ts      # IPaginationService
│   ├── filtering.interface.ts       # IFilteringService
│   ├── sorting.interface.ts         # ISortingService
│   ├── search.interface.ts          # ISearchService
│   ├── metadata.interface.ts        # IMetadataService
│   └── field-selection.interface.ts # IFieldSelectionService
│
├── builders/
│   └── index.ts                     # ResponseBuilder
│
├── responses/
│   └── index.ts                     # createSuccessResponse, createSuccessResponseWithMeta
│
├── versioning/
│   ├── index.ts                     # Barrel
│   ├── uri-versioning.service.ts    # Versionado por URI (/v1/resource)
│   ├── header-versioning.service.ts # Versionado por Header (x-api-version)
│   └── media-type-versioning.service.ts  # Versionado por Media Type (Accept: application/vnd.tienda.v1+json)
│
├── pagination/
│   ├── index.ts                     # Barrel
│   ├── offset-pagination.service.ts # Paginación offset (page/limit)
│   └── cursor-pagination.service.ts # Paginación por cursor
│
├── filtering/
│   └── index.ts                     # FilteringService (16 operadores)
│
├── sorting/
│   └── index.ts                     # SortingService (multi-columna, ASC/DESC)
│
├── search/
│   └── index.ts                     # SearchService (global, field)
│
├── field-selection/
│   └── index.ts                     # FieldSelectionService (fields, expand, include, exclude)
│
├── metadata/
│   └── index.ts                     # MetadataService (requestId, correlationId, timing)
│
├── decorators/
│   ├── index.ts                     # Barrel
│   ├── api-pagination.decorator.ts  # @ApiPagination()
│   ├── api-sorting.decorator.ts     # @ApiSorting()
│   ├── api-filtering.decorator.ts   # @ApiFiltering()
│   ├── api-search.decorator.ts      # @ApiSearch()
│   ├── api-response.decorator.ts    # @ApiStandardResponse(), @ApiArrayResponse(), @ApiPaginatedResponse()
│   ├── api-version.decorator.ts     # @ApiVersion()
│   ├── api-metadata.decorator.ts    # @ApiMetadata()
│   └── api-field-selection.decorator.ts  # @ApiFieldSelection()
│
├── interceptors/
│   ├── index.ts                     # Barrel
│   ├── response-format.interceptor.ts   # Envuelve respuestas en formato estándar
│   ├── execution-time.interceptor.ts    # Mide y logea tiempo de ejecución
│   ├── metadata.interceptor.ts          # Inyecta executionTime en meta
│   └── api-version.interceptor.ts       # Inyecta x-api-version header
│
├── pipes/
│   ├── index.ts                     # Barrel
│   ├── pagination.pipe.ts           # Transforma query params → OffsetPaginationInput
│   ├── sorting.pipe.ts              # Transforma ?sort → SortingParams
│   ├── filtering.pipe.ts            # Transforma ?filter → FilteringParams
│   ├── search.pipe.ts               # Transforma ?search → SearchParams
│   └── field-selection.pipe.ts      # Transforma ?fields → FieldSelectionParams
│
├── serializers/
│   ├── index.ts                     # Barrel
│   ├── json.serializer.ts           # JSON (funcional)
│   ├── csv.serializer.ts            # CSV (funcional)
│   └── xml.serializer.ts            # XML (funcional, básico)
│
├── swagger/
│   ├── index.ts                     # Barrel
│   ├── api-tags.ts                  # Tag constants
│   ├── swagger.config.ts            # DocumentBuilder + custom options
│   └── swagger.setup.ts             # setupSwagger() bootstrap
│
├── openapi/
│   └── index.ts                     # OpenApiService
│
├── health/
│   └── index.ts                     # ApiHealthService
│
├── providers/
│   └── index.ts                     # apiProviders (DI tokens)
│
├── constants/
│   ├── index.ts                     # Barrel
│   ├── api-tokens.ts                # API_TOKENS — 22 Symbol tokens
│   ├── api-defaults.ts              # API_DEFAULTS — valores por defecto
│   └── api-error-codes.ts           # API_ERROR_CODES — 18 códigos (API_001-018)
│
├── exceptions/
│   └── index.ts                     # 10 excepciones que extienden AppException
│
└── utils/
    └── index.ts                     # ApiUrlBuilder
```

---

## 2. Arquitectura REST

```
Request Flow:
┌────────────────────────────────────────────────────────────────────┐
│  HTTP Request                                                      │
│    │                                                               │
│    ▼                                                               │
│  [NestJS Router] → [Guards] → [Interceptors] → [Pipes] → [Handler]│
│                                            │                       │
│                              ┌─────────────┘                       │
│                              ▼                                     │
│                       [Response Returned]                           │
│                              │                                     │
│                              ▼                                     │
│  [ApiVersionInterceptor]  ← inyecta x-api-version header           │
│  [ResponseFormatInterceptor] ← envuelve en ApiResponse estándar    │
│  [ExecutionTimeInterceptor] ← logea tiempo de ejecución            │
│  [MetadataInterceptor] ← inyecta executionTimeMs en meta           │
│                              │                                     │
│                              ▼                                     │
│  HTTP Response (formato estándar unificado)                        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estrategia de Versionado

| Tipo | Mecanismo | Ejemplo |
|---|---|---|
| **URI** | Prefijo en la ruta | `/api/v1/products` |
| **Header** | Header HTTP | `x-api-version: 1.0` |
| **Media Type** | Accept header | `Accept: application/vnd.tienda.v1+json` |

Configuración vía `ApiConfigurationFactory`:

| Variable | Default | Descripción |
|---|---|---|
| `API_VERSIONING_TYPE` | `uri` | `uri`, `header`, `media-type` |
| `API_DEFAULT_VERSION` | `1.0` | Versión por defecto |
| `API_SUPPORTED_VERSIONS` | `1.0` | Versiones soportadas (csv) |
| `API_VERSION_HEADER` | `x-api-version` | Nombre del header (solo header) |

Futuro: coexistencia de versiones via `compare(v1, v2)`, deprecation warnings, sunset headers.

---

## 4. Convención de Responses

### Respuesta Exitosa (200/201)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "correlationId": "uuid",
    "version": "1.0",
    "executionTimeMs": 42
  },
  "timestamp": "2026-07-29T12:00:00.000Z"
}
```

### Respuesta Paginada

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resources retrieved successfully",
  "data": [ ... ],
  "meta": {
    "pagination": {
      "type": "offset",
      "page": 1,
      "limit": 20,
      "totalCount": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2026-07-29T12:00:00.000Z"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid pagination parameters",
  "error": {
    "code": "API_003",
    "details": { "limit": 500, "maxLimit": 100 }
  },
  "timestamp": "2026-07-29T12:00:00.000Z",
  "requestId": "uuid"
}
```

---

## 5. Estrategia de Pagination

| Tipo | Parámetros | Descripción |
|---|---|---|
| **Offset** | `?page=1&limit=20` | Paginación tradicional con page/limit |
| **Cursor** | `?cursor=abc&limit=20` | Paginación basada en cursor (ideal para tiempo real) |

`OffsetPaginationService`:
- `validate()` — límites configurables
- `buildMeta()` — genera metadatos (page, totalCount, totalPages, hasNextPage, hasPreviousPage)
- `buildLinks()` — genera links HATEOAS (self, first, last, next, previous)
- `getSkip()` — calcula offset para queries

---

## 6. Estrategia de Filtering

16 operadores soportados:

| Operador | Descripción |
|---|---|
| `eq` | Igualdad exacta |
| `neq` | No igual |
| `contains` | Contiene substring |
| `not_contains` | No contiene |
| `starts_with` | Empieza con |
| `ends_with` | Termina con |
| `gt`, `gte`, `lt`, `lte` | Comparación numérica/fecha |
| `in`, `not_in` | En lista / no en lista |
| `between` | Rango numérico |
| `date_between` | Rango de fechas |
| `is_null` | Es nulo |
| `is_not_null` | No es nulo |

**Formato**: JSON con grupos AND/OR

```
?filter=[{"logic":"AND","conditions":[{"field":"status","operator":"eq","value":"active"}]}]
```

---

## 7. Estrategia de Sorting

Multi-columna, formato similar a GitHub:

| Prefijo | Dirección |
|---|---|
| `+` o ninguno | ASC |
| `-` | DESC |

```
?sort=-createdAt,+name,id
```

---

## 8. Estrategia de OpenAPI

Swagger se configura en `swagger/swagger.config.ts` y se arranca con `setupSwagger()`:

```typescript
// main.ts
import { setupSwagger } from '@core/api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(4000);
}
```

Características:
- OpenAPI 3.1
- Bearer JWT Auth
- API Key Auth
- Tags globales
- Schema de respuestas estándar
- operationId con formato `Controller_method`

---

## 9. Convenciones para Nuevos Endpoints

### Controller básico

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ApiPagination,
  ApiSorting,
  ApiFiltering,
  ApiSearch,
  ApiStandardResponse,
  ApiPaginatedResponse,
  PaginationPipe,
  SortingPipe,
  FilteringPipe,
  SearchPipe,
  OffsetPaginationInput,
  SortingParams,
  FilteringParams,
  SearchParams,
} from '@core/api';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiPagination()
  @ApiSorting(['name', 'createdAt', 'price'])
  @ApiFiltering()
  @ApiSearch()
  @ApiPaginatedResponse(ProductDto)
  async findAll(
    @Query(PaginationPipe) pagination: OffsetPaginationInput,
    @Query(SortingPipe) sorting: SortingParams,
    @Query(FilteringPipe) filtering: FilteringParams,
    @Query(SearchPipe) search: SearchParams | null,
  ) {
    return this.productService.findAll({ pagination, sorting, filtering, search });
  }
}
```

### Response Builder

```typescript
import { ResponseBuilder } from '@core/api';

@Injectable()
export class ProductService {
  constructor(private readonly responseBuilder: ResponseBuilder) {}

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.create({ data });
    return this.responseBuilder.created(product, 'Product created successfully');
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return this.responseBuilder.deleted('Product deleted successfully');
  }
}
```

---

## 10. Riesgos Detectados

1. **Versionado**: Los tres tipos (URI, header, media-type) están implementados pero no hay un mecanismo automático de ruteo. El controller debe usar `@Controller({ version: '1' })`. La detección del tipo de versionado es manual vía `ApiConfigurationFactory`.
2. **Cursor pagination**: La implementación actual de `CursorPaginationService` es un esqueleto básico. No incluye decodificación/encoding real de cursores. Requiere integración con la base de datos.
3. **Filtering**: El JSON filter es frágil. En producción considerar un query builder tipado o DSL en lugar de JSON plano.
4. **Swagger**: `createSwaggerConfig()` usa `addGlobalParameters()` que no existe en la API actual de `@nestjs/swagger` — requiere validación al integrar. El server URL está hardcodeado a `localhost`.
5. **Serializers CSV/XML**: Implementaciones básicas funcionales pero sin integración con NestJS content negotiation (`Accept` header).
6. **Field Selection**: `expandFields` asume que los campos expandidos existen en el objeto. La validación profunda de schemas es responsabilidad del módulo de negocio.
7. **Rate limit metadata**: `RateLimitMetadata` está tipado pero no hay integración real con el módulo de rate limiting existente. El interceptor de metadata no lo inyecta automáticamente.
8. **Dependencia cíclica potencial**: Si un módulo de negocio importa `ApiModule` y `ApiModule` depende de un servicio de negocio, se genera ciclo. `ApiModule` no debe depender de módulos de negocio.

---

## 11. Recomendaciones

1. **Versionado automático**: Implementar un `VersioningResolver` que unifique los 3 tipos de versionado en un solo interceptor, detectando automáticamente el tipo configurado.
2. **Pipes globales**: Registrar `PaginationPipe`, `SortingPipe`, `FilteringPipe`, `SearchPipe`, `FieldSelectionPipe` como globales en `api.module.ts` con `APP_PIPE` para evitar repetirlos en cada controller.
3. **Interceptores globales**: Lo mismo para `ResponseFormatInterceptor`, `ExecutionTimeInterceptor`, `MetadataInterceptor`, `ApiVersionInterceptor` usando `APP_INTERCEPTOR`.
4. **Content negotiation**: Implementar un `ContentNegotiationInterceptor` que lea `Accept` header y use `JsonSerializer`/`CsvSerializer`/`XmlSerializer` según corresponda.
5. **Pruebas**: Escribir tests unitarios para `ResponseBuilder`, `OffsetPaginationService`, `SortingService`, `FilteringService`, `SearchService`.
6. **Generación SDK**: Preparar `openapi-generator` o `orval` config para generar SDK/clientes automáticamente desde el schema OpenAPI.
7. **Documentación de errores**: Expandir `setupSwagger()` para incluir schemas de error globales (`ApiErrorResponse`) en la documentación OpenAPI.
