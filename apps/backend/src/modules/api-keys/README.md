# Módulo API Keys

Infraestructura Machine-to-Machine Authentication. API Keys, Service Accounts, Scopes, Rotación, Revocación, y preparado para OAuth Client Credentials, OpenID Connect, Signed Requests y más.

---

## Árbol completo

```
modules/api-keys/
├── index.ts                                # Barrel público
├── api-keys.module.ts                      # Módulo NestJS con DI
├── README.md
│
├── constants/
│   ├── index.ts
│   └── api-keys.constants.ts               # API_KEYS_CONSTANTS: key format, rotation, scopes, limits
│
├── domain/                                 # ── Capa DDD ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                        # ApiKey, ServiceAccount, KeyValidationResult, KeyRotationResult, MachineAuthResult, ScopeDefinition
│   ├── value-objects/
│   │   ├── index.ts
│   │   ├── api-key-id.vo.ts               # ApiKeyId (UUID)
│   │   ├── key-prefix.vo.ts               # KeyPrefix: validación a-z + dígitos
│   │   ├── service-account-id.vo.ts       # ServiceAccountId (UUID)
│   │   └── scope.vo.ts                    # Scope: formato resource.action, matching wildcard
│   ├── events/
│   │   ├── domain-event.ts                 # Abstract base
│   │   ├── key-created.event.ts           # Clave creada
│   │   ├── key-rotated.event.ts           # Clave rotada
│   │   ├── key-revoked.event.ts           # Clave revocada
│   │   ├── key-expired.event.ts           # Clave expirada
│   │   ├── key-used.event.ts              # Clave utilizada
│   │   ├── service-account-created.event.ts
│   │   ├── service-account-disabled.event.ts
│   │   ├── machine-authenticated.event.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── index.ts
│   │   └── api-key.exception.ts           # ApiKeyException + API_KEY_ERROR_CODES (20 códigos)
│   └── services/
│       ├── index.ts
│       ├── stores.ts                       # Interfaces IApiKeyStore, IServiceAccountStore, IKeyHashingService, IKeyGeneratorService
│       ├── api-key-domain.service.ts       # ApiKeyDomainService: create, validate, rotate, revoke, markUsed, cleanExpired
│       ├── service-account-domain.service.ts # ServiceAccountDomainService: create, updateScopes, disable, enable, suspend
│       └── scope-resolver.service.ts       # ScopeResolver: hasScope, hasAllScopes, filterScopes, matchesScope
│
├── application/                            # ── Puertos ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── index.ts
│   │   ├── api-key-service.interface.ts    # IApiKeyService
│   │   └── key-hashing.interface.ts       # IKeyHashingService, IKeyGeneratorService
│   ├── dto/
│   │   └── index.ts                        # CreateApiKeyRequestDto, ApiKeyResponseDto, ServiceAccountResponseDto, RotateKeyResponseDto, MachineAuthResponseDto
│   ├── commands/
│   │   ├── index.ts
│   │   ├── create-api-key.command.ts
│   │   ├── validate-api-key.command.ts
│   │   ├── rotate-api-key.command.ts
│   │   ├── revoke-api-key.command.ts
│   │   ├── create-service-account.command.ts
│   │   └── assign-scope.command.ts         # AssignScopeCommand, UpdateRolesCommand, UpdatePermissionsCommand
│   └── validators/
│       ├── index.ts
│       └── api-key.validators.ts           # ApiKeyValidators: format, scope, display name, prefix, header extraction
│
├── infrastructure/                         # ── Adaptadores ──
│   ├── index.ts
│   ├── hashing/
│   │   ├── index.ts
│   │   └── key-hashing.service.ts          # KeyHashingService: SHA-256 + timingSafeEqual
│   ├── generator/
│   │   ├── index.ts
│   │   └── key-generator.service.ts        # KeyGeneratorService: prefix + random bytes → SHA-256 hash
│   └── stores/
│       ├── index.ts
│       ├── in-memory-api-key.store.ts      # InMemoryApiKeyStore
│       └── in-memory-service-account.store.ts # InMemoryServiceAccountStore
│
├── presentation/                           # ── NestJS ──
│   ├── index.ts
│   ├── guards/
│   │   ├── index.ts
│   │   ├── api-key.guard.ts               # ApiKeyGuard: valida API Key del header Authorization
│   │   ├── service-account.guard.ts       # ServiceAccountGuard: verifica service account activa
│   │   ├── scope.guard.ts                 # ScopeGuard: verifica scopes requeridos vía @RequireScope
│   │   └── machine-auth.guard.ts          # MachineAuthGuard: auth + scopes todo en uno
│   └── decorators/
│       ├── index.ts
│       ├── require-api-key.decorator.ts    # @RequireApiKey()
│       ├── require-scope.decorator.ts      # @RequireScope('products.read', 'orders.write')
│       ├── current-api-key.decorator.ts    # @CurrentApiKey('displayName')
│       └── current-service-account.decorator.ts # @CurrentServiceAccount('name')
│
├── services/
│   ├── index.ts
│   └── api-key-app.service.ts             # ApiKeyAppService: @Injectable, orquesta domain services
│
├── providers/
│   ├── index.ts
│   └── api-key.providers.ts               # API_KEY_PROVIDERS (5 providers)
│
├── events/
│   ├── index.ts
│   └── api-key-event.handler.ts           # ApiKeyEventHandler: logs estructurados
│
├── exceptions/
│   ├── index.ts
│   └── http-exception.filter.ts           # ApiKeyExceptionFilter: excepción → HTTP status
│
└── validators/
    ├── index.ts
    └── api-key.validators.ts              # Re-export validators from application
```

