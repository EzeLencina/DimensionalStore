# Redis — Infraestructura de conexión y operaciones con Redis

Módulo Redis desacoplado para la plataforma Tienda. Todo acceso a Redis se realiza mediante interfaces; nunca se accede directamente al cliente ioredis desde el dominio.

---

## Árbol completo

```
apps/backend/src/core/cache/
├── cache.module.ts              # Module NestJS (importa RedisModule)
│
├── redis/
│   ├── index.ts                 # Barrel export público
│   ├── redis.module.ts          # Módulo NestJS global
│   │
│   ├── config/
│   │   └── index.ts             # RedisConfigurationFactory
│   │
│   ├── providers/
│   │   └── index.ts             # redisClientProvider, redisSubscriberProvider
│   │
│   ├── interfaces/
│   │   └── index.ts             # IRedisClient, IRedisService, IConnectionFactory,
│   │                            # IRedisHealthIndicator, ISerializationAdapter,
│   │                            # IRedisConfigProvider
│   │
│   ├── services/
│   │   └── index.ts             # RedisService (implementación concreta de IRedisService)
│   │
│   ├── health/
│   │   └── index.ts             # RedisHealthIndicator
│   │
│   ├── constants/
│   │   └── index.ts             # REDIS_TOKENS, REDIS_ERROR_CODES, REDIS_DEFAULT_TTL,
│   │                            # NAMESPACE_MAP, defaults
│   │
│   ├── exceptions/
│   │   └── index.ts             # RedisException, RedisConnectionException,
│   │                            # RedisTimeoutException, RedisSerializationException,
│   │                            # RedisUnavailableException, RedisConfigurationException,
│   │                            # RedisCommandException
│   │
│   ├── types/
│   │   └── index.ts             # RedisConnectionOptions, RedisHealthStatus,
│   │                            # RedisNamespace, SerializationFormat,
│   │                            # ExpirationStrategy, RedisEventMap
│   │
│   └── utils/
│       └── index.ts             # RedisNamespaceBuilder, RedisSerializer,
│                                # calculateTtl, isRedisError, sleep
│
└── README.md                    # Documentación
```

---

## Explicación de cada carpeta

### `config/`
**RedisConfigurationFactory** — Lee la configuración desde `packages/config` (que a su vez lee de variables de entorno validadas con Zod) y expone `RedisConnectionOptions` listas para usar.

Campos configurados:
- `host`, `port`, `password`, `db`, `tls`
- `keyPrefix`, `connectTimeout`, `keepAlive`, `family`
- `retryMaxAttempts`, `retryBaseDelay`, `retryMaxDelay`
- `enableOfflineQueue`, `lazyConnect`

### `providers/`
**redisClientProvider** — FactoryProvider que crea la conexión principal ioredis con:
- Retry strategy exponencial con jitter
- `reconnectOnError` para errores transitorios
- Event listeners (connect, ready, error, close, reconnecting, end) que usan `Logger`

**redisSubscriberProvider** — Conexión separada para Pub/Sub (sin `keyPrefix` para recibir mensajes sin prefijo).

### `interfaces/`
Contratos que definen el qué, no el cómo:
- `IRedisClient` — acceso al cliente subyacente
- `IRedisService` — CRUD + estructuras de datos (strings, sets, hashes, pipelines)
- `IConnectionFactory` — creación de conexiones
- `IRedisHealthIndicator` — health check
- `ISerializationAdapter` — serialización/deserialización
- `IRedisConfigProvider` — acceso a configuración

### `services/`
**RedisService** — Implementación de `IRedisService` que wrappea ioredis. Toda operación:
1. Serializa valores automáticamente (JSON por defecto)
2. Maneja errores y los mapea a excepciones del módulo
3. Reporta vía Logger en caso de error

Métodos disponibles:
- Strings: `get`, `set`, `setJson`, `del`, `exists`, `expire`, `ttl`, `keys`
- Números: `incr`, `incrBy`, `decr`, `decrBy`
- Sets: `sadd`, `srem`, `smembers`
- Hashes: `hset`, `hget`, `hgetall`, `hdel`
- Múltiples: `mget`, `mset`
- Utilidades: `ping`, `pipeline`, `multi`, `flushDb`, `getClient`

### `health/`
**RedisHealthIndicator** — Monitorea el estado de Redis:
- `isHealthy()` → ejecuta PING y registra latencia
- `getStatus()` → último estado conocido
- Escucha eventos `connect`, `close`, `reconnecting`, `error`
- Reporta: conectado, latencia, intentos de reconexión, uptime, error actual

### `constants/`
Valores centralizados:
- `REDIS_TOKENS` — símbolos de DI (DEFAULT_CLIENT, SUBSCRIBER_CLIENT, SERVICE, etc.)
- `REDIS_ERROR_CODES` — códigos de error (20 códigos, REDIS_001 a REDIS_020)
- `REDIS_DEFAULT_TTL` — constantes de expiración (SHORT=60s, MEDIUM=300s, LONG=3600s, etc.)
- `NAMESPACE_MAP` — mapeo de namespaces lógicos a prefijos de Redis
- `REDIS_NAMESPACE_SEPARATOR` — `:`

