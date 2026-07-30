# Seguridad — Infraestructura de Seguridad

Módulo de seguridad centralizado y desacoplado para la plataforma Tienda.

---

## Árbol completo

```
apps/backend/src/core/security/
├── index.ts                         # Barrel export público
├── security.module.ts               # Módulo NestJS (ThrottlerModule + guards)
├── security-bootstrap.service.ts    # Aplica middleware al iniciar la app
│
├── config/
│   └── index.ts                     # SecurityConfigurationFactory — fábrica centralizada
│
├── cors/
│   └── index.ts                     # CorsConfigurator — presets dev/test/prod
│
├── helmet/
│   └── index.ts                     # HelmetConfigurator — CSP, HSTS, Frameguard, etc.
│
├── headers/
│   └── index.ts                     # SecurityHeadersConfigurator — headers HTTP
│
├── csrf/
│   └── index.ts                     # CsrfArchitecture — preparado para activación futura
│
├── rate-limit/
│   └── index.ts                     # RateLimitConfigurator — global/api/auth + ThrottlerModule
│
├── trusted-proxy/
│   └── index.ts                     # TrustedProxyConfigurator — nginx/cloudflare/traefik/alb
│
├── request-limits/
│   └── index.ts                     # RequestLimitsConfigurator — body/query/headers
│
├── payload/
│   └── index.ts                     # PayloadLimitsConfigurator — multipart/upload/files
│
├── compression/
│   └── index.ts                     # CompressionConfigurator — gzip + brotli-ready
│
├── constants/
│   └── index.ts                     # Constantes (límites, defaults, headers, etc.)
│
├── types/
│   └── index.ts                     # Tipos compartidos (SecurityOptions, HelmetPolicy, etc.)
│
└── interfaces/
    └── index.ts                     # Interfaces de servicios (contratos)
```

---

## Explicación de cada carpeta

### `config/`
Fábrica centralizada `SecurityConfigurationFactory`. Decide qué protecciones activar según el entorno.
- `getOptions()` → devuelve `SecurityOptions` (booleanos para cada subsistema)
- `getCorsPreset()` → detecta `development`, `testing` o `production`
- `getRateLimitStrategies()` → multiplica límites x10 en dev/test
- `getRequestLimits()`, `getPayloadLimits()`, `getHelmetPolicy()` → defaults

### `cors/`
`CorsConfigurator` con tres presets:
- **development**: `localhost:3000`, `localhost:4000`, headers de depuración
- **testing**: solo `localhost:3000`
- **production**: lee orígenes desde `packages/config` (`CORS_ORIGINS`)
- Usa lista blanca, no `*`, con `credentials: true` y `maxAge: 86400`

### `helmet/`
`HelmetConfigurator` aplica `helmet()` con:
- CSP estricto (`default-src 'self'`, sin `'unsafe-inline'` en scripts, `frame-src: 'none'`)
- HSTS `max-age=31536000; includeSubDomains; preload`
- Frameguard `SAMEORIGIN`
- NoSniff, XSS Filter, IE No Open
- COOP, COEP, CORP
- Origin-Agent-Cluster

### `headers/`
`SecurityHeadersConfigurator` — middleware Express que fija headers de seguridad adicionales por entorno:
- `Strict-Transport-Security` solo en prod/staging
- `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` deshabilitando cámara, micrófono, geolocalización, etc.
- `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`
- `X-DNS-Prefetch-Control: off`

### `csrf/`
`CsrfArchitecture` — infraestructura preparada, no activa por defecto.
- Genera tokens CSRF vía `crypto.getRandomValues()`
- Configura cookie `csrf-token` con `httpOnly`, `secure` en prod, `sameSite: strict`
- Header esperado: `x-csrf-token`
- Se activa automáticamente en producción vía `SecurityOptions.csrf`

### `rate-limit/`
`RateLimitConfigurator` — configura `@nestjs/throttler` con tres estrategias:
- **Global**: 100 req/60s, burst 150
- **API**: 60 req/60s, burst 80
- **Auth**: 10 req/60s, burst 15 (preparado para login)
- Provee `ThrottlerGuard` como `APP_GUARD` global

### `trusted-proxy/`
`TrustedProxyConfigurator` — configura `trust proxy` de Express según el proxy inverso:
- **nginx/traefik**: confía en `127.0.0.1`, `::1`
- **cloudflare**: 15 rangos IP públicos de Cloudflare, lee `cf-connecting-ip`
- **aws-alb**: confía en localhost
- Extrae IP real del cliente según el tipo de proxy

