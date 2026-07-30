# Módulo Tenant

Infraestructura Multi-Tenant desacoplada. Resolución de contexto, aislamiento entre tenants, configuración por organización y sucursal.

---

## Árbol completo

```
modules/tenant/
├── index.ts                                # Barrel público del módulo
├── tenant.module.ts                        # Módulo NestJS con DI
├── README.md
│
├── domain/                                 # ── Capa DDD ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                        # TenantInfo, BranchInfo, TenantSettings, TenantContext, TenantFeature, TenantResolutionStrategy, DEFAULT_TENANT_SETTINGS
│   ├── value-objects/
│   │   └── index.ts                        # TenantId (UUID)
│   ├── entities/
│   │   ├── tenant-settings.entity.ts       # TenantConfiguration: settings, branding, features flags
│   │   └── index.ts
│   ├── events/
│   │   ├── domain-event.ts                 # Base abstract
│   │   ├── tenant-created.event.ts
│   │   ├── tenant-updated.event.ts
│   │   ├── tenant-activated.event.ts
│   │   ├── tenant-suspended.event.ts
│   │   ├── branch-created.event.ts
│   │   ├── branch-updated.event.ts
│   │   ├── context-resolved.event.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── tenant.exception.ts             # TenantException + TENANT_ERROR_CODES (13 códigos)
│   │   └── index.ts
│   └── services/
│       ├── tenant-resolver.service.ts      # TenantResolver: 6 estrategias de resolución + ITenantLookup
│       ├── context-manager.service.ts      # ContextManager: build/load/clear/switch + IContextStore + IBranchLookup
│       ├── tenant-validator.service.ts     # TenantValidator: valida estado, acceso, slugs, tax ID, branch code
│       ├── settings-manager.service.ts     # SettingsManager: CRUD settings, branding, feature flags + ITenantConfigStore
│       └── index.ts
│
├── application/                            # ── Puertos ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── tenant-service.interface.ts     # ITenantService
│   │   └── index.ts
│   ├── dto/
│   │   └── index.ts                        # TenantContextResponseDto, TenantSettingsDto, SwitchBranchDto
│   └── validators/
│       ├── tenant.validators.ts            # Validación: tenant name, slug, tax ID, branch code, locale, currency, timezone
│       └── index.ts
│
├── infrastructure/                         # ── Adaptadores ──
│   ├── index.ts
│   ├── context/
│   │   ├── redis-context-store.ts          # RedisContextStore: cache de contexto en Redis (TTL 5min)
│   │   └── index.ts
│   ├── resolver/
│   │   ├── default-tenant-lookup.ts        # DefaultTenantLookup: lookup en memoria (provisorio)
│   │   └── index.ts
│   └── repositories/
│       ├── in-memory-tenant-config.store.ts # InMemoryTenantConfigStore: settings en memoria
│       └── index.ts
│
├── presentation/                           # ── NestJS ──
│   ├── index.ts
│   ├── middleware/
│   │   ├── tenant-context.middleware.ts    # TenantContextMiddleware: resuelve tenant + branch + settings por request
│   │   ├── branch-context.middleware.ts    # BranchContextMiddleware: establece branchId del header o contexto
│   │   ├── locale-timezone.middleware.ts   # LocaleTimezoneMiddleware: establece locale/timezone/currency del contexto
│   │   └── index.ts
│   ├── guards/
│   │   ├── tenant.guard.ts                # TenantGuard: verifica contexto + tenant activo/no suspendido
│   │   ├── branch.guard.ts                # BranchGuard: verifica branch en contexto + match con params
│   │   ├── organization.guard.ts          # OrganizationGuard: verifica organization match
│   │   └── index.ts
│   ├── interceptors/
│   │   ├── tenant-context.interceptor.ts  # TenantContextInterceptor: inyecta __tenant en request
│   │   └── index.ts
│   └── decorators/
│       ├── current-tenant.decorator.ts    # @CurrentTenant('id'|'slug'|'name'|'settings')
│       ├── current-branch.decorator.ts    # @CurrentBranch('id'|'name')
│       └── index.ts
│
├── services/
│   ├── tenant-app.service.ts              # TenantAppService: implementación DI con Redis + validación
│   └── index.ts
│
├── providers/
│   ├── tenant.providers.ts                # TENANT_PROVIDERS + TenantServiceProvider
│   └── index.ts
│
├── events/
│   ├── tenant-event.handler.ts            # Logs estructurados
│   └── index.ts
│
├── exceptions/
│   ├── http-exception.filter.ts           # Filtro HTTP para TenantException
│   └── index.ts
│
├── validators/
│   ├── tenant.validators.ts               # Funciones validadoras exportables
│   └── index.ts
│
├── constants/
│   └── index.ts                           # TENANT_CONSTANTS: TTLs, defaults, límites
│
├── interfaces/
│   └── index.ts                           # Re-export ITenantService
│
├── dto/
│   └── index.ts                           # Re-export DTOs
│
└── types/
    └── index.ts                           # Express Request augmentation (tenantContext, tenantId, branchId, locale, timezone, currency)
```