### `exceptions/`
Jerarquía de excepciones Redis que extienden `AppException` del sistema de errores global:
- `RedisException` — base
- `RedisConnectionException` — error de conexión
- `RedisTimeoutException` — timeout en comando
- `RedisSerializationException` — error serializando/deserializando
- `RedisUnavailableException` — Redis no disponible
- `RedisConfigurationException` — error de configuración
- `RedisCommandException` — error ejecutando comando

### `types/`
Tipos compartidos:
- `RedisConnectionOptions` — todas las opciones de conexión
- `RedisHealthStatus` — estado de health check
- `RedisConnectionStatus` — estado de conexión
- `RedisNamespace` — union type de namespaces
- `SerializationFormat` — `'json' | 'string' | 'buffer' | 'raw'`
- `ExpirationStrategy` — `ttl | sliding | absolute | none`
- `RedisEventMap` — evento → handler

### `utils/`
- **RedisNamespaceBuilder** — construye claves con naming convention: `{prefix}:{namespace}:{...keys}`
- **RedisSerializer** — serializa/deserializa en JSON, String, Buffer, Raw
- **calculateTtl** — calcula segundos restantes según estrategia de expiración
- **isRedisError** — type guard para errores de Redis
- **sleep** — utilidad de pausa asíncrona

---

## Flujo de conexión

```
Arranque de la app
  │
  ▼
RedisConfigurationFactory     ← lee env vars → packages/config → env.zod.ts
  │
  ▼
redisClientProvider           ← FactoryProvider de NestJS
  │
  ├── valida opciones (host, port)
  ├── crea new Redis({...})   ← ioredis
  ├── configura retryStrategy
  ├── configura reconnectOnError
  └── attachEventListeners    ← Logger + HealthIndicator
  │
  ▼
RedisService                  ← recibe cliente vía @Inject(REDIS_TOKENS.DEFAULT_CLIENT)
  │
  ▼
RedisHealthIndicator          ← escucha eventos de conexión
  │
  ▼
Controladores / Servicios     ← inyectan RedisService o IRedisService
```

---

## Estrategia de reconexión

```
intento = 1
delay = min(baseDelay * 2^(intento-1), maxDelay)
jitter = delay * (1 - Math.random() * 0.25)

Si intento > maxAttempts → retorna null (detener)
Si no → retorna delay con jitter

Valores por defecto:
  baseDelay:    500ms
  maxDelay:     30,000ms (30s)
  maxAttempts:  10
```

- **Exponencial**: el delay se duplica en cada intento
- **Jitter**: -25% aleatorio para evitar雷鸣 de reconexión
- **Límite**: máximo 10 intentos, luego se detiene
- **reconnectOnError**: `true` para errores transitorios

---

## Convención de namespaces

Formato: `{prefix}:{namespace}:{...keys}`

| Namespace | Prefijo | Ejemplo |
|-----------|---------|---------|
| `app` | `app` | `tienda:app:version` |
| `cache` | `cache` | `tienda:cache:user:123` |
| `queue` | `queue` | `tienda:queue:email:welcome` |
| `session` | `session` | `tienda:session:abc123` |
| `lock` | `lock` | `tienda:lock:order:456` |
| `config` | `config` | `tienda:config:feature:flag` |
| `rate-limit` | `rate` | `tienda:rate:user:789` |
| `pubsub` | `pubsub` | `tienda:pubsub:events` |
| `future` | `fut` | `tienda:fut:webhook:job` |

```ts
const builder = new RedisNamespaceBuilder('tienda');
builder.cacheKey('user', userId);   // → tienda:cache:user:abc-123
builder.lockKey('order', orderId);  // → tienda:lock:order:456
```

---

## Estrategia de serialización

| Formato | Uso | Comportamiento |
|---------|-----|----------------|
| `json` | Default | `JSON.stringify` / `JSON.parse` |
| `string` | Texto plano | `String(value)` |
| `buffer` | Binarios | `Buffer.from()` |
| `raw` | Sin transformación | Se guarda como string |

Todas las operaciones de `RedisService` serializan automáticamente en JSON por defecto.

```ts
const service = app.get(RedisService);

await service.set('key', { user: 'Alice', role: 'admin' });
// Guarda: '{"user":"Alice","role":"admin"}'

const data = await service.get<{ user: string }>('key');
// Retorna: { user: 'Alice', role: 'admin' }
```

---

## Estrategia de expiración

| Estrategia | Configuración | Uso |
|-----------|--------------|-----|
| `ttl` | `{ type: 'ttl', ttl: 300 }` | Expira a los 300s |
| `sliding` | `{ type: 'sliding', ttl: 60, maxTtl: 3600 }` | Renueva TTL al leer |
| `absolute` | `{ type: 'absolute', expireAt: Date }` | Expira en fecha/hora específica |
| `none` | `{ type: 'none' }` | Sin expiración |

```ts
import { calculateTtl } from './utils';

const seconds = calculateTtl({ type: 'absolute', expireAt: new Date('2026-12-31') });
await service.set('promo', data, seconds);
```

---

## Observabilidad