---

## Arquitectura Machine Identity

```
┌────────────────────────────────────────────────────────────────────┐
│                       Api Keys Module                              │
│                                                                    │
│  ┌──────────────────────┐  ┌──────────────────────────┐           │
│  │   Service Account    │  │        API Keys          │           │
│  │                      │  │                          │           │
│  │  - name              │  │  - keyHash (SHA-256)     │           │
│  │  - ownerId (humano)  │  │  - keyPrefix (tia_)     │           │
│  │  - tenantId          │──│  - version               │           │
│  │  - branchId          │  │  - scopes                │           │
│  │  - scopes            │  │  - status                │           │
│  │  - roles             │  │  - expiresAt             │           │
│  │  - permissions       │  │  - lastUsedAt            │           │
│  │  - status            │  └───────────┬──────────────┘           │
│  └──────────┬───────────┘              │                           │
│             │                          │                           │
│             └────── 1 : N ─────────────┘                           │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │              Capas de Servicio                            │     │
│  │                                                          │     │
│  │  AppService    →  DomainService  →  Infrastructure       │     │
│  │                                                          │     │
│  │  ApiKeyAppSvc     ApiKeyDomainSvc    KeyHashingSvc      │     │
│  │                   ServiceAcctDomainSvc  KeyGeneratorSvc │     │
│  │                   ScopeResolver      InMemoryStores     │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │              Capa de Presentación (Guards)                │     │
│  │                                                          │     │
│  │  ApiKeyGuard → valida API Key del header                 │     │
│  │  ServiceAccountGuard → verifica service account activa   │     │
│  │  ScopeGuard → verifica scopes vía @RequireScope         │     │
│  │  MachineAuthGuard → auth + scopes todo en uno            │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │  Futuro: OAuth   │ │  Futuro: HMAC    │ │  Futuro: mTLS   │  │
│  │  Client Creds    │ │  Signed Requests │ │  Certificates   │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de creación de claves

```
Usuario (admin)
   │
   ▼
