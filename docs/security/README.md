# Security — Seguridad

## Principios

1. **Defense in depth** — Múltiples capas de seguridad
2. **Least privilege** — Mínimo acceso necesario
3. **Never trust, always verify** — Validar toda entrada
4. **No secretos en código** — Env vars con Zod validation
5. **OWASP Top 10** — Mitigaciones implementadas

## Capas de Seguridad HTTP

```
1. Trusted Proxy     → Express trust proxy (IP real)
2. Compression       → Gzip (solo producción)
3. Request Limits    → Body parser (1MB default)
4. Security Headers  → HSTS, CSP, X-Frame-Options, etc.
5. Helmet            → Seguridad HTTP headers
6. CORS              → Lista blanca de orígenes
7. Rate Limiting     → @nestjs/throttler (100 req/min global)
8. CSRF              → Token validation (producción)
9. Validation        → ZodValidationPipe
10. Auth Guards      → JWT + Passport (futuro)
```

## Módulo Security (`@core/security`)

| Componente | Propósito |
|-----------|-----------|
| CorsConfigurator | CORS por preset (dev/test/prod) |
| HelmetConfigurator | CSP, HSTS, Frameguard |
| SecurityHeadersConfigurator | Headers HTTP adicionales |
| CsrfArchitecture | Token CSRF (futuro) |
| RateLimitConfigurator | Global (100), API (60), Auth (10) |
| TrustedProxyConfigurator | IP real según proxy |
| RequestLimitsConfigurator | Body 1MB, 100 query params |
| PayloadLimitsConfigurator | Multipart 10MB, MIME filter |
| CompressionConfigurator | Gzip en producción |

## Rate Limiting

| Estrategia | TTL | Límite | Burst | Dev/Test |
|-----------|-----|--------|-------|----------|
| Global | 60s | 100 | 150 | x10 |
| API | 60s | 60 | 80 | x10 |
| Auth | 60s | 10 | 15 | x10 |

## CORS

| Entorno | Orígenes |
|---------|----------|
| Development | `localhost:3000`, `localhost:4000` |
| Testing | `localhost:3000` |
| Production | Lista blanca via `CORS_ORIGINS` env |

## Environment Variables

| Variable | Propósito |
|----------|-----------|
| `CORS_ORIGINS` | Orígenes permitidos CORS |
| `RATE_LIMIT_TTL` | TTL rate limiting |
| `RATE_LIMIT_MAX` | Máximo de requests |
| `TRUSTED_PROXY_TYPE` | nginx, cloudflare, traefik, alb |
| `ENCRYPTION_KEY` | Clave de encriptación |

## OWASP Mitigaciones

| OWASP | Implementación |
|-------|---------------|
| A01 — Broken Access Control | CORS whitelist, RLS |
| A03 — Injection | ZodValidationPipe |
| A05 — Security Misconfiguration | Helmet, Security Headers |
| A06 — Vulnerable Components | pnpm audit, Dependency Review |
| A07 — Identification Failures | JWT (futuro), rate limiting |
| A08 — Software Integrity | MIME filter, payload limits |
| A09 — Logging Failures | Request ID, Correlation ID |
| A10 — SSRF | Validación URLs (futuro) |
