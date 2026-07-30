# Catalog Module (Fase 6.2)

Dominio de Catálogo con Categorías y Colecciones, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
catalog/
├── domain/                    # Core business logic
│   ├── value-objects/         # 13 Value Objects
│   ├── aggregates/            # Category, Collection
│   ├── events/                # 20 Domain Events
│   ├── exceptions/            # CatalogException
│   ├── repository/            # Puerto interfaces (CATEGORY_REPOSITORY, COLLECTION_REPOSITORY)
│   └── specifics/             # Filtros, sorting, paginación
├── application/               # Casos de uso
│   ├── commands/              # 14 Commands
│   ├── dto/                   # DTOs de entrada/salida
│   ├── mappers/               # CategoryMapper, CollectionMapper
│   └── validators/            # CategoryValidator, CollectionValidator
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # CategoryController, CollectionController
│   └── interceptors/          # CatalogExceptionFilter
├── services/                  # CategoryAppService, CollectionAppService
├── events/                    # CatalogEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── catalog.module.ts          # Módulo NestJS
```

## Endpoints REST

### Categories (13 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /categories | Crear categoría |
| GET    | /categories | Listar categorías (filtros, paginación) |
| GET    | /categories/root | Listar categorías raíz |
| GET    | /categories/slug/:slug | Obtener por slug |
| GET    | /categories/:id | Obtener por ID |
| PUT    | /categories/:id | Actualizar |
| PATCH  | /categories/:id/status | Cambiar estado |
| PATCH  | /categories/:id/visibility | Cambiar visibilidad |
| PATCH  | /categories/:id/archive | Archivar |
| PATCH  | /categories/:id/restore | Restaurar |
| DELETE | /categories/:id | Soft delete |

### Collections (14 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /collections | Crear colección |
| GET    | /collections | Listar colecciones |
| GET    | /collections/active | Listar colecciones activas |
| GET    | /collections/slug/:slug | Obtener por slug |
| GET    | /collections/:id | Obtener por ID |
| PUT    | /collections/:id | Actualizar |
| PATCH  | /collections/:id/status | Cambiar estado |
| PATCH  | /collections/:id/visibility | Cambiar visibilidad |
| PATCH  | /collections/:id/archive | Archivar |
| PATCH  | /collections/:id/restore | Restaurar |
| DELETE | /collections/:id | Soft delete |

## Domain Model

### Category Aggregate
- **Value Objects**: CategoryId, CategoryName, Slug, Description, ShortDescription, DisplayOrder, Url, SeoTitle, SeoDescription, CatalogStatus, CatalogVisibility
- **Events**: Created, Renamed, Moved, Activated, Deactivated, Archived, Restored, VisibilityChanged, SeoUpdated, Deleted
- **Behavior**: rename, changeSlug, moveTo, activate, deactivate, archive, restore, changeVisibility, updateSeo, updateDisplayOrder, softDelete

### Collection Aggregate
- **Value Objects**: CollectionId, CollectionName, Slug, Description, CollectionType, DisplayOrder, SeoTitle, SeoDescription, CatalogStatus, CatalogVisibility
- **Events**: Created, Renamed, Activated, Deactivated, Archived, Restored, VisibilityChanged, SeoUpdated, TypeChanged, Deleted
- **Behavior**: rename, changeSlug, changeType, updateDateRange, activate, deactivate, archive, restore, changeVisibility, updateSeo, softDelete

## Multi-tenant

Todas las operaciones filtran por tenantId (obtenido del header X-Tenant-Id). Cada tenant tiene datos completamente aislados.

## Prisma Schema

Modelos añadidos: `Category`, `Collection`, `ProductCategory`, `ProductCollection`.

## Tests

```
162 tests en 5 suites:
  - value-objects.spec.ts       (47 tests)
  - category-aggregate.spec.ts  (39 tests)
  - collection-aggregate.spec.ts(35 tests)
  - category-app.service.spec.ts(22 tests)
  - collection-app.service.spec.ts(19 tests)
```

## Dependencias

- **Product Domain**: Categories y Collections se relacionan con Product mediante identificadores (ProductId) en las tablas pivot `ProductCategory` y `ProductCollection`. No hay acoplamiento directo entre agregados.

## Permisos

```
categories.*: create, read, update, archive, restore, delete, manage
collections.*: create, read, update, archive, restore, delete, manage
```
