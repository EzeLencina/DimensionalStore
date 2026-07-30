# Identity Module — Dominio de Identidad

Módulo de dominio completamente desacoplado para la gestión de identidad, organizaciones, roles y permisos. NO incluye autenticación, JWT, login ni autorización — esas funcionalidades pertenecen a fases futuras.

---

## 1. Árbol Completo

```
modules/identity/
├── index.ts                          # Barrel export público
├── identity.module.ts                # Módulo NestJS
├── README.md                         # Documentación
│
├── domain/
│   ├── index.ts                      # Barrel del dominio
│   │
│   ├── entities/
│   │   ├── index.ts
│   │   ├── user.entity.ts            # Usuario del sistema
│   │   ├── organization.entity.ts     # Organización/empresa
│   │   ├── branch.entity.ts          # Sucursal
│   │   ├── profile.entity.ts         # Perfil de usuario
│   │   ├── invitation.entity.ts      # Invitación
│   │   ├── role.entity.ts            # Rol
│   │   └── permission.entity.ts      # Permiso atómico
│   │
│   ├── value-objects/
│   │   ├── index.ts
│   │   ├── user-id.value-object.ts
│   │   ├── organization-id.value-object.ts
│   │   ├── branch-id.value-object.ts
│   │   ├── role-id.value-object.ts
│   │   ├── permission-id.value-object.ts
│   │   ├── invitation-id.value-object.ts
│   │   ├── email.value-object.ts
│   │   ├── username.value-object.ts
│   │   ├── display-name.value-object.ts
│   │   ├── phone.value-object.ts
│   │   ├── document-number.value-object.ts
│   │   ├── avatar.value-object.ts
│   │   ├── timezone.value-object.ts
│   │   ├── locale.value-object.ts
│   │   ├── language.value-object.ts
│   │   └── slug.value-object.ts
│   │
│   ├── aggregates/
│   │   ├── index.ts
│   │   ├── user.aggregate.ts         # User + Profile + Memberships
│   │   ├── organization.aggregate.ts # Organization + Branches
│   │   ├── branch.aggregate.ts       # Branch standalone
│   │   ├── invitation.aggregate.ts   # Invitation standalone
│   │   ├── role.aggregate.ts         # Role + Permissions
│   │   └── permission.aggregate.ts   # Permission standalone
│   │
│   ├── events/
│   │   ├── index.ts
│   │   ├── domain-event.ts           # Clase base abstracta
│   │   ├── user-created.event.ts
│   │   ├── organization-created.event.ts
│   │   ├── invitation-created.event.ts
│   │   ├── profile-updated.event.ts
│   │   ├── branch-created.event.ts
│   │   ├── role-created.event.ts
│   │   └── permission-created.event.ts
│   │
│   ├── repositories/
│   │   ├── index.ts
│   │   ├── user.repository.ts        # IUserRepository + IProfileRepository + IUserMembershipRepository
│   │   ├── organization.repository.ts
│   │   ├── branch.repository.ts
│   │   ├── role.repository.ts
│   │   ├── permission.repository.ts
│   │   └── invitation.repository.ts
│   │
│   ├── services/
│   │   ├── index.ts
│   │   ├── identity-rules.service.ts       # Reglas de usuario
│   │   ├── profile-rules.service.ts        # Reglas de perfil
│   │   ├── organization-rules.service.ts   # Reglas de organización
│   │   └── invitation-rules.service.ts     # Reglas de invitación
│   │
│   ├── exceptions/
│   │   └── index.ts                  # IdentityException
│   │
│   ├── constants/
│   │   └── index.ts                  # Error codes + defaults
│   │
│   └── types/
│       └── index.ts                  # UserStatus, UserType, InvitationStatus, etc.
│
└── application/
    ├── index.ts
    ├── ports/
    │   └── index.ts                  # Re-export de interfaces de repositorios
    ├── dto/
    │   └── index.ts                  # CreateUserDto, UpdateProfileDto, etc.
    ├── interfaces/
    │   └── index.ts                  # IIdentityApplicationService
    ├── mappers/
    │   └── index.ts                  # IdentityMappers
    └── validators/
        └── index.ts                  # IdentityValidators
```

---

## 2. Agregados

### UserAggregate
- **Entidad raíz**: User
- **Entidades hijas**: Profile
- **Value Objects**: UserId, Email, Username, DisplayName, Avatar, Phone, DocumentNumber, Timezone, Locale, Language
- **Límite**: Un usuario tiene exactamente un perfil. Los miembros de organizaciones se representan como `UserMembership[]`.
- **Invariantes**: Email único, username único, emailVerified para operaciones críticas.

