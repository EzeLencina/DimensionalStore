# Módulo Session

Sistema desacoplado de gestión de sesiones con Redis, DDD, y Clean Architecture.

---

## Árbol completo

```
modules/session/
├── index.ts                                    # Barrel público del módulo
├── session.module.ts                           # Módulo NestJS con DI
├── README.md
│
├── domain/                                     # ── Capa DDD ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                            # SessionStatus, DeviceType, DeviceInfo, SessionMetadata, SessionPolicy, CreateSessionParams
│   ├── value-objects/
│   │   ├── session-id.value-object.ts          # SessionId con validación de longitud
│   │   ├── device-id.value-object.ts           # DeviceId UUID
│   │   └── index.ts
│   ├── entities/
│   │   ├── session.entity.ts                   # Session: ciclo de vida completo (touch, renew, revoke, expire)
│   │   ├── device.entity.ts                    # Device: registro de dispositivo
│   │   └── index.ts
│   ├── events/
│   │   ├── domain-event.ts                     # Base abstract
│   │   ├── session-created.event.ts            # Sesión creada
│   │   ├── session-revoked.event.ts            # Sesión revocada
│   │   ├── session-expired.event.ts            # Sesión expirada
│   │   ├── session-refreshed.event.ts          # Sesión renovada
│   │   ├── device-registered.event.ts          # Dispositivo registrado
│   │   ├── device-removed.event.ts             # Dispositivo eliminado
│   │   ├── concurrent-session-detected.event.ts # Sesión concurrente detectada
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── session.exception.ts                # SessionException + SESSION_ERROR_CODES (13 códigos)
│   │   └── index.ts
│   └── services/
│       ├── session-factory.service.ts          # Crea Session y Device a partir de parámetros
│       ├── session-validator.service.ts        # Valida estado de sesión, ownership, límites
│       ├── session-manager.service.ts          # Orquestador del ciclo de vida (Store + DeviceStore interfaces)
│       └── index.ts
│
├── application/                                # ── Puertos ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── session-service.interface.ts        # ISessionService
│   │   └── index.ts
│   ├── dto/
│   │   └── index.ts                            # CreateSessionRequestDto, SessionResponseDto, DeviceResponseDto, etc.
│   └── validators/
│       ├── session.validators.ts               # Validación: sessionId, deviceId, IP, UA, timezone, locale, deviceType
│       └── index.ts
│
├── infrastructure/                             # ── Adaptadores ──
│   ├── index.ts
│   └── redis/
│       ├── redis-session.repository.ts         # RedisSessionRepository: CRUD sesiones en Redis con SET+SETEX+SADD
│       ├── redis-device.repository.ts           # RedisDeviceRepository: CRUD dispositivos en Redis
│       └── index.ts
│
├── presentation/                               # ── NestJS ──
│   ├── index.ts
│   ├── guards/
│   │   ├── active-session.guard.ts             # ActiveSessionGuard: verifica sesión activa vía x-session-id
│   │   ├── valid-session.guard.ts              # ValidSessionGuard: valida sesión (cualquier estado válido)
│   │   ├── session-ownership.guard.ts          # SessionOwnershipGuard: verifica ownership del usuario
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── session-context.interceptor.ts      # Inyecta __session en el request
│   │   ├── last-activity.interceptor.ts        # Actualiza lastActivity post-handler
│   │   ├── session-metadata.interceptor.ts     # Agrega IP, UA, timezone, locale a __session
│   │   └── index.ts
│   └── decorators/
│       ├── current-session.decorator.ts        # @CurrentSession() — inyecta session del request
│       └── index.ts
│
├── services/
│   ├── session-app.service.ts                  # SessionAppService: implementación DI con integración Redis
│   └── index.ts
│
├── providers/
│   ├── session.providers.ts                    # SESSION_PROVIDERS + SessionServiceProvider
│   └── index.ts
│
├── events/
│   ├── session-event.handler.ts                # Logs estructurados para eventos de sesión
│   └── index.ts
│
├── exceptions/
│   ├── http-exception.filter.ts                # Filtro HTTP para SessionException
│   └── index.ts
│
├── validators/
│   ├── session.validators.ts                   # Funciones validadoras exportables
│   └── index.ts
│
├── constants/
│   └── index.ts                                # AUTH_CONSTANTS: límites, TTLs, prefijos Redis
│
├── interfaces/
│   └── index.ts                                # Re-export ISessionService
│
├── dto/
│   └── index.ts                                # Re-export DTOs
│
└── types/
    └── index.ts                                # Express Request augmentation (session, __session)
```

---

## Arquitectura Session Manager

