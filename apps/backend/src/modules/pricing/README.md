# Pricing Module (Fase 6.6)

Motor de Precios, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
pricing/
├── domain/                    # Core business logic
│   ├── value-objects/         # 4 Value Objects
│   ├── aggregates/            # PriceList, VariantPrice
│   ├── events/                # 4 Domain Events
│   ├── exceptions/            # PricingException
│   └── repositories/          # Puerto interfaces (PRICE_LIST_REPOSITORY, VARIANT_PRICE_REPOSITORY)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   ├── mappers/               # PriceListMapper, VariantPriceMapper
│   └── validators/            # PriceListValidator, VariantPriceValidator
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # PriceListController, VariantPriceController
│   └── interceptors/          # PricingExceptionFilter
├── services/                  # PriceListAppService, VariantPriceAppService
├── events/                    # PricingEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── pricing.module.ts          # Módulo NestJS
```

## Endpoints REST (17)

### Price List (9 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/price-lists | Crear lista de precios |
| GET    | /api/v1/price-lists | Listar listas de precios |
| GET    | /api/v1/price-lists/:id | Obtener por ID |
| GET    | /api/v1/price-lists/code/:code | Obtener por código |
| PUT    | /api/v1/price-lists/:id | Actualizar |
| PATCH  | /api/v1/price-lists/:id/activate | Activar |
| PATCH  | /api/v1/price-lists/:id/deactivate | Desactivar |
| PATCH  | /api/v1/price-lists/:id/default | Marcar como default |
| DELETE | /api/v1/price-lists/:id | Soft delete |

### Variant Price (8 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/variants/:productVariantId/prices | Setear precio |
| GET    | /api/v1/variants/:productVariantId/prices | Precios de variante |
| GET    | /api/v1/variants/:productVariantId/effective-price | Precio efectivo |
| GET    | /api/v1/price-lists/:priceListId/prices | Precios de lista |
| GET    | /api/v1/variant-prices/:id | Obtener por ID |
| PATCH  | /api/v1/variant-prices/:id/promotion | Programar promoción |
| DELETE | /api/v1/variant-prices/:id/promotion | Cancelar promoción |
| DELETE | /api/v1/variant-prices/:id | Eliminar precio |

## Domain Model

### Money Value Object
- Monedas soportadas: ARS, USD, EUR, GBP, BRL, CLP, COP, MXN
- Todos los montos en enteros (centavos). Prohibido el uso de float nativo.
- Operaciones: sum, subtract, multiply, compare, isZero

### PriceList Aggregate
- **Value Objects**: PriceListId, PriceListCode, PriceListType (RETAIL, WHOLESALE)
- **Events**: Created
- **Behavior**: activate, deactivate, setAsDefault, update

### VariantPrice Aggregate
- **Value Objects**: VariantPriceId
- **Events**: VariantPriceSet, PromotionScheduled, PromotionCancelled
- **Pricing hierarchy**: promo > sale > list
- **Behavior**: setPrice, schedulePromotion (validación: promo ≤ list), cancelPromotion, getEffectivePrice

## Multi-tenant

Todas las operaciones filtran por tenantId. Precios completamente aislados por tenant.

## Prisma Schema

Modelos añadidos: `PriceList`, `VariantPrice`, `PriceHistory`.

## Tests

```
57 tests en 5 suites:
  - money.spec.ts                (12 tests)
  - price-list-aggregate.spec.ts (15 tests)
  - variant-price-aggregate.spec.ts (13 tests)
  - price-list-app.service.spec.ts (10 tests)
  - variant-price-app.service.spec.ts (7 tests)
```

## Dependencias

- **Product Variant Domain**: VariantPrice se vincula a una variante mediante `productVariantId`.
- Sin acoplamiento directo entre agregados de pricing y otros bounded contexts.

## Permisos

```
price-lists.*: create, read, update, activate, deactivate, delete, manage
variant-prices.*: create, read, update, promote, delete, manage
```
