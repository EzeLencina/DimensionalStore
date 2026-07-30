# API — Diseño REST

## Base URL

```
/api/v1/{resource}
```

## Versionado

- **Default**: URI path (`/api/v1/resource`)
- **Estrategia**: `VersioningType.URI` con prefijo `v`
- **Soporte**: Header (`x-api-version`) y Media Type (`Accept: application/vnd.tienda.v1+json`)
- **Config**: `API_VERSIONING_TYPE` env var

## Convenciones

- **Nouns plural**: `/products`, `/orders`, `/users`
- **SKU como identifier**: `/products/{sku}`
- **Snake_case params**: `?page=1&limit=20`
- **No verbs**: `POST /products` (crear), no `POST /products/create`
- **Nested resources**: `/customers/{id}/addresses`

## Response Envelope

### Success

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

### Paginated

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

### Error

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

## Pagination

| Tipo | Parámetros | Descripción |
|------|-----------|-------------|
| Offset | `?page=1&limit=20` | Tradicional page/limit |
| Cursor | `?cursor=abc&limit=20` | Cursor-based (real-time) |

## Filtering

16 operadores via JSON:

```
?filter=[{"logic":"AND","conditions":[{"field":"status","operator":"eq","value":"active"}]}]
```

| Operador | Descripción |
|----------|-------------|
| `eq`, `neq` | Igualdad |
| `contains`, `not_contains` | Substring |
| `starts_with`, `ends_with` | Prefijo/sufijo |
| `gt`, `gte`, `lt`, `lte` | Comparación |
| `in`, `not_in` | Lista |
| `between`, `date_between` | Rango |
| `is_null`, `is_not_null` | Nulo |

## Sorting

Multi-columna con prefijo:

```
?sort=-createdAt,+name,id
```

| Prefijo | Dirección |
|---------|-----------|
| `+` o ninguno | ASC |
| `-` | DESC |

## Search

```
?search=term
?search=term&mode=global
?search=field:term&mode=field
```

## Field Selection

```
?fields=id,name,price
?expand=category,variants
?include=customer,items
?exclude=internalNotes
```

## HTTP Status Codes

| Código | Uso |
|--------|-----|
| 200 | Success |
| 201 | Created |
| 204 | No Content (delete) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |
| 504 | Gateway Timeout |

## Headers

| Header | Descripción |
|--------|-------------|
| `x-request-id` | Request ID (generado) |
| `x-correlation-id` | Correlation ID (cliente) |
| `x-api-version` | Versión de API |
| `x-tenant-slug` | Slug del tenant |
| `x-csrf-token` | CSRF token |
| `x-idempotency-key` | Idempotency key |
| `Authorization` | Bearer JWT token |

## Swagger/OpenAPI

Documentación interactiva en `/api/docs` cuando el servidor está corriendo.