### Logger
- Todos los eventos de conexión se registran vía `Logger` de NestJS
- Errores de conexión incluyen contexto `RedisClient`
- Health check errors se registran en `RedisHealthIndicator`
- Los comandos fallidos se registran antes de lanzar excepción

### Health Module
- `RedisHealthIndicator` expone `isHealthy()` para integración con Health Module de NestJS
- Estado accesible vía `getStatus()`: conectado, latencia, intentos de reconexión, uptime

### Error Handling
- Todas las excepciones Redis extienden `AppException` → integradas con `GlobalExceptionFilter`
- Cada excepción incluye `errorCode` para trazabilidad
- Códigos de error: `REDIS_001` a `REDIS_020`

---

## Puntos de integración futura

| Funcionalidad | Preparado en | Cómo se integrará |
|--------------|-------------|-------------------|
| **Cache Manager** | `RedisService.get/set`, `REDIS_DEFAULT_TTL` | Service por sobre RedisService |
| **BullMQ** | `redisSubscriberProvider`, `NAMESPACE_MAP.queue` | BullMQ usa ioredis nativamente |
| **Distributed Locks** | `lockKey()`, `ExpirationStrategy`, `REDIS_DEFAULT_TTL.LOCK` | `SET key value NX EX ttl` |
| **Pub/Sub** | `redisSubscriberProvider`, `NAMESPACE_MAP.pubsub` | ioredis subscribe/publish |
| **WebSockets** | Redis como adaptador | `@nestjs/websockets` + Redis |
| **Sessions** | `NAMESPACE_MAP.session`, `REDIS_DEFAULT_TTL.SESSION` | express-session connect-redis |
| **Rate Limiting** | `NAMESPACE_MAP['rate-limit']`, `REDIS_DEFAULT_TTL.RATE_LIMIT_WINDOW` | `@nestjs/throttler` + ioredis store |

---

## Recomendaciones de rendimiento

1. **Cliente único**: Usar `RedisService` como singleton vía DI (ya configurado como global)
2. **Pipeline**: Usar `pipeline()` para operaciones batch en lugar de comandos individuales
3. **Connection Pool**: ioredis maneja pooling internamente; no crear conexiones manuales
4. **Key eviction**: Configurar política de evolución en Redis (LRU recomendado para caché)
5. **Monitor**: ioredis soporta MONITOR; activar solo para debugging
6. **Tiempo de conexión**: `connectTimeout` por defecto 10s; ajustar según latencia de red
7. **Keep Alive**: 30s por defecto; reducir en redes con firewalls agresivos
8. **Auto Pipelining**: Desactivado por defecto; activar solo si se usa mucho el mismo cliente
9. **Separar responsabilidades**: Usar `keyPrefix` para aislar ambientes (dev/staging/prod)

---

## Riesgos detectados

| Riesgo | Clasificación | Mitigación |
|--------|--------------|-----------|
| Conexión sin TLS en producción | Alto | `REDIS_TLS=true` requerido en producción |
| Password en variables de entorno | Medio | Usar secretos de Docker/K8s para `REDIS_PASSWORD` |
| Retry strategy infinita | Medio | `retryMaxAttempts=10` con fallback a null |
| Sin límite de memoria | Medio | Configurar `maxmemory` en Redis server |
| Misma DB para todo | Bajo | `REDIS_DB` permite aislar por entorno |
| Key prefix no configurado | Bajo | Default `tienda:`, configurable vía `REDIS_KEY_PREFIX` |
| Bloqueo por KEYS en producción | Medio | Usar SCAN en lugar de KEYS para producción |
| Sin autenticación en Redis | Alto | `REDIS_PASSWORD` requerido en producción + ACLs |

---

## Integración con packages/config

| Variable de entorno | Default | Config |
|--------------------|---------|--------|
| `REDIS_URL` | `redis://localhost:6379` | `packages/config` |
| `REDIS_PASSWORD` | (optional) | `packages/config` |
| `REDIS_DB` | `0` | `packages/config` |
| `REDIS_TLS` | `false` | `packages/config` |
| `REDIS_KEY_PREFIX` | `tienda:` | `packages/config` |
| `REDIS_CONNECT_TIMEOUT` | `10000` | `packages/config` |
| `REDIS_RETRY_MAX_ATTEMPTS` | `10` | `packages/config` |
| `REDIS_RETRY_BASE_DELAY` | `500` | `packages/config` |
| `REDIS_RETRY_MAX_DELAY` | `30000` | `packages/config` |
| `REDIS_KEEP_ALIVE` | `30000` | `packages/config` |
| `REDIS_FAMILY` | `4` | `packages/config` |
| `REDIS_ENABLE_OFFLINE_QUEUE` | `true` | `packages/config` |
| `REDIS_LAZY_CONNECT` | `false` | `packages/config` |

---

## Uso desde servicios

```ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@core/cache/redis';

@Injectable()
export class MyService {
  constructor(private readonly redis: RedisService) {}

  async doSomething(): Promise<void> {
    await this.redis.set('key', { hello: 'world' }, 3600);
    const value = await this.redis.get<{ hello: string }>('key');
    await this.redis.del('key');
  }
}
```
