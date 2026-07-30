# HTTP Module — Infraestructura de Cliente HTTP

Módulo completamente desacoplado para realizar peticiones HTTP salientes. Independiente del motor subyacente: Undici (funcional), o esqueletos para Axios y Got.

---

## 1. Árbol del Módulo

```
src/core/http/
├── index.ts                          # Barrel export público
├── http.module.ts                    # Módulo NestJS @Global()
├── README.md                         # Documentación
│
├── config/
│   └── index.ts                      # HttpConfigurationFactory
│
├── interfaces/
│   ├── index.ts                      # Barrel
│   ├── http-client.interface.ts      # IHttpClient
│   ├── http-manager.interface.ts     # IHttpManager
│   └── http-service.interface.ts     # IHttpService
│
├── client/
│   └── http-client.ts                # HttpClient (fachada pública)
│
├── drivers/
│   ├── index.ts                      # Barrel
│   ├── base-driver.ts                # BaseHttpDriver abstracto
│   ├── undici.driver.ts              # Undici via fetch (funcional)
│   ├── axios.driver.ts               # Axios (esqueleto)
│   └── got.driver.ts                 # Got (esqueleto)
│
├── factory/
│   └── index.ts                      # HttpDriverFactory
│
├── services/
│   ├── index.ts                      # Barrel
│   ├── http-manager.service.ts       # HttpManagerService
│   └── http.service.ts               # HttpService (fachada)
│
├── builders/
│   └── index.ts                      # RequestBuilder (fluent API)
│
├── middleware/
│   └── index.ts                      # CorrelationId, RequestId, CommonHeaders
│
├── interceptors/
│   └── index.ts                      # Logging, Tracing
│
├── serializers/
│   └── index.ts                      # JsonSerializer
│
├── deserializers/
│   └── index.ts                      # ResponseDeserializer
│
├── policies/
│   ├── index.ts                      # Barrel
│   ├── retry/
│   │   └── index.ts                  # DefaultRetryPolicy + executeWithRetry
│   ├── timeouts/
│   │   └── index.ts                  # DefaultTimeoutPolicy
│   └── circuit-breaker/
│       └── index.ts                  # DefaultCircuitBreaker
│
├── health/
│   └── index.ts                      # HttpHealthService
│
├── providers/
│   └── http-client.provider.ts       # httpClientProvider (DI)
│
├── constants/
│   ├── index.ts                      # Barrel
│   ├── http-tokens.ts                # Tokens DI
│   ├── http-defaults.ts              # Valores por defecto
│   └── http-error-codes.ts           # Códigos de error (HTTP_001-015)
│
├── exceptions/
│   └── index.ts                      # 11 excepciones
│
├── types/
│   ├── index.ts                      # Barrel
│   ├── http.types.ts                 # Tipos base (HttpMethod, HttpDriverType, etc.)
│   ├── request.types.ts              # Tipos de petición/respuesta
│   ├── timing.types.ts               # Tipos de timing
│   └── configuration.types.ts        # HttpConfiguration
│
└── utils/
    ├── index.ts                      # Barrel
    ├── url-builder.ts                # UrlBuilder (fluent)
    └── request-timing.ts             # RequestTimingCollector
```

---

## 2. Arquitectura de Providers

```
[NestJS DI Container]
        │
        ├── HttpConfigurationFactory ← @tienda/config + env vars
        │
        ├── HttpDriverFactory
        │       │
        │       ├── UndiciDriver     ← fetch nativo (funcional)
        │       ├── AxiosDriver      ← Esqueleto (SDK futuro)
        │       └── GotDriver        ← Esqueleto (SDK futuro)
        │
        ├── HttpManagerService      ← gestiona el driver activo
        │
        ├── HttpClient              ← fachada pública (implementa IHttpClient)
        ├── HttpService             ← fachada pública (implementa IHttpService)
        │
        ├── RequestBuilder          ← builder fluent para peticiones
        │
        ├── CorrelationIdMiddleware ← inyecta x-correlation-id
        ├── RequestIdMiddleware     ← inyecta x-request-id
        │
        ├── LoggingInterceptor      ← logs de request/response
        ├── TracingInterceptor      ← inyecta x-trace-id
        │
        ├── JsonSerializer          ← serialización a JSON
        ├── ResponseDeserializer    ← deserialización de respuestas
        │
        ├── DefaultRetryPolicy      ← retry exponential/linear/jitter
        ├── DefaultTimeoutPolicy    ← timeouts configurables
        ├── DefaultCircuitBreaker   ← state machine (closed/open/half-open)
        │
        └── HttpHealthService       ← health check del driver activo
```

---

## 3. Flujo de una Petición

