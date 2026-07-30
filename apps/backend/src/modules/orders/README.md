# Order Management Module (Fase 6.9)

Gestión operativa del ciclo de vida de pedidos reutilizando `Order` y `OrderItem` de Checkout. No existe un segundo aggregate de pedido.

## Máquina de Estados

```text
PENDING_PAYMENT ──→ PAYMENT_CONFIRMED ──→ PROCESSING ──→ READY_FOR_PICKUP ──→ DELIVERED
       │                    │                  │                 │
       ├→ PAYMENT_FAILED    ├→ CANCELLED       ├→ SHIPPED ───────┘
       ├→ CANCELLED          │                  └→ CANCELLED
       └→ EXPIRED            └→ CANCELLED

PAYMENT_FAILED ──→ PENDING_PAYMENT | CANCELLED | EXPIRED
SHIPPED ────────→ DELIVERED
```

Estados preparados para fases posteriores: `PARTIALLY_CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `REFUNDED`, `PARTIALLY_REFUNDED`.

`DELIVERED`, `CANCELLED` y `EXPIRED` son terminales. Las transiciones solo se ejecutan mediante comandos semánticos; no existe `PATCH /status`.

## Arquitectura

```text
orders/
├── domain/             # Historial, notas, cancelaciones, ports y eventos
├── application/        # Commands, DTOs, mappers y validators
├── infrastructure/      # Repositorios InMemory y Prisma
├── presentation/       # APIs admin y customer
├── services/            # OrderAppService
└── orders.module.ts
```

## Casos de Uso

- Consultar por ID, número, cliente y filtros administrativos.
- Confirmar/fallar/reintentar pago.
- Iniciar procesamiento, preparar retiro, despachar y entregar.
- Cancelar y expirar pedidos pendientes.
- Agregar y eliminar notas internas o visibles al cliente.
- Consultar historial inmutable de estados.

## APIs

### Administración

`/api/v1/admin/orders`

- `GET /`
- `GET /:id`
- `GET /number/:orderNumber`
- `GET /:id/history`
- `POST /:id/notes`
- `DELETE /:id/notes/:noteId`
- `POST /:id/confirm-payment`
- `POST /:id/payment-failed`
- `POST /:id/retry-payment`
- `POST /:id/start-processing`
- `POST /:id/ready-for-pickup`
- `POST /:id/ship`
- `POST /:id/deliver`
- `POST /:id/cancel`
- `POST /:id/expire`

### Cliente

- `GET /api/v1/account/orders`
- `GET /api/v1/account/orders/:id`

La consulta de cliente exige coincidencia de `customerId` y `tenantId`. Las notas `INTERNAL` nunca se incluyen en respuestas de cliente.

## Persistencia

Se extendió `Order` con estados, timestamps operativos, estados de pago/fulfillment y tracking. Se agregaron:

- `OrderStatusHistory`, append-only.
- `OrderNote`, con soft delete y visibilidad.
- `OrderCancellation`, con unicidad de cancelación total por tenant/pedido.

Migración: `20250730000009_add_order_management`.

## Permisos

```text
orders.read
orders.read-own
orders.update
orders.confirm-payment
orders.process
orders.ship
orders.deliver
orders.cancel
orders.notes
orders.manage
```

## Eventos

`OrderPaymentConfirmed`, `OrderPaymentFailed`, `OrderProcessingStarted`, `OrderReadyForPickup`, `OrderShipped`, `OrderDelivered`, `OrderCancelled`, `OrderExpired` y `OrderNoteAdded`.

## Tests

39 tests específicos del módulo cubren aggregate, máquina de estados, notas, cancelaciones, historial, consultas customer-scoped, idempotencia y liberación de reservas. La suite total queda en 572 tests.

## Pospuesto

Pagos reales, reembolsos, devoluciones, ARCA, transportistas, frontend y cancelación parcial completa no forman parte de esta fase. Los puertos de inventario, payment status y publicación de eventos quedan preparados.