### `request-limits/`
`RequestLimitsConfigurator` — límites de tamaño para body parser:
- Body/JSON/URLEncoded/Raw/Text: 1 MB por defecto
- Query string: 100 parámetros
- Headers: 16 KB

### `payload/`
`PayloadLimitsConfigurator` — controla la subida de archivos:
- Multipart: 10 MB, archivos individuales: 50 MB
- Máximo 10 archivos, 50 campos, campo de 1 MB
- Filtro MIME: jpeg, png, webp, svg, pdf, json, csv, xlsx

### `compression/`
`CompressionConfigurator` — compresión gzip (brotli-ready):
- Umbral: 1 KB
- Filtro por Content-Type: text/*, application/json, image/svg+xml, etc.
- Respeta `x-no-compression`
- Se activa en producción, desactivado en dev/test

### `constants/`
Todos los valores por defecto centralizados:
- `DEFAULT_REQUEST_LIMITS`, `DEFAULT_PAYLOAD_LIMITS`, `DEFAULT_HELMET_POLICY`
- `GLOBAL_RATE_LIMIT`, `API_RATE_LIMIT`, `AUTH_RATE_LIMIT`
- `SECURITY_HEADER_NAMES`, `TRUSTED_PROXY_HEADERS`
- `COMPRESSION_CONTENT_TYPES`, `CSRF_DEFAULTS`

### `types/`
Tipos compartidos: `SecurityOptions`, `SecurityContext`, `CorsPreset`, `HelmetPolicy`, `RateLimitStrategy`, `RequestLimitConfig`, `PayloadLimitConfig`, `CompressionFormat`, `TrustedProxyType`, etc.

### `interfaces/`
Contratos de servicios: `SecurityConfigProvider`, `CorsConfigFactory`, `SecurityHeadersService`, `RateLimitConfigurator`, `SecurityMiddleware`, `JwtFutureIntegration`, `SecurityAuditor`.

### `security.module.ts`
Módulo NestJS que importa `ThrottlerModule.forRootAsync` y provee:
- Todos los configuradores como providers
- `ThrottlerGuard` como guard global (`APP_GUARD`)

### `security-bootstrap.service.ts`
Servicio que orquesta la aplicación de toda la seguridad en `INestApplication`:
1. Trusted proxy
2. Request limits
3. Payload limits
4. Helmet
5. Security headers
6. CORS (vía `app.enableCors()`)
7. Compression

---

## Flujo de Seguridad HTTP

```
Cliente
  │
  ▼
1. Trusted Proxy        ← Express trust proxy (IP real, headers)
  │
  ▼
2. Compression          ← Gzip (negociación Accept-Encoding)
  │
  ▼
3. Request Limits       ← body-parser (límites de tamaño)
  │
  ▼
4. Security Headers     ← middleware Express fija headers
  │
  ▼
5. Helmet               ← CSP, HSTS, Frameguard, NoSniff, COOP/COEP/CORP
  │
  ▼
6. CORS                 ← enableCors() con preset
  │
  ▼
7. Rate Limiting        ← @nestjs/throttler (ThrottlerGuard global)
  │
  ▼
8. CSRF (future)        ← Validación de token en cookie/header
  │
  ▼
9. Validación           ← ZodValidationPipe / transformadores
  │
  ▼
10. Seguridad App       ← Guards (JWT, OAuth2, API Keys — Fase 4)
  │
  ▼
Controladores / Módulos del negocio
```

---

## Estrategia de Headers

| Header | Valor | Condición |
|--------|-------|-----------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Solo prod/staging |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; ...` | Siempre |
| `X-Frame-Options` | `SAMEORIGIN` | Siempre |
| `X-Content-Type-Options` | `nosniff` | Siempre |
| `X-XSS-Protection` | `0` | Siempre |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Siempre |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Siempre |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` | Siempre |
| `Cross-Origin-Resource-Policy` | `same-origin` | Siempre |
| `X-DNS-Prefetch-Control` | `off` | Siempre |
| `X-Download-Options` | `noopen` | Siempre |

---

## Estrategia CORS

### Development
```
Origen:  http://localhost:3000, http://localhost:4000
Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token,
         X-Correlation-Id, X-Request-Id, X-Tenant-Slug
Credentials: true, MaxAge: 86400
```

### Testing
```
Origen:  http://localhost:3000
Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
Headers: Content-Type, Authorization, X-CSRF-Token, X-Correlation-Id, X-Request-Id
Credentials: true, MaxAge: 600
```

### Production
```
Origen:  Lista blanca desde CORS_ORIGINS (env)
Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS
Headers: Content-Type, Authorization, X-CSRF-Token, X-Correlation-Id,
         X-Request-Id, X-Tenant-Slug, X-Idempotency-Key
Credentials: true, MaxAge: 86400
```

---

## Estrategia Rate Limit

| Estrategia | TTL | Límite | Burst | Multiplicador dev/test |
|-----------|-----|--------|-------|----------------------|
| Global | 60s | 100 | 150 | x10 |
| API | 60s | 60 | 80 | x10 |
| Auth | 60s | 10 | 15 | x10 |

Los límites se aplican vía `ThrottlerGuard` global con `@nestjs/throttler`.

---

## Recomendaciones OWASP

### Aplicadas en esta fase

| OWASP | Control | Implementación |
|-------|---------|---------------|
| **A1** Broken Access Control | CORS con lista blanca, validación de origen | `cors/`, `security-bootstrap` |
| **A5** Security Misconfiguration | Headers de seguridad, CSP, no información de server | `helmet/`, `headers/` |
| **A6** Vulnerable Components | Dependencias controladas, sin `*` en CORS | `cors/` (lista blanca) |
| **A8** Software Integrity Failures | Subida de archivos con filtro MIME | `payload/` |
| **A9** Logging Failures | Request ID, Correlation ID, IP tracking | `trusted-proxy/`, `headers/` |

### Para implementar en Fase 4 (Autenticación)

| OWASP | Control futuro |
|-------|---------------|
| **A2** Cryptographic Failures | JWT con algoritmos seguros, claves rotadas |
| **A3** Injection | ZodValidationPipe global |
| **A4** Insecure Design | Rate limiting por usuario/API key |
| **A7** Identification Failures | JWT, OAuth2, OpenID Connect |
| **A10** SSRF | Validación de URLs, lista blanca de destinos |

---

## Riesgos detectados

| Riesgo | Clasificación | Mitigación |
|--------|--------------|-----------|
| CORS con `credentials: true` | Medio | Solo orígenes en lista blanca, no `*` |
| CSP sin nonce/hash en scripts | Medio | `'unsafe-inline'` en style-src, no en script-src |
| Limite de body bajo (1 MB) | Bajo | Configurable via `RequestLimitConfig` |
| CSRF no activo por defecto | Medio | Arquitectura preparada, se activa en producción |
| Trusted proxy detecta automáticamente | Bajo | Configurable via env `TRUSTED_PROXY_TYPE` |
| Upload MIME filter por extensión | Bajo | Se valida `mimetype` del payload, no extensión |
| Sin autenticación ni API keys | Crítico | Programado para Fase 4 |

---

## Puntos de integración futura

El módulo declara en `interfaces/` los contratos para:

- **JWT**: `JwtFutureIntegration` (algoritmos soportados, tipos de clave)
- **OAuth2 / OpenID Connect**: mismo contrato extensible
- **API Keys**: `SecurityAuditor` para registrar eventos de seguridad
- **Webhooks**: payload limits + rate limit ya preparados
- **mTLS**: trusted proxy + IP detection extensibles

---

## Integración con packages/config

| Config | Origen |
|--------|--------|
| `CORS_ORIGINS` | `packages/config/src/cors/index.ts` |
| `RATE_LIMIT_TTL`, `RATE_LIMIT_MAX` | `packages/config/src/rate-limit/index.ts` |
| `ENCRYPTION_KEY` | `packages/config/src/security/index.ts` |
| `NODE_ENV`, `PORT`, `API_PREFIX` | `packages/config/src/app/index.ts` |

---

## Uso desde main.ts

```ts
// apps/backend/src/main.ts
import { SecurityBootstrap } from '@core/security/security-bootstrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ... globalPrefix, versioning ...

  const securityBootstrap = app.get(SecurityBootstrap);
  securityBootstrap.apply(app);

  // ... shutdown hooks, listen ...
}
```

---

## Consideraciones de despliegue

1. **Variables de entorno requeridas**: `CORS_ORIGINS`, `TRUSTED_PROXY_TYPE`
2. **Cloudflare**: el rate limit debe configurarse también en el dashboard CF
3. **HSTS preload**: requiere registro en `https://hstspreload.org/`
4. **CSP en producción**: ajustar `script-src` y `connect-src` según necesidades del frontend
5. **Compresión Brotli**: requiere servidor HTTP (NGINX, Traefik) que lo soporte
