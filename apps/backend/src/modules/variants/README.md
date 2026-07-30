# Variants Module (Fase 6.4)

Dominio de Variantes de Producto, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
variants/
├── domain/                    # Core business logic
│   ├── value-objects/         # 6 Value Objects
│   ├── aggregates/            # ProductVariant
│   ├── events/                # 9 Domain Events
│   ├── exceptions/            # VariantException
│   └── repositories/          # Puerto interfaces (PRODUCT_VARIANT_REPOSITORY)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   ├── mappers/               # VariantMapper
│   └── validators/            # VariantValidator
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # VariantController
│   └── interceptors/          # VariantExceptionFilter
├── services/                  # VariantAppService
├── events/                    # VariantEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── variants.module.ts         # Módulo NestJS
```

## Endpoints REST (12)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/products/:productId/variants | Crear variante |
| GET    | /api/v1/products/:productId/variants | Listar variantes de producto |
| GET    | /api/v1/variants/:id | Obtener por ID |
| GET    | /api/v1/variants/sku/:sku | Obtener por SKU |
| PATCH  | /api/v1/variants/:id | Actualizar |
| PATCH  | /api/v1/variants/:id/sku | Cambiar SKU |
| PATCH  | /api/v1/variants/:id/status | Cambiar estado |
| PATCH  | /api/v1/variants/:id/attributes | Cambiar atributos |
| POST   | /api/v1/variants/:id/default | Marcar como default |
| POST   | /api/v1/variants/:id/archive | Archivar |
| POST   | /api/v1/variants/:id/restore | Restaurar |
| DELETE | /api/v1/variants/:id | Soft delete |

## Domain Model

### ProductVariant Aggregate
- **Value Objects**: VariantId, SKU (uppercase, unique por tenant), Barcode (EAN-13), VariantName, VariantStatus, VariantAttributes
- **Events**: Created, SkuChanged, AttributesChanged, Activated, Deactivated, Archived, Restored, SetAsDefault, Deleted
- **Behavior**: rename, changeSku, changeAttributes, activate, deactivate, archive, restore, setAsDefault, softDelete

### Status Transitions
```
ACTIVE ───→ INACTIVE
ACTIVE ───→ ARCHIVED
INACTIVE ─→ ACTIVE
INACTIVE ─→ ARCHIVED
ARCHIVED ─→ ACTIVE (restore)
```

## Multi-tenant

SKU único por tenant (case-insensitive, se almacena uppercase). Barcode único global.

## Prisma Schema

Modelos añadidos: `ProductVariant`.

## Tests

```
66 tests en 2 suites:
  - product-variant-aggregate.spec.ts (42 tests)
  - variant-app.service.spec.ts       (24 tests)
```

## Dependencias

- **Product Domain**: Variants se vinculan a un Product mediante `productId`. Un producto puede tener múltiples variantes, una de ellas marcada como default.

## Permisos

```
variants.*: create, read, update, archive, restore, delete, manage
```
