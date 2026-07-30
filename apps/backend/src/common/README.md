# Common — Sistema de Errores

Infraestructura centralizada de manejo de excepciones, filtros globales, códigos de error y formato de respuesta uniforme.

---

## Árbol completo

```
src/common/
├── exceptions/
│   ├── index.ts
│   ├── app.exception.ts               ← Clase base
│   ├── validation.exception.ts        ← 400
│   ├── authentication.exception.ts    ← 401
│   ├── authorization.exception.ts     ← 403
│   ├── not-found.exception.ts         ← 404
│   ├── conflict.exception.ts          ← 409
│   ├── business.exception.ts          ← 422
│   ├── rate-limit.exception.ts        ← 429
│   ├── infrastructure.exception.ts    ← 500
│   ├── database.exception.ts          ← 500
│   ├── cache.exception.ts             ← 500
│   ├── configuration.exception.ts     ← 500
│   ├── external-service.exception.ts  ← 502
│   └── domain-error.exception.ts      ← Backward compat
│
├── filters/
│   ├── index.ts
│   ├── global-exception.filter.ts     ← Filtro único global
│   ├── http-exception.filter.ts       ← Re-export (backward compat)
│   └── domain-error.filter.ts         ← Re-export (backward compat)
│
├── error-codes/
│   ├── index.ts
│   └── codes.ts                       ← Catálogo de 27 códigos
│
├── responses/
│   ├── index.ts
│   ├── error-response.ts              ← ErrorResponse interface
│   └── success-response.ts            ← SuccessResponse interface
│
├── types/
│   └── index.ts                       ← ApiResponse<T> unificado
│
├── interfaces/
│   └── index.ts                       ← AuthenticatedRequest, RequestContext
│
└── constants/
    └── index.ts                       ← HTTP_STATUS_MESSAGES
```

---

## Jerarquía de excepciones

```
Error
  └── AppException (base)
        ├── DomainError (backward compat)
        ├── ValidationException         400
        ├── AuthenticationException     401
        ├── AuthorizationException      403
        ├── NotFoundException           404
        ├── ConflictException           409
        ├── BusinessException           422
        ├── RateLimitException          429
        ├── InfrastructureException     500
        ├── DatabaseException           500
        ├── CacheException              500
        ├── ConfigurationException      500
        └── ExternalServiceException    502
```

Todas extienden `AppException` que provee:
- `code: string` — Código de error único
- `httpStatus: number` — HTTP status code
- `message: string` — Mensaje legible
- `details: Record<string, unknown> | null` — Detalles adicionales

---

## Convención de Error Codes

Formato: `{DOMINIO}_{NÚMERO}` (3 dígitos)

| Prefix | Dominio | Ejemplos |
|--------|---------|----------|
| `AUTH_` | Autenticación / Autorización | `AUTH_001`, `AUTH_005` |
| `VALIDATION_` | Validación de entrada | `VALIDATION_001` |
| `NOT_FOUND_` | Recurso no encontrado | `NOT_FOUND_001` |
| `CONFLICT_` | Conflictos | `CONFLICT_001` |
| `BUSINESS_` | Reglas de negocio | `BUSINESS_001` |
| `DB_` | Base de datos | `DB_001` |
| `CACHE_` | Caché | `CACHE_001` |
| `RATE_LIMIT_` | Rate limiting | `RATE_LIMIT_001` |
| `EXTERNAL_` | Servicios externos | `EXTERNAL_001` |
| `INFRA_` | Infraestructura | `INFRA_001` |
| `CONFIG_` | Configuración | `CONFIG_001` |
| `HTTP_ERROR` | Fallback genérico | `HTTP_ERROR` |

---

## Flujo de captura de excepciones

```
Request
  │
  ▼
GlobalExceptionFilter (catch ALL)
  │
  ├── AppException → handleAppException()
  │     → ErrorResponse { statusCode, errorCode, message, details }
  │
  ├── HttpException (NestJS) → handleHttpException()
  │     → ErrorResponse { statusCode, errorCode: resolveCodeFromStatus(), message }
  │
  └── Unknown Error → handleUnknownError()
        → Dev:   { statusCode: 500, errorCode: INFRA_001, message: original message }
        → Prod:  { statusCode: 500, errorCode: INFRA_001, message: "Internal server error" }
```

---

## Formato de respuesta único

### Error

```json
{
  "success": false,
  "statusCode": 422,
  "errorCode": "BUSINESS_001",
  "message": "Stock insuficiente",
  "timestamp": "2026-07-29T12:00:00.000Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "requestId": "abc-123",
  "correlationId": "def-456",
  "details": { "available": 5, "requested": 10 }
}
```

### Success (TransformInterceptor)

```json
{
  "success": true,
  "data": { "id": "ord-001" },
  "timestamp": "2026-07-29T12:00:00.000Z",
  "path": "/api/v1/orders",
  "method": "POST",
  "requestId": "abc-123",
  "correlationId": "def-456"
}
```

---

## Integración con Logger

El `GlobalExceptionFilter` no incluye logging directo (es responsabilidad del `LoggingInterceptor` en `packages/logger`). El flujo es:

1. `LoggingInterceptor` atrapa la respuesta
2. Si hay error, llama `logger.error()` con el error serializado
3. Luego el `GlobalExceptionFilter` serializa la respuesta HTTP

Para logging explícito desde el catch del filtro, se puede extender el `GlobalExceptionFilter` con inyección de `@Inject(LOGGER_TOKEN)`.

---

## Recomendaciones

1. **Siempre lanzar `AppException` o subclase** — nunca `Error` o `HttpException` directamente.
2. **Usar el código de error del catálogo** — no inventar códigos ad-hoc.
3. **`details` para info adicional** — nunca para stack traces o datos sensibles.
4. **No capturar `AppException` en servicios** — deja que el filtro global lo maneje.
5. **Para errores de infraestructura** (DB, cache, externo) usar las subclases específicas.
6. **`BusinessException` para reglas del dominio** — `422` + código `BUSINESS_*`.

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Stack trace en producción | Exposición de implementación | `handleUnknownError` oculta detalles en producción |
| Error code incorrecto | Debug confuso | Catálogo centralizado en `error-codes/codes.ts` |
| Filtro global no registrado | Errores sin formatear | Registrar `GlobalExceptionFilter` como `APP_FILTER` |
| Logger no disponible en filter | Errores sin registro | Usar `LoggingInterceptor` + `LoggerModule` global |