---

## Arquitectura Multi-Tenant

```
┌──────────────────────────────────────────────────────────┐
│                   Tenant Module                           │
│                                                           │
│  ┌────────────────┐  ┌───────────────────┐               │
│  │ TenantResolver  │  │  ContextManager   │               │
│  │ - subdomain     │  │  - buildContext() │               │
│  │ - domain        │  │  - loadContext()  │               │
│  │ - header        │  │  - clearContext() │               │
│  │ - jwt           │  │  - switchBranch() │               │
│  │ - api_key       │  └───────┬───────────┘               │
│  │ - path          │          │                           │
│  └────────┬────────┘          │                           │
│           │                   ▼                           │
│           │          ┌───────────────────┐               │
│           │          │   RedisContextStore│               │
│           │          │   tenant_context:  │               │
│           │          │   {userId}:{orgId} │               │
│           │          └───────────────────┘               │
│           │                                               │
│           ▼                                               │
│  ┌────────────────┐  ┌───────────────────┐               │
│  │ SettingsManager│  │  TenantValidator  │               │
│  │ - settings     │  │  - tenant active  │               │
│  │ - branding     │  │  - branch active  │               │
│  │ - features     │  │  - cross-tenant   │               │
│  └────────────────┘  └───────────────────┘               │
│                                                           │
│  Capa Presentation:                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │  Middleware   │ │    Guards    │ │  Decorators  │      │
│  │ - TenantCtx  │ │ - Tenant     │ │ - @CurTenant │      │
│  │ - BranchCtx  │ │ - Branch     │ │ - @CurBranch│      │
│  │ - LocaleTZ   │ │ - Org        │ │              │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
└──────────────────────────────────────────────────────────┘
```

---

## Estrategia de resolución de Tenant

```
Request HTTP
       │
       ▼
┌─────────────────────────────────────────────────┐
│             TenantResolver.resolve()             │
│                                                  │
│  Estrategia configurable (DI):                   │
│                                                  │
│  subdomain  →  req.hostname.split('.')[0]        │
│       │         → ITenantLookup.findBySlug()     │
│                                                  │
│  domain     →  req.hostname                      │
│       │         → ITenantLookup.findByDomain()   │
│                                                  │
│  header     →  req.headers['x-tenant-id']        │
│       │         → lookup by id o slug            │
│                                                  │
│  jwt        →  req.user['tenantId']              │
│       │         → ITenantLookup.findById()       │
│                                                  │
│  api_key    →  from API key registry             │
│       │         (preparado para futuro)          │
│                                                  │
│  path       →  req.params['tenant']              │
│                → lookup by id o slug             │
└─────────────────────────────────────────────────┘
       │
       ▼
   TenantInfo { id, slug, name, status, tier }
```

---

## Estrategia de resolución de Branch

```
ContextManager.buildContext()
       │
       ▼
┌─────────────────────────────────────────────────┐
│  1. Si branchId viene en el request:            │
│     → IBranchLookup.findById(branchId)          │
│                                                  │
│  2. Si NO viene:                                 │
│     → IBranchLookup.findMainByTenantId(orgId)   │
│       (primera branch marcada como isMain)       │
│                                                  │
│  3. Si no hay main branch:                       │
│     → branch = null (contexto sin branch)        │
│       (el sistema sigue funcionando,             │
│        algunos endpoints requieren branch)       │
└─────────────────────────────────────────────────┘
```

---

## Flujo de carga de contexto

```
Request con JWT
       │
       ▼
┌──────────────────────┐
│ Authentication       │
│ Guard (JWT)          │
└────────┬─────────────┘
         │ user = { userId, email, tenantId }
         ▼
┌──────────────────────┐
│ TenantContext        │
│ Middleware           │
│                      │
│ 1. Resolver tenant   │── header x-tenant-id o JWT
│ 2. Resolver branch   │── header x-branch-id o main branch
│ 3. Cargar settings   │── Redis o default
│ 4. Validar estado    │── tenant activo, branch activa
│ 5. Cachear contexto  │── Redis (TTL 5min)
│ 6. req.tenantContext │── inyectado en request
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ LocaleTimezone       │
│ Middleware           │
│                      │
│ → req.locale         │── del contexto o header
│ → req.timezone       │── del contexto o header  
│ → req.currency       │── del contexto o header
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Guard opcional:      │
│ TenantGuard          │── 403 si tenant suspendido
│ BranchGuard          │── 403 si branch mismatch
│ OrganizationGuard    │── 403 si org mismatch
└────────┬─────────────┘
         │
         ▼
    Controller
```

