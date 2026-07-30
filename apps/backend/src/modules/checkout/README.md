# Checkout & Order Module (Fase 6.8)

Dominio de Checkout y Creación de Órdenes, implementado siguiendo DDD, Clean Architecture y multi-tenant.

## Arquitectura

```
checkout/
├── domain/                    # Core business logic
│   ├── value-objects/         # 7 Value Objects
│   ├── aggregates/            # CheckoutSession, Order, OrderItem (child entity)
│   ├── events/                # 6 Domain Events
│   ├── exceptions/            # CheckoutException
│   ├── repositories/          # Puerto interfaces (CHECKOUT_SESSION_REPOSITORY, ORDER_REPOSITORY, IDEMPOTENCY_REPOSITORY)
│   └── ports/                 # Puertos externos (CartReader, PricingResolver, InventoryReservationService, etc.)
├── application/               # Casos de uso
│   ├── commands/              # Commands
│   ├── dto/                   # DTOs de entrada/salida
│   └── mappers/               # CheckoutMapper
├── infrastructure/            # Implementaciones técnicas
│   └── persistence/
│       ├── prisma/            # Repositorios Prisma + Mappers
│       └── in-memory/         # Repositorios en memoria (tests)
├── presentation/              # Controladores REST
│   ├── controllers/           # CheckoutController
│   └── interceptors/          # CheckoutExceptionFilter
├── services/                  # CheckoutAppService
├── events/                    # CheckoutEventHandler
├── providers/                 # DI providers
├── constants/                 # Permisos
└── checkout.module.ts         # Módulo NestJS
```

## Endpoints REST (8)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | /api/v1/checkout | Iniciar checkout |
| GET    | /api/v1/checkout/:id | Obtener sesión |
| PATCH  | /api/v1/checkout/:id/address | Actualizar dirección |
| PATCH  | /api/v1/checkout/:id/shipping-method | Seleccionar envío |
| PATCH  | /api/v1/checkout/:id/payment-method | Seleccionar pago |
| POST   | /api/v1/checkout/:id/validate | Validar checkout |
| POST   | /api/v1/checkout/:id/confirm | Confirmar y crear orden |
| POST   | /api/v1/checkout/:id/cancel | Cancelar checkout |

## Domain Model

### CheckoutSession Aggregate
- **Value Objects**: CheckoutId, CheckoutStatus (OPEN, VALIDATING, READY, COMPLETED, CANCELLED, EXPIRED), Address (recipientName, street, number, city, province, postalCode, country), IdempotencyKey
- **Events**: Started, Validated, Confirmed, Cancelled, Expired
- **Behavior**: setAddress, selectShippingMethod, selectPaymentMethod, validate, confirm, cancel, expire

### Status Transitions
```
OPEN ───────→ VALIDATING ──→ READY ──→ COMPLETED
OPEN ───────→ CANCELLED
OPEN ───────→ EXPIRED
VALIDATING ─→ READY
VALIDATING ─→ CANCELLED
READY ──────→ COMPLETED
READY ──────→ CANCELLED
```

### Order Aggregate
- **Value Objects**: OrderId, OrderStatus (PENDING_PAYMENT, CONFIRMED, SHIPPING, DELIVERED, CANCELLED)
- **Events**: Created
- **Behavior**: confirm, ship, deliver, cancel

### OrderItem (Child Entity)
- Snapshots de producto: productVariantId, sku, productName, variantName, quantity, unitPrice

## Puerto Externos

- **CartReader**: leer carrito y sus ítems
- **PricingResolver**: verificar precio al confirmar (protección contra cambios de precio)
- **InventoryReservationService**: reservar stock al confirmar
- **ProductVariantReader**: obtener nombre de variante para snapshots
- **CustomerReader**: validar cliente y obtener email
- **ShippingMethodReader**: validar método de envío
- **PaymentMethodReader**: validar método de pago
- **OrderNumberGenerator**: generar número de orden secuencial
- **Clock**: fuente de tiempo (inyectable para tests)

## Idempotencia

El endpoint de confirmación usa `IdempotencyKey` con hash SHA-256 del payload (key + checkoutId). Previene órdenes duplicadas en retries de red.

## Flujo de Confirmación

1. Validate → set status VALIDATING
2. Leer carrito (debe estar ACTIVE)
3. Verificar precios contra snapshot del carrito
4. Obtener nombres de variantes para snapshots
5. Set status READY
6. Reservar stock
7. Generar número de orden
8. Crear Order con OrderItem snapshots
9. Set status COMPLETED
10. Guardar idempotency record
11. Persistir checkout session y order

## Multi-tenant

Todas las operaciones filtran por tenantId. Órdenes y sesiones aisladas por tenant.

## Prisma Schema

Modelos añadidos: `CheckoutSession`, `CheckoutAddress`, `Order`, `OrderItem`, `IdempotencyRecord`.

## Tests

```
31 tests en 3 suites:
  - checkout-session-aggregate.spec.ts (11 tests)
  - order-aggregate.spec.ts            (5 tests)
  - checkout-app.service.spec.ts       (15 tests)
```

## Dependencias

- **Cart**: lectura de carrito vía CartReader port
- **Pricing**: verificación de precios vía PricingResolver port
- **Inventory**: reserva de stock vía InventoryReservationService port
- **Product Variant**: nombre de variante vía ProductVariantReader port
- Sin acoplamiento directo a implementaciones concretas

## Permisos

```
checkout.*: create, read, update, confirm, cancel, manage
orders.*: create, read, update, manage
```