┌───────────────────────────────────────────────────────────────┐
│  POST /api-keys {                                             │
│    serviceAccountId, displayName, scopes,                     │
│    description?, expiresAt?                                   │
│  }                                                            │
│  Headers: Authorization: Bearer <admin-jwt>                   │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│  ApiKeyDomainService.createKey()                               │
│                                                                │
│  1. Validar ServiceAccount existe y está activo                │
│     → SERVICE_ACCOUNT_NOT_FOUND / DISABLED                    │
│                                                                │
│  2. Validar límite de claves activas (max 5)                  │
│     → KEY_LIMIT_EXCEEDED                                     │
│                                                                │
│  3. Validar formato de scopes                                 │
│     → SCOPE_INVALID                                          │
│                                                                │
│  4. KeyGeneratorService.generateKey('tia')                    │
│     → plainKey: "tia_aB3xK9mZ..." (66 chars)                 │
│     → keyHash: SHA-256(plainKey) → hex de 64 chars            │
│     → keyPrefix: "tia"                                        │
│     → keyLastChars: "k9mZ" (últimos 4)                       │
│                                                                │
│  5. ApiKey { id, keyHash, keyPrefix, keyLastChars,            │
│     version: 1, serviceAccountId, displayName,                │
│     scopes, status: 'active', expiresAt, createdAt }          │
│     → IApiKeyStore.save(apiKey)                               │
│                                                                │
│  6. Devolver { apiKey (sin plainKey), plainKey }              │
│     plainKey SOLO se devuelve UNA vez en creación             │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│  Response 201:                                                 │
│  {                                                             │
│    id, plainKey: "tia_aB3xK9mZ...",                          │
│    keyPrefix: "tia",                                          │
│    keyLastChars: "k9mZ",                                      │
│    version: 1, displayName, scopes,                           │
│    createdAt                                                  │
│  }                                                             │
│  ⚠ El cliente debe guardar plainKey (no se almacena)         │
└───────────────────────────────────────────────────────────────┘
```

---

## Flujo de validación

```
Request externo
   │
   ▼
┌───────────────────────────────────────────────────────────────┐
│  Header: Authorization: ApiKey tia_aB3xK9mZ...              │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│  ApiKeyGuard.canActivate()                                    │
│                                                                │
│  1. Extraer API Key del header                               │
│     → Authorization: Bearer <key> o ApiKey <key>             │
│     → Si no existe → 401 Unauthorized                        │
│                                                                │
│  2. Validar formato mínimo (≥ 32 chars, prefijo + _ + resto) │
│     → Si formato inválido → 401                               │
│                                                                │
│  3. SHA-256(plainKey) → keyHash                               │
│     (mismo hash que en creación)                              │
│                                                                │
│  4. IApiKeyStore.findByKeyHash(keyHash)                       │
│     → No encontrado → 401 ("Key not found")                  │
│                                                                │
│  5. Verificar status                                          │
│     → revoked → 401 ("Key has been revoked")                 │
│     → expired → 401 ("Key has expired")                      │
│                                                                │
│  6. Verificar expiresAt                                       │
│     → Expirado → status='expired', update store, 401         │
│                                                                │
│  7. Verificar ServiceAccount                                  │
│     → IServiceAccountStore.findById(apiKey.serviceAccountId) │
│     → No encontrado → 401                                     │
│     → disabled/suspended → 401                               │
│                                                                │
│  8. Actualizar lastUsedAt                                     │
│                                                                │
│  9. Inyectar request.apiKey, request.serviceAccount           │
│     request.machineAuth = true                                │
│     → return true (canActivate)                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Flujo de rotación

