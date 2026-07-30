# Observabilidad

## Logger

**Technology**: Pino 9+ via `@tienda/logger`

### Niveles

| Nivel | Uso |
|-------|-----|
| `fatal` | Error irrecuperable, app crashes |
| `error` | Error de operación, excepción no manejada |
| `warn` | Condición anormal, degradación |
| `info` | Información general, inicio/fin operaciones |
| `debug` | Detalle para debugging (solo dev) |
| `trace` | Traza completa (solo dev) |

### Contexto

Cada log incluye:
- `context`: módulo/clase que genera el log
- `requestId`: ID de la petición (si aplica)
- `correlationId`: ID de correlación cross-service
- `timestamp`: ISO 8601

```typescript
this.logger.info('Product created', {
  context: 'ProductService',
  productId: 'abc-123',
});
```

## Tracing

Por implementar en fase futura:
- OpenTelemetry
- Distributed tracing cross-module
- Trace ID propagation via headers

Actualmente:
- `CorrelationIdMiddleware` inyecta `x-correlation-id`
- `RequestIdMiddleware` inyecta `x-request-id`
- `TracingInterceptor` inyecta `x-trace-id`

## Health Checks

**Endpoint**: `GET /health`

| Indicador | Source | Info |
|-----------|--------|------|
| Database | PrismaService | Conectado, pool usage |
| Redis | RedisHealthIndicator | Conectado, latencia |
| Queue | QueueHealthService | Redis colas, workers |
| Storage | StorageHealthService | Driver activo |
| Http | HttpHealthService | Driver activo |
| Mail | MailHealthService | Driver activo |
| Api | ApiHealthService | Response time |

## Errores

### Jerarquía

```
AppException (base)
├── HttpException variants (4xx, 5xx)
├── DomainError (business rules)
│   ├── BusinessRuleViolation
│   ├── NotFoundError
│   └── UnauthorizedError
└── Core exceptions (by module)
    ├── RedisException
    ├── QueueException
    ├── StorageException
    ├── MailException
    ├── HttpException (HTTP client)
    └── ApiException
```

### Formato Error Response

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

### Códigos de Error por Módulo

| Módulo | Rango | Ejemplos |
|--------|-------|----------|
| HTTP | HTTP_001-015 | HTTP_001 = timeout |
| API | API_001-018 | API_003 = invalid pagination |
| Redis | REDIS_001-020 | REDIS_001 = connection error |
| Queue | QUEUE_001-006 | QUEUE_001 = unavailable |
| Storage | STORAGE_001-007 | STORAGE_001 = upload failed |
| Mail | MAIL_001-010 | MAIL_001 = send failed |

## Métricas

Por implementar en fase futura:
- Prometheus metrics
- Request rate, error rate, latency (P50, P95, P99)
- Queue depth
- Connection pool usage
- Cache hit ratio
- Business metrics (orders/min, products added)
