# Inventory Module (Fase 6.5)

Dominio de Inventario y Stock, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
inventory/
├── domain/                    # Core business logic
│   ├── value-objects/         # 7 Value Objects
│   ├── aggregates/            # InventoryItem, Warehouse
│   ├── events/                # 8 Domain Events
│   ├── exceptions/            # InventoryException
│   └── repositories/          # Puerto interfaces (INVENTORY_REPOSITORY, WAREHOUSE_REPOSITORY)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   ├── mappers/               # InventoryMapper, WarehouseMapper
│   └── validators/            # InventoryValidator, WarehouseValidator
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # InventoryController, WarehouseController
│   └── interceptors/          # InventoryExceptionFilter
├── services/                  # InventoryAppService
├── events/                    # InventoryEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── inventory.module.ts        # Módulo NestJS
```

## Endpoints REST (17)

### Inventory (13 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/inventory/initialize | Inicializar stock |
| GET    | /api/v1/inventory/sku/:sku | Obtener stock por SKU |
| GET    | /api/v1/inventory/warehouses/:warehouseId | Stock por almacén |
| GET    | /api/v1/inventory/low-stock | Productos con stock bajo |
| POST   | /api/v1/inventory/receive | Recibir stock |
| POST   | /api/v1/inventory/dispatch | Despachar stock |
| POST   | /api/v1/inventory/adjust | Ajustar stock |
| POST   | /api/v1/inventory/transfer | Transferir entre almacenes |
| POST   | /api/v1/inventory/reservations | Reservar stock |
| POST   | /api/v1/inventory/reservations/:id/release | Liberar reserva |
| POST   | /api/v1/inventory/reservations/:id/consume | Consumir reserva |
| GET    | /api/v1/inventory/movements | Historial de movimientos |
| POST   | /api/v1/inventory/set-minimum-stock | Configurar stock mínimo |

### Warehouse (4 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/warehouses | Crear almacén |
| GET    | /api/v1/warehouses | Listar almacenes |
| POST   | /api/v1/warehouses/:id/default | Marcar como default |
| GET    | /api/v1/warehouses/:id | Obtener por ID |

## Domain Model

### InventoryItem Aggregate
- **Value Objects**: InventoryItemId, StockQuantity, StockMovement (9 tipos: INITIAL, RECEIPT, DISPATCH, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT, RESERVATION, RESERVATION_RELEASE, RESERVATION_CONSUME), StockReservation (5 estados: ACTIVE, HELD, CONFIRMED, RELEASED, CONSUMED)
- **Events**: Initialized, StockReceived, StockDispatched, StockAdjusted, StockReserved, ReservationReleased, ReservationConsumed, StockTransferred
- **Behavior**: initialize, receive, dispatch, adjust, transfer, reserve, releaseReservation, consumeReservation, setMinimumStock

### Warehouse Aggregate
- **Value Objects**: WarehouseId, WarehouseCode
- **Behavior**: rename, setAsDefault, activate, deactivate

## Multi-tenant

Todas las operaciones filtran por tenantId. Stock completamente aislado por tenant.

## Prisma Schema

Modelos añadidos: `Warehouse`, `InventoryItem`, `StockMovement`, `StockReservation`.

## Tests

```
42 tests en 3 suites:
  - inventory-item-aggregate.spec.ts (20 tests)
  - warehouse-aggregate.spec.ts      (7 tests)
  - inventory-app.service.spec.ts    (15 tests)
```

## Dependencias

- **Product Variant Domain**: InventoryItem se vincula a una variante mediante `productVariantId`. Sin acoplamiento directo entre agregados.

## Permisos

```
inventory.*: create, read, update, transfer, adjust, reserve, manage
warehouses.*: create, read, update, manage
```