```
┌─────────────────────────────────────────────────────────────┐
│                     SessionManager                          │
│                                                             │
│  Dependencias:                                              │
│  ├── ISessionStore (RedisSessionRepository)                 │
│  ├── IDeviceStore (RedisDeviceRepository)                   │
│  ├── SessionFactory                                         │
│  ├── SessionValidator                                       │
│  └── SessionPolicy                                          │
│                                                             │
│  Operaciones:                                               │
│  ├── createSession(params) → Session                        │
│  ├── loadSession(id) → Session | null                       │
│  ├── getValidSession(id) → Session (valida estado)          │
│  ├── refreshSession(id) → RenewSessionResult                │
│  ├── revokeSession(id, reason?)                             │
│  ├── revokeAllUserSessions(userId, reason?)                  │
│  ├── touchSession(id)                                       │
│  ├── expireSession(id)                                      │
│  ├── getUserSessions(userId) → SessionMetadata[]            │
│  ├── getUserDevices(userId) → Device[]                      │
│  ├── registerDevice(userId, info) → Device                  │
│  └── removeDevice(deviceId)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de creación de sesión

```
Authentication Service              SessionManager               Redis
       │                                  │                        │
       │  createSession(params)           │                        │
       ├─────────────────────────────────►│                        │
       │                                  │                        │
       │                           ┌──────┴──────┐                │
       │                           │ ¿Device      │                │
       │                           │ existe?      │                │
       │                           └──────┬──────┘                │
       │                                  │                        │
       │                         No      │       Sí               │
       │                           ┌──────┘                       │
       │                           ▼                              │
       │                    ┌──────────────┐                      │
       │                    │ Crear Device │                      │
       │                    │ (DeviceRepo) │──► HSET device:{id}  │
       │                    └──────┬───────┘    SADD user_devices │
       │                           │                              │
       │                           ▼                              │
       │                    ┌──────────────┐                      │
       │                    │ Validar       │                      │
       │                    │ concurrentes  │                      │
       │                    └──────┬───────┘                      │
       │                           │                              │
       │                           ▼                              │
       │                    ┌──────────────┐                      │
       │                    │ Crear Session│                      │
       │                    │ (Factory)    │                      │
       │                    └──────┬───────┘                      │
       │                           │                              │
       │                           ▼                              │
       │                    ┌──────────────┐                      │
       │                    │ Guardar      │──── SETEX session:{id}│
       │                    │ Session      │     SADD user_sessions│
       │                    └──────┬───────┘                      │
       │                           │                              │
       │◄──────────────────────────┘                              │
       │   Session                                                 │
```

---

## Flujo de revocación

```
Session Service                  SessionManager                Redis
       │                              │                          │
       │  revokeSession(id, reason)   │                          │
       ├─────────────────────────────►│                          │
       │                              │                          │
       │                       ┌──────┴──────┐                  │
       │                       │ Buscar       │                  │
       │                       │ Session      │── GET session:id │
       │                       └──────┬──────┘                  │
       │                              │                          │
       │                       ┌──────┴──────┐                  │
       │                       │ session      │                  │
       │                       │ .revoke()    │                  │
       │                       └──────┬──────┘                  │
       │                              │                          │
       │                       ┌──────┴──────┐                  │
       │                       │ Guardar      │── SET session:id │
       │                       └──────┬──────┘                  │
       │                              │                          │
       │                       Logger: session.revoked           │
       │                              │                          │
       │◄─────────────────────────────┘                          │
```

---

## Arquitectura Device Registry

```
┌─────────────────────────────────────────────────────────────┐
│                     RedisDeviceRepository                   │
│                                                             │
│  Keys:                                                      │
│  ├── device:{deviceId} → { JSON del Device }               │
│  └── user_devices:{userId} → SET de deviceIds              │
│                                                             │
│  Device Entity:                                             │
│  ├── deviceId: UUID                                         │
│  ├── userId: UUID del dueño                                 │
│  ├── type: desktop | mobile | tablet | browser | api_client │
│  ├── name: string                                           │
│  ├── os: string                                             │
│  ├── browser: string                                        │
│  ├── isTrusted: boolean                                     │
│  ├── isRemembered: boolean                                  │
│  ├── firstSeen: Date                                        │
│  └── lastSeen: Date                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrategia de expiración