---

## Estrategia de aislamiento

```
┌─────────────────────────────────────────────────────────┐
│               Tenant Isolation Strategy                 │
│                                                         │
│  1. Tenant Context Middleware                           │
│     → Resuelve tenant automaticamente por request       │
│     → Inyecta tenantContext en req                      │
│                                                         │
│  2. Tenant Guard                                        │
│     → Verifica que exista contexto                      │
│     → Rechaza si tenant está suspended/inactive         │
│                                                         │
│  3. OrganizationGuard                                   │
│     → Compara params/body.organizationId con contexto   │
│     → Rechaza si no coinciden (cross-tenant)            │
│                                                         │
│  4. BranchGuard                                         │
│     → Compara params/branchId con contexto              │
│     → Rechaza si branch no asignada                     │
│                                                         │
│  5. Cross-Tenant Protection (TenantValidator)           │
│     → validateTenantAccess(requestId, userTenantIds)    │
│     → Lanza TENANT_MISMATCH si no hay acceso            │
│                                                         │
│  6. Repository Layer (futuro)                           │
│     → Todos los queries filtran por tenantId            │
│     → WHERE tenantId = req.tenantContext.tenant.id     │
└─────────────────────────────────────────────────────────┘
```

---

## Guards

| Guard | Propósito | HTTP Status |
|-------|-----------|-------------|
| `TenantGuard` | Verifica contexto + tenant activo/no suspendido | 403 |
| `BranchGuard` | Verifica branch en contexto + match con params | 403 |
| `OrganizationGuard` | Verifica organization match con contexto | 403 |

---

## Middleware

| Middleware | Propósito |
|------------|-----------|
| `TenantContextMiddleware` | Resuelve tenant + branch + settings por request |
| `BranchContextMiddleware` | Establece branchId del header o contexto |
| `LocaleTimezoneMiddleware` | Establece locale/timezone/currency del contexto |

---

## Eventos

| Evento | Disparo |
|--------|---------|
| `TenantCreatedEvent` | Nuevo tenant registrado |
| `TenantUpdatedEvent` | Tenant modificado |
| `TenantActivatedEvent` | Tenant activado |
| `TenantSuspendedEvent` | Tenant suspendido |
| `BranchCreatedEvent` | Nueva sucursal |
| `BranchUpdatedEvent` | Sucursal modificada |
| `ContextResolvedEvent` | Contexto resuelto |

---

## Observabilidad

Eventos registrados (Logger — nunca JWT, passwords, secrets):
- `tenant.context.resolved` — contexto resuelto (tenantId, slug, branchId)
- `tenant.context.failed` — fallo en resolución
- `tenant.settings.updated` — settings actualizados
- `tenant.guard.*` — resultados de guards
- `tenant.branch_guard.*` — resultados de branch guard
- `tenant.organization_guard.*` — resultados de org guard
- `tenant.event.*` — eventos de dominio

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ Redis integrado via RedisService
✓ Interfaces para todos los stores (IContextStore, ITenantLookup, IBranchLookup, ITenantConfigStore)
✓ Todas las dependencias inyectadas vía DI
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Contexto expirado en Redis** | Usuario sin tenant | TTL 5min + middleware refresca automáticamente |
| **Cross-tenant access** | Fuga de datos | OrganizationGuard + TenantValidator.validateTenantAccess() |
| **Tenant suspendido operando** | Violación de términos | TenantGuard verifica status antes de cada request |
| **Sin branch en contexto** | Operaciones fallan | BranchGuard opcional según endpoint |
| **Lookup en memoria** | No escala horizontal | DefaultTenantLookup es provisorio → reemplazar con Prisma |
| **Settings en memoria** | Configuración volátil | InMemoryTenantConfigStore es provisorio → reemplazar con Redis/Prisma |

---

## Recomendaciones

1. **Implementar PrismaTenantLookup** conectado a tabla `organizations` de Identity para resolución real.
2. **Implementar PrismaBranchLookup** conectado a tabla `branches` de Identity.
3. **Implementar RedisTenantConfigStore** para settings persistentes en Redis en vez de memoria.
4. **Agregar `@InjectTenantContext()` decorator** para inyección directa del contexto en servicios.
5. **Agregar filtro global de Prisma** que inyecte automáticamente `tenantId` en todos los queries.
6. **Implementar resolución por subdominio** extrayendo el tenant del hostname (`empresa.mitienda.com`).
7. **Configurar TenantGuard globalmente** en el módulo para protección por defecto en todos los endpoints.
8. **Extender `TenantException`** desde `AppException` para integración con `GlobalExceptionFilter`.
