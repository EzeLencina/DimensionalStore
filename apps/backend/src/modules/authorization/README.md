# Módulo Authorization

Sistema completo de autorización con RBAC, Policy Engine, Permission Registry, Guards y Decorators.

---

## Árbol completo

```
modules/authorization/
├── index.ts                                                # Barrel público
├── authorization.module.ts                                # Módulo NestJS
├── README.md
│
├── domain/                                                 # ── Capa DDD ──
│   ├── index.ts
│   ├── types/
│   │   └── index.ts                                       # Effect, ScopeType, ActionName, Scope, Resource, PolicyRule, AuthorizationResult, RoleAssignment
│   ├── value-objects/
│   │   ├── role-id.value-object.ts                        # RoleId UUID
│   │   ├── permission-id.value-object.ts                  # PermissionId UUID
│   │   ├── policy-id.value-object.ts                      # PolicyId UUID
│   │   └── index.ts
│   ├── entities/
│   │   ├── role.entity.ts                                 # Role con permisos, jerarquía, nivel
│   │   ├── permission.entity.ts                            # Permission (resource + action + scope)
│   │   ├── policy.entity.ts                               # Policy con reglas + prioridad + conditions
│   │   └── index.ts
│   ├── events/
│   │   ├── domain-event.ts                                # Base abstract DomainEvent
│   │   ├── role-assigned.event.ts
│   │   ├── role-removed.event.ts
│   │   ├── permission-granted.event.ts
│   │   ├── permission-revoked.event.ts
│   │   ├── policy-evaluated.event.ts
│   │   ├── authorization-granted.event.ts
│   │   ├── authorization-denied.event.ts
│   │   └── index.ts
│   ├── exceptions/
│   │   ├── authorization.exception.ts                     # AuthorizationException + AUTHZ_ERROR_CODES (16 códigos)
│   │   └── index.ts
│   └── services/
│       ├── rbac-engine.service.ts                         # RBAC Engine: roles, asignaciones, herencia, permisos efectivos
│       ├── policy-engine.service.ts                       # Policy Engine: reglas, condiciones, efecto ALLOW/DENY
│       ├── permission-resolver.service.ts                 # PermissionResolver: orquesta RBAC + Policies
│       ├── role-hierarchy.service.ts                      # RoleHierarchyService: cadena de herencia, validación circular
│       ├── authorization.service.ts                       # AuthorizationDomainService: fachada de dominio
│       └── index.ts
│
├── application/                                            # ── Puertos ──
│   ├── index.ts
│   ├── interfaces/
│   │   ├── authorization-service.interface.ts             # IAuthorizationService
│   │   ├── role-repository.interface.ts                   # IRoleRepository
│   │   ├── policy-repository.interface.ts                 # IPolicyRepository
│   │   ├── permission-registry.interface.ts               # IPermissionRegistry + RegisteredResource
│   │   └── index.ts
│   ├── dto/
│   │   └── index.ts                                       # CheckAccessDto, AssignRoleDto, CreateRoleDto, CreatePolicyDto, etc.
│   ├── validators/
│   │   ├── authorization.validators.ts                    # Validación: resource, role, policy, action, scope, permission format
│   │   └── index.ts
│   └── commands/
│       └── index.ts                                       # CheckAccessCommand, AssignRoleCommand, CreateRoleCommand, CreatePolicyCommand
│
├── infrastructure/                                         # ── Adaptadores ──
│   ├── index.ts
│   ├── repositories/
│   │   ├── in-memory-role.repository.ts                   # InMemoryRoleRepository
│   │   ├── in-memory-policy.repository.ts                 # InMemoryPolicyRepository
│   │   └── index.ts
│   ├── registry/
│   │   ├── permission.registry.ts                         # PermissionRegistry centralizado
│   │   └── index.ts
│   └── cache/
│       ├── permission-cache.service.ts                    # PermissionCacheService en memoria
│       └── index.ts
│
├── presentation/                                           # ── NestJS ──
│   ├── index.ts
│   ├── guards/
│   │   ├── permission.guard.ts                            # PermissionGuard: verifica permisos específicos
│   │   ├── role.guard.ts                                  # RoleGuard: verifica roles específicos
│   │   ├── policy.guard.ts                                # PolicyGuard: evalúa policies con contexto
│   │   ├── composite.guard.ts                             # CompositeGuard: ALL/ANY múltiples guards
│   │   └── index.ts
│   ├── decorators/
│   │   ├── require-permission.decorator.ts                # @RequirePermission(resource, action)
│   │   ├── require-role.decorator.ts                      # @RequireRole('admin')
│   │   ├── require-policy.decorator.ts                    # @RequirePolicy(resource, action)
│   │   ├── current-permissions.decorator.ts               # @CurrentPermissions()
│   │   ├── current-scope.decorator.ts                     # @CurrentScope()
│   │   └── index.ts
│   └── interceptors/
│       ├── authorization-context.interceptor.ts           # AuthorizationContextInterceptor
│       ├── permission-resolution.interceptor.ts           # PermissionResolutionInterceptor
│       ├── audit-context.interceptor.ts                   # AuditContextInterceptor
│       └── index.ts
│
├── services/
│   ├── authorization-app.service.ts                       # AuthorizationAppService: implementación con DI
│   └── index.ts
│
├── providers/
│   ├── authorization.providers.ts                         # AUTHZ_PROVIDERS: wiring completo
│   └── index.ts
│
├── events/
│   ├── authorization-event.handler.ts                     # Event handler con logs estructurados
│   └── index.ts
│
├── exceptions/
│   ├── http-exception.filter.ts                           # Filtro HTTP para AuthorizationException
│   └── index.ts
│
├── validators/
│   ├── class.validators.ts                                # Funciones validadoras exportables
│   └── index.ts
│
├── constants/
│   ├── authorization.constants.ts                         # AUTHZ_CONSTANTS: límites, scopes, acciones
│   └── index.ts
│
├── interfaces/                                            # Re-export de interfaces
│   └── index.ts
│
├── dto/                                                   # Re-export de DTOs
│   └── index.ts
│
├── types/
│   └── index.ts                                           # Express Request augmentation (__authorization)
│
├── rbac/                                                  # Barrel RBAC
│   └── index.ts
│
├── policies/                                              # Barrel Policies
│   └── index.ts
│
├── permissions/                                           # Barrel Permissions
│   └── index.ts
│
├── resources/                                             # Barrel Resources
│   └── index.ts
│
├── actions/                                               # Barrel Actions
│   └── index.ts
│
└── scopes/                                                # Barrel Scopes
│   └── index.ts
```

