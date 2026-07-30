# Brands Module (Fase 6.3)

Dominio de Marcas, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
brands/
├── domain/                    # Core business logic
│   ├── value-objects/         # 9 Value Objects
│   ├── aggregates/            # Brand
│   ├── events/                # 9 Domain Events
│   ├── exceptions/            # BrandException
│   └── repositories/          # Puerto interfaces (BRAND_REPOSITORY)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   ├── mappers/               # BrandMapper
│   └── validators/            # BrandValidator
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # BrandController
│   └── interceptors/          # BrandExceptionFilter
├── services/                  # BrandAppService
├── events/                    # BrandEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── brands.module.ts           # Módulo NestJS
```

## Endpoints REST (12)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /brands | Crear marca |
| GET    | /brands | Listar marcas |
| GET    | /brands/:id | Obtener por ID |
| GET    | /brands/slug/:slug | Obtener por slug |
| PUT    | /brands/:id | Actualizar |
| PATCH  | /brands/:id/status | Cambiar estado |
| PATCH  | /brands/:id/visibility | Cambiar visibilidad |
| PATCH  | /brands/:id/archive | Archivar |
| PATCH  | /brands/:id/restore | Restaurar |
| DELETE | /brands/:id | Soft delete |
| POST   | /brands/:brandId/products/:productId | Asignar producto |
| DELETE | /brands/:brandId/products/:productId | Desasignar producto |

## Domain Model

### Brand Aggregate
- **Value Objects**: BrandId, BrandName, Slug, Description, Url, SeoTitle, SeoDescription, BrandStatus, BrandVisibility
- **Events**: Created, Renamed, Activated, Deactivated, Archived, Restored, VisibilityChanged, SeoUpdated, Deleted
- **Behavior**: rename, changeSlug, activate, deactivate, archive, restore, changeVisibility, updateSeo, softDelete

### Status Transitions
```
DRAFT ───→ ACTIVE
DRAFT ───→ ARCHIVED
ACTIVE ──→ INACTIVE
ACTIVE ──→ ARCHIVED
INACTIVE → ACTIVE
INACTIVE → ARCHIVED
ARCHIVED → DRAFT (restore)
```

## Multi-tenant

Todas las operaciones filtran por tenantId (header X-Tenant-Id). Slug único por tenant.

## Prisma Schema

Modelos añadidos: `Brand`, `ProductBrand` (tabla pivot).

## Tests

```
54 tests en 2 suites:
  - brand-aggregate.spec.ts   (34 tests)
  - brand-app.service.spec.ts (20 tests)
```

## Dependencias

- **Product Domain**: Brands se relacionan con Product mediante identificadores (ProductId) en tabla pivot `ProductBrand`. Sin acoplamiento directo entre agregados.

## Permisos

```
brands.*: create, read, update, archive, restore, delete, manage
```