```
Admin
   │
   ▼
┌───────────────────────────────────────────────────────────────┐
│  POST /api-keys/:id/rotate                                   │
│  Headers: Authorization: Bearer <admin-jwt>                   │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│  ApiKeyDomainService.rotateKey(keyId)                         │
│                                                                │
│  1. Buscar API Key por ID                                     │
│     → KEY_NOT_FOUND si no existe                             │
│     → KEY_ALREADY_REVOKED si ya revocada                     │
│                                                                │
│  2. Verificar ServiceAccount activo                           │
│     → SERVICE_ACCOUNT_DISABLED si no                         │
│                                                                │
│  3. Marcar clave actual como 'rotating'                       │
│     → status = 'rotating'                                     │
│     → rotatedAt = now                                         │
│     → Grace period: 72 horas                                  │
│                                                                │
│  4. Generar NUEVA clave (KeyGeneratorService)                 │
│     → version = old.version + 1                               │
│     → mismos scopes, mismo displayName                        │
│     → status = 'active'                                       │
│                                                                │
│  5. Guardar nueva clave (IApiKeyStore.save)                   │
│     → Actualizar clave antigua                                │
│                                                                │
│  6. Devolver { newKeyId, plainKey (nueva), oldKeyId,         │
│     oldKeyVersion, newVersion, gracePeriodEndsAt }            │
└───────────────────────┬───────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│  Después de la rotación:                                      │
│                                                                │
│  Durante grace period (72h):                                  │
│  - Clave ANTIGUA (status='rotating') → aún válida            │
│  - Clave NUEVA (status='active') → válida                    │
│                                                                │
│  Después de grace period:                                     │
│  - Clave ANTIGUA debe revocarse manualmente                    │
│  - O usar cleanExpired() para cleanup automático             │
└───────────────────────────────────────────────────────────────┘
```

---

## Arquitectura Service Accounts

```
┌──────────────────────────────────────────────────────────┐
│                    ServiceAccount                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Información General                             │   │
│  │  - id (UUID)                                     │   │
│  │  - name: "MiConexion-WooCommerce"               │   │
│  │  - description: "Integración con WooCommerce"    │   │
│  │  - ownerId: usuário humano responsable           │   │
│  │  - status: active | disabled | suspended         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Tenant / Branch                                 │   │
│  │  - tenantId (opcional → multi-tenant)           │   │
│  │  - branchId (opcional → multi-sucursal)         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Authorization                                   │   │
│  │  - scopes: ["products.read", "orders.write"]     │   │
│  │  - roles: ["integration"]                        │   │
│  │  - permissions: ["order:create", "product:read"] │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Metadata                                        │   │
│  │  - metadata: { integration: "woocommerce" }      │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘

Los Service Accounts NO son usuarios humanos.
Son identidades de máquina (M2M).
Siempre tienen un owner humano responsable.
```

---

## Estrategia de Scopes

```
┌────────────────────────────────────────────────────────────┐
│                     Formato de Scopes                       │
│                                                             │
│  Formato:  <resource>.<action>                              │
│            <resource>.*    (wildcard para todas las acciones)│
│            <resource>       (todas las acciones)             │
│                                                             │
│  Ejemplos:                                                  │
│  - products.read                                            │
│  - products.write                                           │
│  - products.manage                                          │
│  - orders.read                                              │
│  - orders.write                                             │
│  - orders.*                                                 │
│  - admin                                                    │
│                                                             │
│  Validación:                                                │
│  - Resource: lowercase alfanumérico, empieza con letra      │
│  - Action: lowercase alfanumérico o wildcard (*)            │
│  - Longitud máxima: 128 chars                               │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                     Scope Matching                          │
│                                                             │
│  Service Account tiene: ["products.*", "orders.read"]      │
│                                                             │
│  ¿Tiene scope "products.read"?     → YES (wildcard)        │
│  ¿Tiene scope "products.write"?    → YES (wildcard)        │
│  ¿Tiene scope "orders.read"?       → YES (match exacto)   │
│  ¿Tiene scope "orders.write"?      → NO                   │
│  ¿Tiene scope "admin"?             → NO                   │
│                                                             │
│  ScopeResolver.hasScope() implementa:                      │
│  - Match exacto: "orders.read" ↔ "orders.read"            │
│  - Wildcard: "products.*" ↔ "products.read"               │
│  - Wildcard reverso: "products.read" ↔ "products.*"       │
│  - Wildcard universal: "*" ↔ cualquier scope              │
└────────────────────────────────────────────────────────────┘
```