```
┌─────────────────────────────────────────────────────────┐
│  [HttpService.get<T>(url, opts)]                        │
│         │                                               │
│         ▼                                               │
│  [HttpManagerService] ← selecciona driver activo        │
│         │                                               │
│         ▼                                               │
│  [HttpClient] ← fachada que delega al driver            │
│         │                                               │
│         ▼                                               │
│  [LoggingInterceptor] ← log → [TracingInterceptor]      │
│         │                                               │
│         ▼                                               │
│  [CorrelationIdMiddleware] ← inyecta headers            │
│  [RequestIdMiddleware]                                   │
│         │                                               │
│         ▼                                               │
│  [DefaultTimeoutPolicy] ← crea AbortSignal              │
│         │                                               │
│         ▼                                               │
│  [DefaultCircuitBreaker] ← check state                  │
│         │                                               │
│         ▼                                               │
│  [executeWithRetry] ← loop con política de reintentos   │
│         │                                               │
│         ▼                                               │
│  [UndiciDriver.request()] ← fetch(url, opts)            │
│         │                                               │
│         ▼                                               │
│  [ResponseDeserializer] ← parsea respuesta              │
│         │                                               │
│         ▼                                               │
│  [HttpResponse<T>]                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Configuración (Variables de Entorno)

| Variable | Default | Descripción |
|---|---|---|
| `HTTP_DRIVER` | `undici` | Motor HTTP: `undici`, `axios`, `got` |
| `HTTP_BASE_URL` | `""` | Base URL para peticiones relativas |
| `HTTP_TIMEOUT` | `10000` | Timeout general en ms |
| `HTTP_CONNECT_TIMEOUT` | `3000` | Timeout de conexión en ms |
| `HTTP_READ_TIMEOUT` | `10000` | Timeout de lectura en ms |
| `HTTP_WRITE_TIMEOUT` | `10000` | Timeout de escritura en ms |
| `HTTP_MAX_RETRIES` | `3` | Máximo de reintentos automáticos |
| `HTTP_RETRY_DELAY` | `500` | Delay base entre reintentos en ms |
| `HTTP_RETRY_STRATEGY` | `exponential` | Estrategia: `exponential`, `linear`, `jitter` |
| `HTTP_KEEP_ALIVE` | `true` | Conexiones keep-alive |
| `HTTP_MAX_CONNECTIONS` | `10` | Máximo de conexiones pooled |
| `HTTP_REQUEST_TIMEOUT` | `10000` | Timeout por petición en ms |

---

## 5. Uso

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@core/http';

@Injectable()
export class CatalogService {
  constructor(private readonly http: HttpService) {}

  async getProducts(): Promise<Product[]> {
    const response = await this.http.get<Product[]>('/api/products', {
      query: { page: 1, limit: 20 },
      timeout: 5000,
    });
    return response.data;
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await this.http.post<Product>('/api/products', data);
    return response.data;
  }
}
```

Con RequestBuilder (fluent):

```typescript
import { Injectable } from '@nestjs/common';
import { RequestBuilder } from '@core/http';

@Injectable()
export class ApiClient {
  constructor(private readonly builder: RequestBuilder) {}

  async search(query: string): Promise<SearchResult> {
    const options = this.builder
      .setMethod('GET')
      .setUrl('/search')
      .setQuery('q', query)
      .setQuery('limit', 10)
      .setTimeout(3000)
      .setResponseType('json')
      .addTag('search')
      .build();

    return this.http.request(options);
  }
}
```

---

## 6. Drivers

| Driver | Estado | Descripción |
|---|---|---|
| `UndiciDriver` | ✅ Funcional | Usa `fetch` nativo de Node.js (basado en undici) |
| `AxiosDriver` | ⏳ Esqueleto | Lanza `HttpDriverUnavailableException` |
| `GotDriver` | ⏳ Esqueleto | Lanza `HttpDriverUnavailableException` |

---

## 7. Políticas

### Retry (`DefaultRetryPolicy`)

| Estrategia | Fórmula |
|---|---|
| `exponential` | `baseDelay * 2^attempt` |
| `linear` | `baseDelay * (attempt + 1)` |
| `jitter` | `exponential * (0.5 + Math.random() * 0.5)` |

### Timeout (`DefaultTimeoutPolicy`)

- `createSignal(timeout?)` → AbortSignal
- `createTimeoutPromise(promise, timeout?)` → Promise con timeout

### Circuit Breaker (`DefaultCircuitBreaker`)

- Estados: `closed` → `open` (tras 5 fallos) → `half-open` (tras 30s) → `closed` (éxito)
- En `half-open` máximo 3 peticiones de prueba

---

## 8. Códigos de Error

| Código | Excepción | HTTP Status |
|---|---|---|
| `HTTP_001` | `HttpTimeoutException` | 504 |
| `HTTP_002` | `HttpConnectionFailedException` | 502 |
| `HTTP_003` | `HttpDnsErrorException` | 502 |
| `HTTP_004` | `HttpRetryExceededException` | 502 |
| `HTTP_005` | `HttpCircuitOpenException` | 503 |
| `HTTP_006` | `HttpSerializationErrorException` | 500 |
| `HTTP_007` | `HttpDeserializationErrorException` | 500 |
| `HTTP_008` | `HttpConfigurationException` | 500 |
| `HTTP_009` | `HttpRequestFailedException` | 500 |
| `HTTP_010` | `HttpAuthenticationException` | 401 |
| `HTTP_011` | `HttpRateLimitedException` | 429 |
| `HTTP_012` | `MaxRedirectsExceededException` | 502 |
| `HTTP_013` | `HttpInvalidUrlException` | 400 |
| `HTTP_014` | `PayloadTooLargeException` | 413 |
| `HTTP_015` | `HttpDriverUnavailableException` | 501 |

---

## 9. Riesgos y Consideraciones

1. **UndiciDriver** usa `fetch` nativo de Node.js 18+. Sin dependencia externa adicional.
2. **Sin implementación real de Axios/Got** — los esqueletos existen para la arquitectura de drivers, pero lanzan excepción al usarse.
3. **Circuit Breaker** implementación básica in-memory. Para producción distribuir el estado (Redis).
4. **Retry** no diferencia entre errores recuperables y no recuperables (dev. futuro: `statusCodes`, `methods`).
5. **TLS/SSL** y **Proxy** están tipados pero no implementados en UndiciDriver. Pendiente configuración avanzada.
6. Los `TimeoutConfig`, `DnsConfig`, `TlsConfig`, `ProxyConfig` se definen en tipos pero se consumen parcialmente.