```
┌─────────────────────────────────────────────────────────────┐
│                  Expiration Strategy                        │
│                                                             │
│  Absolute Timeout (7 días por defecto):                     │
│  └── Redis TTL en SETEX session:{id}                        │
│      → Redis elimina automáticamente la key                 │
│      → Session se marca como 'expired' al cargar            │
│                                                             │
│  Idle Timeout (30 min por defecto):                         │
│  └── Se verifica en getValidSession()                       │
│      → lastActivity + idleTimeout < now → expired           │
│                                                             │
│  Refresh (Renovación):                                      │
│  └── session.renew(ttlMs) → actualiza expiresAt             │
│      → Se re-guarda en Redis con nuevo TTL                  │
│                                                             │
│  Revocación:                                                │
│  └── session.revoke(reason) → status='revoked'              │
│      → Se guarda en Redis (no se elimina, para auditoría)   │
│      → Se remueve del SET user_sessions:{userId}            │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrategia de Redis

```
┌─────────────────────────────────────────────────────────────┐
│                     Redis Namespace                         │
│                                                             │
│  session:{sessionId}     → SessionMetadata JSON (TTL 7d)    │
│  user_sessions:{userId}  → SET de sessionIds (TTL 7d)       │
│  device:{deviceId}       → Device JSON (sin TTL)            │
│  user_devices:{userId}   → SET de deviceIds                 │
│                                                             │
│  RedisService (inyectado via DI):                           │
│  ├── setJson(key, value, ttl?)                              │
│  ├── get(key)                                               │
│  ├── del(key)                                               │
│  ├── sadd(key, ...members)                                  │
│  ├── srem(key, ...members)                                  │
│  ├── smembers(key)                                          │
│  ├── expire(key, ttl)                                       │
│  └── mget(keys)                                             │
│                                                             │
│  RedisModule de CoreModule (global):                        │
│  └── RedisService disponible sin imports adicionales        │
└─────────────────────────────────────────────────────────────┘
```

---

## Guards

| Guard | Propósito | HTTP Status |
|-------|-----------|-------------|
| `ActiveSessionGuard` | Verifica que la sesión esté activa (no expirada/revocada) | 401 |
| `ValidSessionGuard` | Verifica que exista una sesión válida (cualquier estado) | 401 |
| `SessionOwnershipGuard` | Verifica que la sesión pertenezca al usuario autenticado | 403 |

---

## Interceptors

| Interceptor | Propósito |
|-------------|-----------|
| `SessionContextInterceptor` | Inyecta `__session` en el request con datos de la sesión |
| `LastActivityInterceptor` | Actualiza `lastActivity` post-handler (fire-and-forget) |
| `SessionMetadataInterceptor` | Agrega IP, User-Agent, timezone, locale a `__session` |

---

## Events

| Evento | Disparo |
|--------|---------|
| `SessionCreatedEvent` | Sesión creada |
| `SessionRevokedEvent` | Sesión revocada |
| `SessionExpiredEvent` | Sesión expirada |
| `SessionRefreshedEvent` | Sesión renovada |
| `DeviceRegisteredEvent` | Dispositivo registrado |
| `DeviceRemovedEvent` | Dispositivo eliminado |
| `ConcurrentSessionDetectedEvent` | Límite de concurrentes alcanzado |

---

## Observabilidad

Eventos registrados (Logger — nunca JWT, passwords, secrets):
- `session.created` — sesión creada (userId, deviceType, ip)
- `session.refreshed` — sesión renovada
- `session.revoked` / `session.revoked_all` — sesión revocada
- `session.active_guard.*` — active session guard results
- `session.valid_guard.*` — valid session guard results
- `session.ownership_guard.*` — ownership guard results
- `session.event.*` — eventos de dominio

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ Redis integrado via RedisService
✓ Todas las dependencias inyectadas vía DI
✓ Interfaces para stores (ISessionStore, IDeviceStore)
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Redis caído** | Sesiones no disponibles | RedisService lanza excepciones manejables |
| **SET user_sessions sin TTL** | Huérfanos | TTL de 7d en ambos SET y keys individuales |
| **Session no encontrada** | Falsa revocación | SessionValidator lanza SESSION_NOT_FOUND |
| **Concurrentes no controladas** | Abuso de sesiones | SessionPolicy.maxConcurrentSessions (default 5) |
| **IP spoofing** | Suplantación | IP capturada del request (no confiable ciego) |
| **Device sin registrar** | Sesiones huérfanas | Device se crea automáticamente en createSession |

---

## Recomendaciones

1. **Conectar EventBus** al `SessionEventHandler` para publicación real de eventos.
2. **Extender `SessionException`** desde `AppException` para integración con `GlobalExceptionFilter`.
3. **Implementar cron de limpieza** para sesiones expiradas no eliminadas por Redis TTL.
4. **Agregar rate limiting** al endpoint de creación de sesiones.
5. **Implementar `TrustedDeviceService`** en una fase posterior usando el campo `isTrusted`.
6. **Agregar geolocalización** IP → pais/ciudad para detección de cambios geográficos.
7. **Implementar `SessionPolicy` configurable** por organización/tenant en lugar de valores fijos.