---

## Guards

| Guard | Propósito | Uso |
|-------|-----------|-----|
| `ApiKeyGuard` | Valida API Key del header `Authorization` | `@UseGuards(ApiKeyGuard)` + `@RequireApiKey()` |
| `ServiceAccountGuard` | Verifica service account activa | `@UseGuards(ServiceAccountGuard)` |
| `ScopeGuard` | Verifica scopes requeridos | `@UseGuards(ScopeGuard)` + `@RequireScope('x.y')` |
| `MachineAuthGuard` | Auth + scopes combinados | `@UseGuards(MachineAuthGuard)` |

## Decorators

| Decorator | Propósito |
|-----------|-----------|
| `@RequireApiKey()` | Marca endpoint como requiring API key |
| `@RequireScope('products.read', 'orders.write')` | Scopes requeridos |
| `@CurrentApiKey(field?)` | Extrae API key del request |
| `@CurrentServiceAccount(field?)` | Extrae service account del request |

---

## Uso combinado con Authentication

```typescript
// Endpoint accesible SOLO vía API Key + scopes específicos:
@UseGuards(ApiKeyGuard, ScopeGuard)
@RequireScope('products.read')
@Get('/products')
getProducts(@CurrentServiceAccount('name') account: string) { ... }

// Endpoint accesible por humanos O máquinas:
@UseGuards(AuthenticationGuard)
@UseGuards(MachineAuthGuard)
@Get('/stats')
getStats() { ... }

// Service Account protegida por autenticación humana:
@UseGuards(AuthenticationGuard)
@Post('/api-keys')
createKey(@Body() dto: CreateApiKeyRequestDto) { ... }
```

---

## Eventos

| Evento | Disparo |
|--------|---------|
| `KeyCreatedEvent` | `api_keys.key.created` |
| `KeyRotatedEvent` | `api_keys.key.rotated` |
| `KeyRevokedEvent` | `api_keys.key.revoked` |
| `KeyExpiredEvent` | `api_keys.key.expired` |
| `KeyUsedEvent` | `api_keys.key.used` |
| `ServiceAccountCreatedEvent` | `api_keys.service_account.created` |
| `ServiceAccountDisabledEvent` | `api_keys.service_account.disabled` |
| `MachineAuthenticatedEvent` | `api_keys.machine.authenticated` |

---

## Error Codes

| Código | HTTP | Causa |
|--------|------|-------|
| `API_KEY_NOT_FOUND` | 404 | Clave no encontrada |
| `API_KEY_EXPIRED` | 401 | Clave expirada |
| `API_KEY_REVOKED` | 401 | Clave revocada |
| `API_KEY_INVALID` | 401 | Clave inválida (no coincide hash) |
| `API_KEY_INVALID_FORMAT` | 400 | Formato de clave incorrecto |
| `API_KEY_ALREADY_REVOKED` | 409 | Clave ya revocada |
| `API_KEY_ROTATION_FAILED` | 500 | Error en rotación |
| `API_KEY_LIMIT_EXCEEDED` | 429 | Máximo de claves activas alcanzado |
| `SERVICE_ACCOUNT_NOT_FOUND` | 404 | Service account no encontrada |
| `SERVICE_ACCOUNT_DISABLED` | 403 | Service account deshabilitada |
| `SERVICE_ACCOUNT_SUSPENDED` | 403 | Service account suspendida |
| `SCOPE_INVALID` | 400 | Formato de scope inválido |
| `SCOPE_NOT_ASSIGNED` | 403 | Scope no asignado a la cuenta |
| `MACHINE_AUTH_FAILED` | 401 | Autenticación M2M falló |
| `GRACE_PERIOD_EXPIRED` | 410 | Grace period de rotación expiró |

