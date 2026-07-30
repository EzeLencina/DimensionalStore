# Cart Module (Fase 6.7)

Dominio de Carrito de Compras, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
cart/
├── domain/                    # Core business logic
│   ├── value-objects/         # 6 Value Objects
│   ├── aggregates/            # Cart, CartItem (child entity)
│   ├── events/                # 9 Domain Events
│   ├── exceptions/            # CartException
│   ├── repositories/          # Puerto interfaces (CART_REPOSITORY)
│   └── ports/                 # Puertos externos (ProductVariantReader, PricingResolver, InventoryAvailabilityReader)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   └── mappers/               # CartMapper
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # CartController
│   └── interceptors/          # CartExceptionFilter
├── services/                  # CartAppService
├── events/                    # CartEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── cart.module.ts             # Módulo NestJS
```

## Endpoints REST (9)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/carts/guest | Crear carrito de invitado |
| GET    | /api/v1/carts/current | Obtener carrito actual |
| POST   | /api/v1/carts/current/items | Agregar ítem |
| PATCH  | /api/v1/carts/current/items/:productVariantId | Actualizar cantidad |
| DELETE | /api/v1/carts/current/items/:productVariantId | Eliminar ítem |
| DELETE | /api/v1/carts/current/items | Vaciar carrito |
| POST   | /api/v1/carts/current/recalculate | Recalcular precios |
| POST   | /api/v1/carts/merge | Fusionar carrito invitado → cliente |
| POST   | /api/v1/carts/current/cancel | Cancelar carrito |

## Domain Model

### Cart Aggregate
- **Value Objects**: CartId, CartItemId, CartStatus (ACTIVE, CONVERTED, ABANDONED, EXPIRED, CANCELLED), GuestCartToken (SHA-256), Quantity, CustomerId
- **Events**: Created, ItemAdded, ItemQuantityUpdated, ItemRemoved, Cleared, Converted, Cancelled, Expired, Merged
- **Behavior**: addItem (incrementa cantidad si duplicado), updateItemQuantity, removeItem, clear, cancel, merge, recalculate, expire

### Status Transitions
```
ACTIVE ────→ CONVERTED
ACTIVE ────→ ABANDONED
ACTIVE ────→ EXPIRED
ACTIVE ────→ CANCELLED
```

## Puertos Externos

El módulo define interfaces (ports) para servicios externos sin importar implementaciones concretas:
- **ProductVariantReader**: validar que una variante existe y está activa
- **PricingResolver**: resolver precio unitario de una variante
- **InventoryAvailabilityReader**: verificar disponibilidad de stock

## Multi-tenant

Carritos aislados por tenant. Soportes dos modos: invitado (token hash) y cliente logueado (customerId).

## Prisma Schema

Modelos añadidos: `Cart`, `CartItem`.

## Tests

```
40 tests en 2 suites:
  - cart-aggregate.spec.ts   (23 tests)
  - cart-app.service.spec.ts (17 tests)
```

## Dependencias

- **Product Variant**: validación de existencia y estado activo vía puerto
- **Pricing**: resolución de precio unitario vía puerto
- **Inventory**: verificación de disponibilidad vía puerto
- Sin acoplamiento directo a implementaciones concretas

## Permisos

```
carts.*: create, read, update, delete, manage
```
