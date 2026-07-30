# @tienda/logger

Sistema de logging centralizado. Única API de logging del proyecto. Prohíbe `console.log/error/warn` en toda la base de código.

---

## Árbol completo

```
packages/logger/
├── package.json
├── tsconfig.json
│
└── src/
    ├── index.ts                 # Barrel export
    │
    ├── types/
    │   └── index.ts             # Logger, LogEntry, LogLevel, LoggerConfig
    │
    ├── constants/
    │   └── index.ts             # Niveles, SENSITIVE_KEYS, PINO_LEVELS
    │
    ├── core/
    │   ├── index.ts
    │   ├── pino-logger.ts       # Implementación Pino
    │   ├── pino-options.ts      # Opciones de Pino (pretty/json)
    │   ├── noop-logger.ts       # NullObject para tests
    │   └── logger-factory.ts    # createLogger(config)
    │
    ├── config/
    │   └── index.ts             # Resolver config desde env
    │
    ├── formatters/
    │   ├── index.ts
    │   ├── pretty.ts            # pino-pretty transport
    │   └── json.ts              # JSON estructurado
    │
    ├── serializers/
    │   ├── index.ts
    │   ├── error.ts             # Error → {type, message, stack, cause}
    │   ├── request.ts           # HTTP request → {method, url, headers[redacted], ip}
    │   ├── response.ts          # HTTP response → {statusCode, headers}
    │   └── sensitive.ts         # Redactado recursivo de campos sensibles
    │
    ├── transport/
    │   └── index.ts             # resolveTransport(pretty)
    │
    ├── middleware/
    │   ├── index.ts
    │   ├── correlation.ts       # Correlation ID + Request ID
    │   └── request-logger.ts    # Request/response logging middleware
    │
    ├── interceptors/
    │   ├── index.ts
    │   ├── logging.interceptor.ts    # NestJS: log entrada/salida/error
    │   └── performance.interceptor.ts # NestJS: warn si excede threshold
    │
    ├── providers/
    │   ├── index.ts
    │   ├── logger.token.ts      # Symbol('LOGGER_TOKEN')
    │   ├── logger.provider.ts   # Factory provider
    │   └── logger.module.ts     # @Global() Module
    │
    └── utils/
        ├── index.ts
        ├── redact.ts            # Redactado profundo de objetos
        └── sanitize.ts          # Sanitización de inputs (control chars, max length)
```

---

## Niveles de log

| Nivel | Prioridad | Uso |
|-------|-----------|-----|
| `fatal` | 60 | Error irrecuperable. App va a morir. |
| `error` | 50 | Error recuperable. Operación falló. |
| `warn` | 40 | Algo inesperado. No es error pero requiere atención. |
| `info` | 30 | Evento normal. Operación exitosa. |
| `debug` | 20 | Información detallada para debugging. |
| `trace` | 10 | Tracing interno. Solo desarrollo. |

---

## API de uso

### Logger (básico)

```ts
import { createLogger } from '@tienda/logger';

const log = createLogger({ level: 'debug' });

log.info({ message: 'Servicio iniciado', context: 'Bootstrap' });
log.error({ message: 'Conexión fallida', error: new Error('timeout'), requestId: 'abc' });
```

### Logger child (contextual)

```ts
const orderLog = log.child('OrdersService');
orderLog.info({ message: 'Orden creada', data: { orderId: '123' } });
// → añade context: 'OrdersService' automáticamente
```

### NestJS (DI)

```ts
// app.module.ts
import { LoggerModule } from '@tienda/logger/nest';

@Module({ imports: [LoggerModule] })
export class AppModule {}

// En servicios:
import { Inject } from '@nestjs/common';
import { LOGGER_TOKEN, Logger } from '@tienda/logger';

@Injectable()
export class OrdersService {
  constructor(@Inject(LOGGER_TOKEN) private readonly logger: Logger) {}
}
```

### NestJS Interceptors

```ts
import { LoggingInterceptor, PerformanceInterceptor } from '@tienda/logger';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: PerformanceInterceptor },
  ],
})
export class AppModule {}
```

---

## Política de información sensible

Campos redactados automáticamente (nunca aparecen en logs):

- `password`, `passwd`
- `secret`
- `token`, `jwt`, `refreshToken`
- `apiKey`, `api_key`
- `authorization`, `cookie`
- `creditCard`, `ccv`, `cvv`
- `ssn`, `phone`, `email`
- `privateKey`
- `stripeKey`, `stripe_secret`

El redactado ocurre a dos niveles:
1. **Pino `redact` paths**: a nivel de transporte, antes de escribir
2. **`redactSensitive()`**: serializador para objetos antes de pasarlos al logger

---

## Estrategia de correlación

Cada request genera:
- `requestId`: UUID v4 único por request
- `correlationId`: se propaga desde el header `x-correlation-id` o se genera nuevo

El middleware `correlation.ts` los inyecta en el request y response headers. El `LoggingInterceptor` los propaga automáticamente a todos los logs de ese request.

---

## Formateo

| Entorno | Formato | Transporte |
|---------|---------|-----------|
| Desarrollo | `pretty` | pino-pretty (coloreado, legible) |
| Producción | `json` | JSON estructurado (Loki, Elastic) |

Controlado por `LOG_FORMAT=pretty|json` y `NODE_ENV`.

---

## Flujo del sistema

```
createLogger(config)
    │
    ▼
resolveConfig()
    │  ← LOG_LEVEL, LOG_FORMAT, NODE_ENV
    ▼
new PinoLogger(options)
    │  ← level, prettyPrint, redact paths
    ▼
Pino instance
    │
    ├── .info({ message, requestId, ... })
    │       │
    │       ▼
    │   pino[level]({ ... })
    │       │
    │       ├── redact sensitive fields
    │       ├── format (pretty | json)
    │       └── stdout | file
    │
    └── .child({ context }) → child logger with bindings
```

---

## Convenciones para agregar nuevos campos

1. Agregar el campo a `LogEntry` en `types/index.ts`
2. Agregar el campo a `pino-logger.ts` en el método `write()`
3. Si aplica, agregar a `SENSITIVE_KEYS` en `constants/index.ts`

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| `console.log` usado por error | Logs no estructurados, sin metadata | ESLint rule `no-console` |
| Secrets en mensajes | Exposición de credenciales | `redact` paths + `redactSensitive()` |
| Logging excesivo en producción | Costo de almacenamiento | `LOG_LEVEL=info` filtra debug/trace |
| Objetos circulares en metadata | Error al serializar | `sanitizeLogInput()` antes de loggear |
| Pino bloqueante en alta carga | Performance | Usar `pino.transport` (thread worker) |
| Errores en logs sin stacktrace | Imposible debuggear | `serializeError()` siempre extrae stack |

---

## Recomendaciones

1. **Nunca importar `pino` directamente**. Siempre usar `createLogger()` o DI.
2. **Usar `child()` para contexto** en lugar de pasar `context` manualmente.
3. **En producción**, `LOG_LEVEL=info` y `LOG_FORMAT=json`.
4. **No loggear objetos grandes sin sanitizar**. Usar `sanitizeLogInput()`.
5. **Errores siempre con `error` field**, no en `message`.
6. **Mantener IDs de correlación** en headers HTTP para tracing distribuido futuro.
7. **Para tests**: `createLogger({ enabled: false })` → `NoopLogger`.
