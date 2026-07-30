# ADR-015: Versionado URI como Estrategia de API Versioning

## Contexto

La API REST necesita soportar versionado para evolucionar sin romper clientes existentes.

## Problema

Elegir una estrategia de versionado que sea simple, visible, y estándar.

## Alternativas

| Alternativa | Pros | Contras |
|-------------|------|---------|
| **URI Path** (`/api/v1/products`) | Visible, simple, cacheable | URLs largas, versionado en path |
| **Header** (`x-api-version: 1`) | URL limpia, menos breaking | Menos visible, requiere header |
| **Media Type** (`Accept: vnd.tienda.v1+json`) | RESTful puro, negociación | Complejo, menos soporte cliente |
| **Query Parameter** (`?version=1`) | Simple | No cacheable, no estándar |

## Decisión

URI path versioning como default, con soporte para header y media-type.

## Consecuencias

- Prefijo `/api/v1/` en todas las rutas
- NestJS `enableVersioning({ type: URI, prefix: 'v', defaultVersion: '1' })`
- `@Controller({ version: '1' })` por controlador
- `UriVersioningService`, `HeaderVersioningService`, `MediaTypeVersioningService` implementados
- `API_VERSIONING_TYPE` env var para switch entre estrategias
- `ApiVersionInterceptor` inyecta `x-api-version` en responses
- Futuro: deprecation warnings, sunset headers, coexistencia de versiones