---

## Arquitectura RBAC

```
┌─────────────────────────────────────────────────────────────┐
│                       RbacEngine                            │
│                                                             │
│  roles: Map<roleId, Role>                                   │
│  assignments: Map<userId, RoleAssignment[]>                 │
│                                                             │
│  ┌──────────────┐    ┌──────────────────┐                   │
│  │    Role       │    │   Permission     │                   │
│  │  - id         │◄───│ - resource       │                   │
│  │  - name       │    │ - action         │                   │
│  │  - level      │    │ - scope          │                   │
│  │  - parentRole │    └──────────────────┘                   │
│  │  - permissions│                                          │
│  └──────┬───────┘                                           │
│         │                                                    │
│  ┌──────┴───────┐    ┌──────────────────┐                   │
│  │ Inheritance  │    │ RoleAssignment   │                   │
│  │ Chain        │    │ - userId         │                   │
│  │ (hasta 10)   │    │ - roleId         │                   │
│  └──────────────┘    │ - scope          │                   │
│                      │ - assignedBy     │                   │
│                      └──────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Arquitectura Policies

```
┌─────────────────────────────────────────────────────────────┐
│                       PolicyEngine                          │
│                                                             │
│  policies: Policy[] (ordenados por prioridad desc)          │
│                                                             │
│  ┌─────────────────────────────────────────────┐            │
│  │                 Policy                      │            │
│  │  - name                                     │            │
│  │  - rules: PolicyRule[]                      │            │
│  │  - priority: number (mayor = primero)       │            │
│  │  - enabled: boolean                         │            │
│  │                                             │            │
│  │  ┌───────────────────────────────────────┐  │            │
│  │  │           PolicyRule                  │  │            │
│  │  │  - effect: ALLOW | DENY               │  │            │
│  │  │  - resource: string (soporta *)       │  │            │
│  │  │  - actions: ActionName[]              │  │            │
│  │  │  - conditions: PolicyCondition[]      │  │            │
│  │  │     - field: string                   │  │            │
│  │  │     - operator: eq|neq|in|nin|gt|gte..│  │            │
│  │  │     - value: unknown                  │  │            │
│  │  └───────────────────────────────────────┘  │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  Flujo: Policies ordenadas → Match resource + action        │
│         → Evaluar condiciones → Efecto ganador              │
│                                                             │
│  Deny by Default: si ninguna rule matchea → DENY            │
└─────────────────────────────────────────────────────────────┘
```

---

## Permission Registry

```
┌─────────────────────────────────────────────────────────────┐
│                    PermissionRegistry                       │
│                                                             │
│  resources: Map<string, RegisteredResource>                 │
│     - name: string                                          │
│     - actions: ActionName[]                                 │
│     - description?: string                                  │
│                                                             │
│  actions: Set<ActionName> (precargado con 12 acciones)      │
│                                                             │
│  Métodos:                                                   │
│  - registerResource(name, actions, description)             │
│  - registerAction(action)                                   │
│  - isValidResource(name): boolean                           │
│  - isValidAction(action): boolean                           │
│  - getRegisteredResources(): RegisteredResource[]           │
│  - getRegisteredActions(): ActionName[]                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Role Hierarchy

```
                         admin (level 0)
                        /               \
              supervisor (level 1)   operator (level 1)
                /          \
        seller (level 2)   warehouse (level 2)
              |
      customer (level 3)

Características:
- Validación de ciclos (circular detection)
- Máximo 10 niveles de profundidad
- Herencia de permisos del padre → hijo
- Un solo padre por rol (jerarquía de árbol)
- Roles system: no modificables (prefijo system:)
```