### OrganizationAggregate
- **Entidad raíz**: Organization
- **Entidades hijas**: Branch[] (colección)
- **Value Objects**: OrganizationId, Slug, DisplayName
- **Límite**: Una organización tiene N sucursales. Solo una puede ser `isMainBranch`.
- **Invariantes**: Slug único global, al menos una sucursal activa.

### BranchAggregate
- **Entidad raíz**: Branch (independiente dentro de una org)
- **Límite**: Cada sucursal pertenece a una organización.
- **Invariantes**: Slug único por organización, solo una sucursal principal.

### RoleAggregate
- **Entidad raíz**: Role
- **Value Objects**: RoleId, Slug, DisplayName
- **Límite**: Los permisos se referencian por ID (no se owned).
- **Invariantes**: Los roles `isSystem` no pueden eliminarse. Slug único por organización.

### PermissionAggregate
- **Entidad raíz**: Permission (standalone, compartida)
- **Límite**: No pertenece a ninguna organización específica.
- **Invariantes**: `resource:action` único (qualified name).

### InvitationAggregate
- **Entidad raíz**: Invitation
- **Límite**: Independiente, expira automáticamente.
- **Invariantes**: Solo pending puede ser accepted/rejected/cancelled.

---

## 3. Entidades

| Entidad | Propósito | Atributos Clave |
|---------|-----------|-----------------|
| **User** | Identidad digital del usuario | email, username, displayName, status, userType, authProviders |
| **Organization** | Empresa/organización multi-tenant | name, slug, status, tier, logo |
| **Branch** | Sucursal física o digital | name, slug, phone, address, branchType, isMainBranch |
| **Profile** | Perfil público del usuario | displayName, avatar, phone, documentNumber, timezone, locale, language |
| **Invitation** | Invitación a organización | email, status, target, invitedBy, expiresAt |
| **Role** | Rol agrupador de permisos | name, slug, description, roleType, permissionIds, isSystem |
| **Permission** | Permiso atómico | resource, action, name, slug |

---

## 4. Value Objects

| VO | Validación | Formato |
|----|-----------|---------|
| **UserId** | No vacío | UUID string |
| **Email** | Regex + longitud máx 254 | `user@domain.com` |
| **Username** | 3-50 chars, alfanumérico + ._- | `john.doe` |
| **DisplayName** | 1-200 chars | `John Doe` |
| **Phone** | Internacional, 7-15 dígitos | `+5491123456789` |
| **DocumentNumber** | 3-20 chars, tipo específico | `DNI:12345678` |
| **Slug** | 2-100 chars, lowercase + guiones | `mi-empresa` |
| **Timezone** | IANA timezone válido | `America/Argentina/Buenos_Aires` |
| **Locale** | ll_CC con soporte | `es_AR`, `en_US` |
| **Language** | ISO 639-1 soportado | `es`, `en`, `pt` |

Todos los VOs son **inmutables** (Object.freeze) y **auto-validantes** (lanzan IdentityException en construcción inválida).

---

## 5. Relación entre Agregados

```
User ──┐
       ├── Profile (1:1)
       └── UserMembership[] ── Organization (N:N)
                                    │
                                    └── Branch[] (1:N)
                                         │
                                         └── Branch (1:1)

Organization ── Role[] (1:N)
                    │
                    └── Permission[] (N:M via permissionIds)

Invitation ── Organization (N:1)
Invitation ── User (invitedBy)

Permission (standalone, sin owner)
```

---

## 6. Eventos de Dominio

| Evento | Disparador | Datos |
|--------|-----------|-------|
| `UserCreated` | Nuevo usuario | userId, email, userType |
| `OrganizationCreated` | Nueva organización | organizationId, name, slug |
| `InvitationCreated` | Nueva invitación | invitationId, organizationId, email |
| `ProfileUpdated` | Perfil actualizado | userId, updatedFields[] |
| `BranchCreated` | Nueva sucursal | branchId, organizationId, name |
| `RoleCreated` | Nuevo rol | roleId, organizationId, name |
| `PermissionCreated` | Nuevo permiso | permissionId, resource, action |

Los eventos extienden `DomainEvent` con `eventName` y `occurredAt`. No se publican activamente — están preparados para integración con EventBus en fase futura.

---

## 7. Servicios de Dominio

