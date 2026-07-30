# @tienda/config

Sistema de configuración centralizado, tipado y validado. Es la única fuente de verdad para todas las aplicaciones del monorepo.

---

## Árbol completo

```
packages/config/
├── package.json
├── tsconfig.json
│
└── src/
    ├── index.ts               # Barrel export — todo el sistema
    ├── loader.ts              # Conveniencia: loadEnv, loadPublicEnv
    │
    ├── validation/
    │   ├── env.zod.ts         # Zod schema de todas las env vars
    │   ├── loader.ts          # loadEnv() bootstrap + singleton
    │   ├── public.ts          # Subset público (NEXT_PUBLIC_*)
    │   └── index.ts
    │
    ├── app/                   # AppConfig
    ├── database/              # DatabaseConfig
    ├── redis/                 # RedisConfig
    ├── jwt/                   # JwtConfig
    ├── cache/                 # CacheConfig
    ├── queue/                 # QueueConfig
    ├── storage/               # StorageConfig
    ├── mail/                  # MailConfig
    ├── security/              # SecurityConfig
    ├── cors/                  # CorsConfig
    ├── rate-limit/            # RateLimitConfig
    ├── logging/               # LoggingConfig
    ├── analytics/             # AnalyticsConfig
    └── integrations/          # IntegrationConfig
```

---

## Explicación de cada módulo

| Módulo | Propósito | Variables clave |
|--------|-----------|-----------------|
| `app` | Identidad y red | PORT, NODE_ENV, API_PREFIX, version |
| `database` | PostgreSQL | DATABASE_URL, pool, ssl, timeouts |
| `redis` | Redis | REDIS_URL → host/port parseados |
| `jwt` | Autenticación | secret, expiresIn, refresh |
| `cache` | Caché | TTL, key prefix |
| `queue` | Colas (BullMQ) | redisUrl (hereda de REDIS_URL) |
| `storage` | Objetos (S3/R2) | endpoint, accessKey, bucket |
| `mail` | SMTP | host, port, credentials |
| `security` | Criptografía | encryptionKey, bcryptRounds |
| `cors` | CORS | origins parsed de string CSV |
| `rate-limit` | Throttling | TTL, max requests |
| `logging` | Logs | level, format (json/pretty) |
| `analytics` | Analytics integrados | enabled, provider (placeholder) |
| `integrations` | Terceros | stripe, mercadopago, sendgrid (placeholder) |

---

## Flujo de carga

```
1. Application startup
2. loadEnv() called (once)
3. envSchema.safeParse(process.env)  ← Zod validation
4. On failure → throws clear error with all issues
5. On success → singleton cached
6. Domain config functions read from cached env
7. App modules import { databaseConfig, ... }
```

```
                    loadEnv()
                        │
                        ▼
              envSchema.safeParse()
              ┌─────────────────┐
              │ NODE_ENV         │
              │ DATABASE_URL     │
              │ JWT_SECRET       │  ← Zod default + transform
              │ REDIS_URL        │
              │ CORS_ORIGINS     │
              │ ...              │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Env (cached)   │
              └────────┬────────┘
                       │
         ┌─────────────┼──────────────┐
         ▼             ▼              ▼
   databaseConfig()  redisConfig()   appConfig()
         │             │              │
         ▼             ▼              ▼
   DatabaseConfig   RedisConfig     AppConfig
   (tipado)         (tipado)        (tipado)
```

---

## Estrategia de validación

- **Zod schema único** en `validation/env.zod.ts`
- Cada variable tiene: `z.string()`, `z.coerce.number()`, `z.enum()`, etc.
- Defaults sensibles para desarrollo (nunca secrets reales)
- `loadEnv()` se llama UNA VEZ al iniciar la app → congela la validación
- Errores de validación son explícitos: `[DATABASE_URL] Invalid url`
- Sin secretos → no hay riesgo de leak por error messages

### Frontend (público)

Desde el navegador solo se accede a `NEXT_PUBLIC_*`:
```ts
import { loadPublicEnv } from '@tienda/config/loader';
const publicEnv = loadPublicEnv();
// { NODE_ENV, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_VERSION }
```

---

## Convenciones para agregar nuevas variables

1. Agregar la variable al **Zod schema** en `validation/env.zod.ts`
2. Agregar si corresponde a los `.env.*` files
3. Crear o extender el **domain config** en su directorio
4. Re-exportar desde `src/index.ts`
5. La variable queda automáticamente tipada y validada

---

## Ejemplos de uso

### Backend (NestJS)

```ts
import { databaseConfig } from '@tienda/config';

const db = databaseConfig();
// db.url       → string
// db.poolMax   → number
// db.ssl       → boolean
```

### Bootstrap

```ts
import { loadEnv } from '@tienda/config';

// Se llama al inicio, antes de cualquier config
loadEnv();
```

### Frontend (Next.js)

```ts
import { loadPublicEnv } from '@tienda/config';

export default function Page() {
  const publicEnv = loadPublicEnv();
  return <div>API: {publicEnv.NEXT_PUBLIC_API_URL}</div>;
}
```

### Validación segura (sin throw)

```ts
import { loadEnvSafe } from '@tienda/config';

const result = loadEnvSafe();
if (!result.success) {
  console.error('Invalid configuration:', result.errors);
  process.exit(1);
}
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Zod defaults ocultan vars faltantes | App funciona con valores incorrectos | `loadEnvSafe()` + alertas en CI |
| `process.env` accedido directamente fuera del paquete | Config no validada, bugs difíciles | Auditorías de código, rule de ESLint |
| Singleton cacheado en tests | Config contaminada entre tests | `resetEnv()` en `afterEach`/`beforeEach` |
| Secrets en `.env.*` commiteados | Exposición de credenciales | `.env.*` en `.gitignore`, secrets en vault |
| Frontend importa config privada | Leak de secrets al bundle | Solo `loadPublicEnv()` disponible en cliente |

---

## Recomendaciones

1. **Todo acceso a env vars debe pasar por `@tienda/config`**. Prohibir `process.env.X` en el resto del proyecto.
2. **Llamar `loadEnv()` en el entrypoint** (`main.ts`, `next.config.ts`, etc.) antes de cualquier otra importación.
3. **En tests**, llamar `resetEnv()` en `beforeEach` y cargar config específica del test.
4. **Nuevas variables de entorno** seguir la convención: agregar al schema, a los `.env.*`, y al domain config.
5. **Nunca** `NEXT_PUBLIC_*` en schemas backend-privados. El schema público solo incluye `NEXT_PUBLIC_*`.
6. **Secrets en producción** se inyectan via Docker/K8s/CI, no via `.env.production` comiteado.