---

## Scope Strategy

```
global ─────── Sin restricciones (admins)
    │
    ├── organization ──── Scope = { type: 'organization', referenceId: orgId }
    │     │
    │     ├── branch ──── Scope = { type: 'branch', referenceId: branchId }
    │     │
    │     └── department ── Scope = { type: 'department', referenceId: deptId }
    │
    ├── owner ──────────── Scope = { type: 'owner' } (recursos propios)
    │
    └── self ───────────── Scope = { type: 'self' } (propio usuario)

Evaluación: el scope del role assignment debe coincidir con el scope
del recurso accedido. Un rol global puede acceder a todo. Un rol
de branch solo a esa branch.
```

---

## Flujo Authorization

```
Request con JWT
       │
       ▼
┌──────────────────┐
│  Authentication   │
│  Guard (JWT)      │
└────────┬─────────┘
         │ user = { userId, email }
         ▼
┌──────────────────┐
│  Permission      │
│  Resolution      │
│  Interceptor     │── Carga permisos del usuario en request.__authorization
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Authorization   │
│  Context         │
│  Interceptor     │── Prepara metadata (timestamp, path, method)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PermissionGuard │── @RequirePermission('products', 'create')
│  o RoleGuard     │── @RequireRole('admin')
│  o PolicyGuard   │── @RequirePolicy('inventory', 'adjust')
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
  Granted   Denied
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ 200 OK │ │ 403    │
└────────┘ │ Forbidden
           └────────┘

AuditContextInterceptor: log de toda autorización
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| **Herencia circular** | Stack overflow | Validación en RBAC Engine + max depth |
| **Cache inconsistente** | Permisos desactualizados | TTL 5 min + invalidación manual |
| **InMemory repositories** | Pérdida de datos | Provisoria: reemplazar por Prisma/Redis |
| **Scope no validado** | Acceso cross-tenant | Validación en Permission.matches() |
| **Permiso no registrado** | Comportamiento inesperado | PermissionRegistry.isValidResource() |
| **Deny by default bypass** | Escalación | Siempre DENY si no hay ALLOW explícito |
| **System role modificado** | Corrupción RBAC | AUTHZ_CANNOT_MODIFY_SYSTEM_ROLE |

---

## Decorators

| Decorator | Uso |
|-----------|-----|
| `@RequirePermission({ resource: 'products', action: 'create' })` | Permiso específico |
| `@RequireRole('admin', 'supervisor')` | Rol específico (OR) |
| `@RequirePolicy({ resource: 'inventory', action: 'adjust' })` | Policy con contexto |
| `@CurrentPermissions()` | Inyecta permisos del usuario |
| `@CurrentScope()` | Inyecta scope actual |

---

## Guards

| Guard | Mecanismo |
|-------|-----------|
| `PermissionGuard` | Verifica permisos vía `IAuthorizationService.checkAccess()` |
| `RoleGuard` | Verifica asignación de roles vía `getUserRoles()` |
| `PolicyGuard` | Evalúa policies con contexto del request |
| `CompositeGuard` | Combina guards con lógica ALL/ANY |

---

## Events

| Evento | Disparo |
|--------|---------|
| `RoleAssignedEvent` | Rol asignado a usuario |
| `RoleRemovedEvent` | Rol removido de usuario |
| `PermissionGrantedEvent` | Permiso agregado a rol |
| `PermissionRevokedEvent` | Permiso removido de rol |
| `PolicyEvaluatedEvent` | Policy evaluada (con resultado) |
| `AuthorizationGrantedEvent` | Acceso autorizado |
| `AuthorizationDeniedEvent` | Acceso denegado |

---

## Observabilidad

Eventos registrados (Logger — nunca JWT, passwords, secrets):
- `authz.check_access.granted` / `authz.check_access.denied`
- `authz.role.assigned` / `authz.role.removed` / `authz.role.created`
- `authz.policy.created`
- `authz.permission_guard.granted` / `authz.permission_guard.denied`
- `authz.role_guard.granted` / `authz.role_guard.denied`
- `authz.policy_guard.denied`
- `authz.audit` — auditoría completa por request

---

## TypeScript

```
✓ TypeScript Strict
✓ 0 errores de compilación
✓ 0 dependencias circulares
✓ Deny by Default implementado
✓ Todas las interfaces desacopladas
✓ Injection tokens para todas las dependencias
```

---

## Recomendaciones

1. **Poblar roles iniciales** en `onModuleInit()` (admin, supervisor, seller, customer).
2. **Registrar recursos** del negocio en PermissionRegistry durante bootstrap.
3. **Reemplazar repositorios InMemory** por Prisma antes de producción.
4. **Conectar EventBus** al `AuthorizationEventHandler`.
5. **Configurar guards globalmente** en el módulo para seguridad por defecto.
6. **Implementar ABAC** en `PermissionResolver.resolve()` agregando atributos del usuario.
7. **Agregar rate limiting** al guard de permisos para evitar fuerza bruta.
8. **Extender `AuthorizationException`** desde `AppException` para integración con `GlobalExceptionFilter`.
