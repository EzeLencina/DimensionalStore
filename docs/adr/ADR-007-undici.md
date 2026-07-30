# ADR-007: Undici como HTTP Client Base

## Contexto

El backend necesita realizar peticiones HTTP a servicios externos.

## Problema

Elegir un cliente HTTP que sea performante, nativo (sin dependencias externas pesadas), y extensible.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **Undici** | Nativo (fetch), performance, sin dependencias | API diferente a axios |
| **Axios** | Popular, interceptores, amplio uso | Dependencia externa, bundle size |
| **Got** | API fluida, features completas | Dependencia externa |
| **node-fetch** | Familiar (fetch API) | Deprecado en Node 18+ |

## Decisión

Undici (fetch nativo Node.js) como driver principal, con arquitectura multi-driver.

## Consecuencias

- `UndiciDriver` funcional usando `fetch` nativo
- `AxiosDriver` y `GotDriver` como esqueletos (futura implementación)
- Arquitectura de drivers desacoplada via `IHttpClient`
- Policies: retry (exponential/linear/jitter), circuit-breaker, timeout
- Middleware: CorrelationId, RequestId
- Interceptors: Logging, Tracing
- Health check del driver activo vía `HttpHealthService`
- Factory para seleccionar driver via `HTTP_DRIVER` env var