| Servicio | Reglas |
|----------|--------|
| **IdentityRulesService** | Validación email/username/displayName, transiciones de estado, eliminación de super_admin |
| **ProfileRulesService** | Validación de datos de perfil, prevención de actualización en usuarios archivados |
| **OrganizationRulesService** | Validación slug único, transiciones de estado, upgrades de tier, suspensión antes de eliminar |
| **InvitationRulesService** | Validación de target, permisos de envío, duplicados, expiración |

---

## 8. Repository Interfaces

| Interfaz | Métodos Clave |
|----------|---------------|
| **IUserRepository** | findById, findByEmail, findByUsername, save, update, delete |
| **IProfileRepository** | findByUserId, save, update |
| **IUserMembershipRepository** | findByUserId, save, delete |
| **IOrganizationRepository** | findById, findBySlug, save, update, delete |
| **IBranchRepository** | findById, findByOrganizationId, findBySlug, findMainBranch |
| **IRoleRepository** | findById, findByOrganizationId, findBySlug, findSystemRoles |
| **IPermissionRepository** | findById, findByResource, findByQualifiedName |
| **IInvitationRepository** | findById, findByOrganizationId, findByEmail, findPendingByEmail, findExpired |

Ninguna interfaz depende de Prisma o cualquier implementación concreta.

---

## 9. Convenciones del Dominio

1. **Entidades inmutables externamente**: setters solo internos, getters públicos.
2. **Value Objects inmutables**: `Object.freeze()` post-construcción.
3. **Auto-validación**: Todo VO se valida en el constructor.
4. **Identidad por ID**: `UserId`, `OrganizationId`, etc. como objetos, no strings.
5. **Eventos sin publicación**: Los eventos existen como clases, no se publican (futura integración con EventBus).
6. **Servicios de dominio stateless**: No mantienen estado, solo validan reglas.
7. **Repositorios como interfaces**: Sin implementación concreta en esta fase.
8. **Tipos fuertes**: `UserStatus`, `UserType`, `InvitationStatus` como union types.

---

## 10. Errores del Dominio

Todas las excepciones usan `IdentityException` con formato `{code: string, message: string}`.

| Código | Significado |
|--------|-------------|
| `EMAIL_INVALID_FORMAT` | Formato de email inválido |
| `USERNAME_INVALID_LENGTH` | Username fuera de rango |
| `SLUG_ALREADY_EXISTS` | Slug ya registrado |
| `INVALID_STATUS_TRANSITION` | Transición de estado no permitida |
| `INVITATION_NOT_ALLOWED` | Usuario sin permisos para invitar |
| `INVITATION_CANNOT_ACCEPT` | Invitación no está en estado pending |

Lista completa en `domain/constants/index.ts`.

---

## 11. Preparado para Futuro

El dominio está diseñado para soportar sin cambios arquitectónicos:

- **Google/GitHub/Microsoft/Apple Login** → `AuthProvider` type + providers array en User
- **Magic Links** → Nuevo evento + servicio de dominio
- **Passkeys** → Nuevo VO (WebAuthn credential) en User
- **OAuth2 / OpenID Connect** → Extensiones de `AuthProvider`
- **SAML / LDAP** → Nuevos tipos de proveedor de identidad
- **2FA / MFA** → Nuevo VO en User (TOTP secret, recovery codes)
- **API Keys** → Nueva entidad ApiKey en el módulo Identity
- **Session management** → Nuevo agregado Session

---

## 12. Riesgos Detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Sin autenticación | El dominio existe pero no puede usarse sin auth | Planificado para Fase 4 |
| IdentityException no extiende AppException | No integrado con GlobalExceptionFilter | Convertir en fase de integración |
| Sin EventBus | Eventos creados pero no publicados | Integración planificada con EventBusModule |
| Sin Prisma repositories | No hay persistencia | Fase posterior implementa Infrastructure layer |
| Roles system editables vía código | Protección por `isSystem` flag | Check en services antes de modificar |
| Invitaciones sin cleanup | Invitaciones expiradas acumuladas | `findExpired()` listo para job periódico |

---

## 13. Recomendaciones

1. **Integrar con AppModule** cuando se implementen casos de uso.
2. **Extender IdentityException** de `AppException` de common para integración con filtro global.
3. **Conectar EventBus** cuando se implementen handlers de eventos.
4. **Implementar IUserRepository** con Prisma como primer repositorio.
5. **Agregar seed data** para permisos base y roles del sistema.
6. **Escribir tests unitarios** para todos los Value Objects (validación de fronteras).
7. **Escribir tests de integración** para los domain services.