---

## Seguridad

| Requisito | Implementación |
|-----------|----------------|
| **Hashed Storage** | SHA-256, nunca texto plano |
| **Constant Time Comparison** | timingSafeEqual en verificación |
| **Key Prefix** | `tia_` (identificación de origen) |
| **Key Rotation** | Versioning + grace period 72h |
| **Expiration** | expiresAt + auto-expire en validación |
| **Least Privilege** | Scopes granulares por resource.action |
| **Replay Protection Hooks** | Challenge system (futuro) |
| **Rate Limiting Hooks** | API_KEY_LIMIT_EXCEEDED |

---

## Constantes

| Constante | Valor | Descripción |
|-----------|-------|-------------|
| `KEY_PREFIX` | `tia` | Prefijo por defecto |
| `KEY_RANDOM_BYTES` | 32 | Bytes aleatorios de la clave |
| `KEY_DISPLAY_SUFFIX_LENGTH` | 4 | Últimos chars para display |
| `KEY_MAX_AGE_DAYS` | 365 | Expiración por defecto |
| `KEY_ROTATION_GRACE_PERIOD_HOURS` | 72 | Grace period post-rotación |
| `MAX_ACTIVE_KEYS_PER_SERVICE_ACCOUNT` | 5 | Límite de claves activas |
| `KEY_VERSION_INITIAL` | 1 | Versión inicial |

---

## Preparado para Futuro

| Feature | Punto de extensión |
|---------|-------------------|
| **OAuth Client Credentials** | `IApiKeyService` → extender con `tokenEndpoint()` |
| **OpenID Connect** | `MachineAuthGuard` → añadir verificación de ID token |
| **Signed Requests** | `infrastructure/signing/` + middleware de verificación |
| **Webhook Signatures** | `infrastructure/webhooks/` + `IWebhookSigner` |
| **HMAC** | `IKeyHashingService` → implementación HMAC |
| **mTLS** | `presentation/guards/mtls.guard.ts` |
| **API Gateway** | Guards reutilizables para gateway |
| **Developer Portal** | ServiceAccount + ApiKey como recursos REST |

Ninguna de estas features requiere modificar el core del módulo API Keys.

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ Interfaces para stores (IApiKeyStore, IServiceAccountStore)
✓ Interfaces para providers (IKeyHashingService, IKeyGeneratorService)
✓ Constant-time comparison (timingSafeEqual)
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **API Key en texto plano** | Exposición si se intercepta | Solo se muestra en creación, SHA-256 almacenado |
| **Grace period abierto** | Clave antigua sigue válida 72h | Cleanup automático post grace period |
| **Sin rate limiting global** | Bruteforce de API keys | Implementar a nivel de gateway |
| **Service Account sin owner** | Cuentas huérfanas | ownerId requerido siempre |
| **Scopes excesivos** | Privilegio elevado | ScopeResolver limita a scopes asignados |
| **Sin auditoría de uso** | No saber quién usó qué | KeyUsedEvent + logger |

---

## Recomendaciones

1. **Implementar PrismaApiKeyStore** y **PrismaServiceAccountStore** para persistencia real.
2. **Agregar rate limiting** por API key en el gateway (redis + contador por keyId).
3. **Implementar expiración automática** con un cron job que ejecute `cleanExpired()`.
4. **Agregar endpoints REST expuestos** - el módulo tiene toda la lógica, falta controller.
5. **Implementar OAuth Client Credentials** como próximo paso — el módulo está preparado.
6. **Agregar webhook de eventos** para notificar rotaciones/revocaciones a integraciones.
7. **Extender `ApiKeyException`** desde `AppException` para integración con `GlobalExceptionFilter`.
8. **Agregar IP allowlisting** para Service Accounts críticas (futuro: en metadata).
