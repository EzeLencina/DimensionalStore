# ÁRBOL COMPLETO DE CARPETAS

> Estructura monorepo con Turborepo. Vertical Slice Architecture con separación Clean Architecture dentro de cada módulo.

```
/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, typecheck, tests
│       ├── cd-backend.yml            # Build + deploy backend
│       └── cd-frontend.yml           # Build + deploy frontend
│
├── apps/
│   │
│   ├── backend/                      # NestJS Application
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   │
│   │   │   ├── core/                 # Shared Kernel (Clean Architecture outermost)
│   │   │   │   ├── application/      # Use cases genéricos, interfaces de servicios
│   │   │   │   │   ├── interfaces/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── ports/
│   │   │   │   ├── domain/           # Value Objects, Domain Events, Aggregates base
│   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   ├── sku.value-object.ts
│   │   │   │   │   │   ├── price.value-object.ts
│   │   │   │   │   │   ├── email.value-object.ts
│   │   │   │   │   │   ├── phone.value-object.ts
│   │   │   │   │   │   ├── currency.value-object.ts
│   │   │   │   │   │   └── address.value-object.ts
│   │   │   │   │   ├── events/
│   │   │   │   │   │   ├── domain-event.base.ts
│   │   │   │   │   │   └── domain-event.interface.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── base.entity.ts
│   │   │   │   │   ├── repositories/
│   │   │   │   │   │   └── repository.interface.ts
│   │   │   │   │   └── errors/
│   │   │   │   │       ├── domain-error.ts
│   │   │   │   │       └── business-rule-violation.ts
│   │   │   │   └── infrastructure/   # Cross-cutting infrastructure
│   │   │   │       ├── cache/
│   │   │   │       │   ├── cache.service.ts
│   │   │   │       │   └── cache.module.ts
│   │   │   │       ├── logger/
│   │   │   │       │   ├── logger.service.ts
│   │   │   │       │   └── logger.module.ts
│   │   │   │       ├── queue/
│   │   │   │       │   ├── queue.service.ts
│   │   │   │       │   └── queue.module.ts
│   │   │   │       ├── file-storage/
│   │   │   │       │   ├── file-storage.service.ts
│   │   │   │       │   └── file-storage.module.ts
│   │   │   │       ├── database/
│   │   │   │       │   ├── prisma.service.ts
│   │   │   │       │   ├── prisma.module.ts
│   │   │   │       │   └── prisma.middleware.ts   # tenant_id injection
│   │   │   │       ├── security/
│   │   │   │       │   ├── encryption.service.ts
│   │   │   │       │   └── security.module.ts
│   │   │   │       └── monitoring/
│   │   │   │           ├── tracing.service.ts
│   │   │   │           └── metrics.service.ts
│   │   │   │
│   │   │   ├── modules/             # Domain Modules (Bounded Contexts)
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   └── user.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   ├── password.value-object.ts
│   │   │   │   │   │   │   └── token.value-object.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   └── user-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── user-registered.event.ts
│   │   │   │   │   │   │   ├── user-logged-in.event.ts
│   │   │   │   │   │   │   └── password-changed.event.ts
│   │   │   │   │   │   └── errors/
│   │   │   │   │   │       └── auth-error.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── register-user/
│   │   │   │   │   │   │   │   ├── register-user.command.ts
│   │   │   │   │   │   │   │   ├── register-user.handler.ts
│   │   │   │   │   │   │   │   └── register-user.dto.ts
│   │   │   │   │   │   │   ├── login/
│   │   │   │   │   │   │   │   ├── login.command.ts
│   │   │   │   │   │   │   │   ├── login.handler.ts
│   │   │   │   │   │   │   │   └── login.dto.ts
│   │   │   │   │   │   │   ├── refresh-token/
│   │   │   │   │   │   │   ├── logout/
│   │   │   │   │   │   │   ├── change-password/
│   │   │   │   │   │   │   └── request-password-reset/
│   │   │   │   │   │   ├── queries/
│   │   │   │   │   │   │   ├── get-profile/
│   │   │   │   │   │   │   └── list-users/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   │       ├── auth.service.interface.ts
│   │   │   │   │   │       ├── token.service.interface.ts
│   │   │   │   │   │       └── password-hasher.interface.ts
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   │   └── prisma-user.repository.ts
│   │   │   │   │   │   ├── services/
│   │   │   │   │   │   │   ├── jwt-token.service.ts
│   │   │   │   │   │   │   └── bcrypt-password-hasher.ts
│   │   │   │   │   │   └── strategies/
│   │   │   │   │   │       ├── jwt.strategy.ts
│   │   │   │   │   │       └── jwt-refresh.strategy.ts
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   │   │   └── users.controller.ts
│   │   │   │   │   │   ├── guards/
│   │   │   │   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   │   │   │   ├── roles.guard.ts
│   │   │   │   │   │   │   └── permissions.guard.ts
│   │   │   │   │   │   ├── decorators/
│   │   │   │   │   │   │   ├── current-user.decorator.ts
│   │   │   │   │   │   │   ├── roles.decorator.ts
│   │   │   │   │   │   │   └── permissions.decorator.ts
│   │   │   │   │   │   │── dto/
│   │   │   │   │   │   └── interceptors/
│   │   │   │   │   └── auth.module.ts
│   │   │   │   │
│   │   │   │   ├── catalog/          # Productos, Categorías, Marcas, SKU
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── product.entity.ts
│   │   │   │   │   │   │   ├── product-variant.entity.ts
│   │   │   │   │   │   │   ├── category.entity.ts
│   │   │   │   │   │   │   └── brand.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   ├── sku.value-object.ts
│   │   │   │   │   │   │   ├── price.value-object.ts
│   │   │   │   │   │   │   └── product-status.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   ├── product-repository.interface.ts
│   │   │   │   │   │   │   ├── category-repository.interface.ts
│   │   │   │   │   │   │   └── brand-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── product-created.event.ts
│   │   │   │   │   │   │   ├── product-updated.event.ts
│   │   │   │   │   │   │   ├── product-price-changed.event.ts
│   │   │   │   │   │   │   └── product-stock-alert.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── sku-generator.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── create-product/
│   │   │   │   │   │   │   ├── update-product/
│   │   │   │   │   │   │   ├── update-product-price/
│   │   │   │   │   │   │   ├── change-product-status/
│   │   │   │   │   │   │   └── import-products/
│   │   │   │   │   │   ├── queries/
│   │   │   │   │   │   │   ├── get-product-by-sku/
│   │   │   │   │   │   │   ├── list-products/
│   │   │   │   │   │   │   ├── search-products/
│   │   │   │   │   │   │   └── get-product-history/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   │       ├── catalog-search.port.ts
│   │   │   │   │   │       └── product-cache.port.ts
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   │   ├── prisma-product.repository.ts
│   │   │   │   │   │   │   ├── prisma-category.repository.ts
│   │   │   │   │   │   │   └── prisma-brand.repository.ts
│   │   │   │   │   │   ├── cache/
│   │   │   │   │   │   │   └── redis-product-cache.ts
│   │   │   │   │   │   └── search/
│   │   │   │   │   │       └── meilisearch-adapter.ts  # futuro
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   │   ├── products.controller.ts
│   │   │   │   │   │   │   ├── categories.controller.ts
│   │   │   │   │   │   │   └── brands.controller.ts
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   │   ├── create-product.dto.ts
│   │   │   │   │   │   │   ├── update-product.dto.ts
│   │   │   │   │   │   │   ├── product-response.dto.ts
│   │   │   │   │   │   │   └── product-list-query.dto.ts
│   │   │   │   │   │   └── interceptors/
│   │   │   │   │   │       └── product-cache.interceptor.ts
│   │   │   │   │   └── catalog.module.ts
│   │   │   │   │
│   │   │   │   ├── inventory/        # Stock, movimientos, alertas
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── stock.entity.ts
│   │   │   │   │   │   │   ├── inventory-movement.entity.ts
│   │   │   │   │   │   │   └── warehouse.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   ├── movement-type.enum.ts
│   │   │   │   │   │   │   └── stock-level.value-object.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   ├── stock-repository.interface.ts
│   │   │   │   │   │   │   └── movement-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── stock-reserved.event.ts
│   │   │   │   │   │   │   ├── stock-decreased.event.ts
│   │   │   │   │   │   │   ├── stock-increased.event.ts
│   │   │   │   │   │   │   ├── stock-alert-triggered.event.ts
│   │   │   │   │   │   │   └── low-stock-detected.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── stock-validator.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── reserve-stock/
│   │   │   │   │   │   │   ├── confirm-stock/
│   │   │   │   │   │   │   ├── adjust-stock/
│   │   │   │   │   │   │   ├── transfer-stock/
│   │   │   │   │   │   │   └── set-stock-alert/
│   │   │   │   │   │   ├── queries/
│   │   │   │   │   │   │   ├── get-stock-by-sku/
│   │   │   │   │   │   │   ├── get-movement-history/
│   │   │   │   │   │   │   └── get-low-stock-products/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   │       └── inventory-notification.port.ts
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   │   ├── prisma-stock.repository.ts
│   │   │   │   │   │   │   └── prisma-movement.repository.ts
│   │   │   │   │   │   └── queue/
│   │   │   │   │   │       └── inventory-queue.service.ts
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   │   ├── stock.controller.ts
│   │   │   │   │   │   │   └── movements.controller.ts
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   └── inventory.module.ts
│   │   │   │   │
│   │   │   │   ├── orders/           # Ventas, pedidos, envíos
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── order.entity.ts
│   │   │   │   │   │   │   ├── order-line.entity.ts
│   │   │   │   │   │   │   ├── shipment.entity.ts
│   │   │   │   │   │   │   └── cart.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   ├── order-status.enum.ts
│   │   │   │   │   │   │   ├── shipping-cost.value-object.ts
│   │   │   │   │   │   │   └── payment-method.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   ├── order-repository.interface.ts
│   │   │   │   │   │   │   └── cart-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── order-created.event.ts
│   │   │   │   │   │   │   ├── order-confirmed.event.ts
│   │   │   │   │   │   │   ├── order-shipped.event.ts
│   │   │   │   │   │   │   ├── order-delivered.event.ts
│   │   │   │   │   │   │   ├── order-cancelled.event.ts
│   │   │   │   │   │   │   └── order-refunded.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       ├── order-pricing.service.ts
│   │   │   │   │   │       └── order-status-machine.ts  # State machine
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── create-order/
│   │   │   │   │   │   │   ├── confirm-order/
│   │   │   │   │   │   │   ├── cancel-order/
│   │   │   │   │   │   │   ├── refund-order/
│   │   │   │   │   │   │   └── update-shipping-status/
│   │   │   │   │   │   ├── queries/
│   │   │   │   │   │   │   ├── get-order/
│   │   │   │   │   │   │   ├── list-orders/
│   │   │   │   │   │   │   └── get-order-history/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   │       ├── order-payment.port.ts
│   │   │   │   │   │       ├── order-shipping.port.ts
│   │   │   │   │   │       └── order-notification.port.ts
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   │   ├── prisma-order.repository.ts
│   │   │   │   │   │   │   └── prisma-cart.repository.ts
│   │   │   │   │   │   ├── queue/
│   │   │   │   │   │   │   └── order-queue.service.ts
│   │   │   │   │   │   └── integrations/
│   │   │   │   │   │       └── payment-gateway.port.ts
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   │   ├── orders.controller.ts
│   │   │   │   │   │   │   ├── cart.controller.ts
│   │   │   │   │   │   │   └── checkout.controller.ts
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   └── orders.module.ts
│   │   │   │   │
│   │   │   │   ├── purchases/        # Compras a proveedores
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── purchase-order.entity.ts
│   │   │   │   │   │   │   ├── purchase-line.entity.ts
│   │   │   │   │   │   │   └── supplier.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   └── purchase-status.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   ├── purchase-repository.interface.ts
│   │   │   │   │   │   │   └── supplier-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── purchase-order-created.event.ts
│   │   │   │   │   │   │   ├── purchase-order-received.event.ts
│   │   │   │   │   │   │   └── stock-expected.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── purchase-forecast.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── create-purchase-order/
│   │   │   │   │   │   │   ├── receive-purchase-order/
│   │   │   │   │   │   │   └── cancel-purchase-order/
│   │   │   │   │   │   ├── queries/
│   │   │   │   │   │   │   ├── list-purchase-orders/
│   │   │   │   │   │   │   └── get-supplier-history/
│   │   │   │   │   │   └── ports/
│   │   │   │   │   │       └── supplier-port.interface.ts
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── queue/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   └── purchases.module.ts
│   │   │   │   │
│   │   │   │   ├── crm/              # Clientes, segmentos, historial
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── customer.entity.ts
│   │   │   │   │   │   │   ├── customer-segment.entity.ts
│   │   │   │   │   │   │   └── customer-address.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   └── customer-tier.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   └── customer-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── customer-created.event.ts
│   │   │   │   │   │   │   ├── customer-tier-changed.event.ts
│   │   │   │   │   │   │   └── customer-activity.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── customer-scoring.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   └── queries/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── queue/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   └── crm.module.ts
│   │   │   │   │
│   │   │   │   ├── finances/         # Caja, ingresos, egresos, libros
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── cash-register.entity.ts
│   │   │   │   │   │   │   ├── transaction.entity.ts
│   │   │   │   │   │   │   ├── account.entity.ts
│   │   │   │   │   │   │   └── invoice.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   ├── money.value-object.ts
│   │   │   │   │   │   │   ├── tax.value-object.ts
│   │   │   │   │   │   │   ├── transaction-type.enum.ts
│   │   │   │   │   │   │   └── currency.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   │   ├── transaction-repository.interface.ts
│   │   │   │   │   │   │   └── cash-register-repository.interface.ts
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   │   ├── payment-received.event.ts
│   │   │   │   │   │   │   ├── payment-refunded.event.ts
│   │   │   │   │   │   │   ├── cash-register-opened.event.ts
│   │   │   │   │   │   │   └── cash-register-closed.event.ts
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       ├── tax-calculator.service.ts
│   │   │   │   │   │       └── profit-calculator.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── commands/
│   │   │   │   │   │   │   ├── open-cash-register/
│   │   │   │   │   │   │   ├── close-cash-register/
│   │   │   │   │   │   │   ├── register-payment/
│   │   │   │   │   │   │   ├── register-expense/
│   │   │   │   │   │   │   └── generate-invoice/
│   │   │   │   │   │   └── queries/
│   │   │   │   │   │       ├── get-cash-register-status/
│   │   │   │   │   │       ├── get-daily-closure/
│   │   │   │   │   │       └── get-profitability-by-sku/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   └── queue/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   │   ├── controllers/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   └── guards/
│   │   │   │   │   └── finances.module.ts
│   │   │   │   │
│   │   │   │   ├── cms/              # Landing, páginas, SEO, temas
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── page.entity.ts
│   │   │   │   │   │   │   ├── section.entity.ts
│   │   │   │   │   │   │   └── theme.entity.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── seo.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── cms.module.ts
│   │   │   │   │
│   │   │   │   ├── marketing/        # Cupones, campañas, email
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── coupon.entity.ts
│   │   │   │   │   │   │   ├── campaign.entity.ts
│   │   │   │   │   │   │   └── discount-rule.entity.ts
│   │   │   │   │   │   ├── value-objects/
│   │   │   │   │   │   │   └── discount-type.enum.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── coupon-validator.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── marketing.module.ts
│   │   │   │   │
│   │   │   │   ├── analytics/        # Reportes, métricas, dashboards
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── analytics.module.ts
│   │   │   │   │
│   │   │   │   ├── configuration/    # Config general, impuestos, métodos pago
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── configuration.module.ts
│   │   │   │   │
│   │   │   │   ├── users/            # Gestión de usuarios del sistema
│   │   │   │   │   ├── domain/
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── users.module.ts
│   │   │   │   │
│   │   │   │   ├── roles/            # Roles y permisos
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   │   ├── role.entity.ts
│   │   │   │   │   │   │   └── permission.entity.ts
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── events/
│   │   │   │   │   │   └── services/
│   │   │   │   │   │       └── permission-validator.service.ts
│   │   │   │   │   ├── application/
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── presentation/
│   │   │   │   │   └── roles.module.ts
│   │   │   │   │
│   │   │   │   └── integrations/     # APIs externas, webhooks
│   │   │   │       ├── domain/
│   │   │   │       ├── application/
│   │   │   │       ├── infrastructure/
│   │   │   │       │   ├── payment-gateway/
│   │   │   │       │   │   ├── mercadopago/
│   │   │   │       │   │   └── stripe/
│   │   │   │       │   ├── shipping/
│   │   │   │       │   └── email/
│   │   │   │       ├── presentation/
│   │   │   │       └── integrations.module.ts
│   │   │   │
│   │   │   ├── common/               # Cross-module shared (no negocio)
│   │   │   │   ├── filters/
│   │   │   │   │   ├── http-exception.filter.ts
│   │   │   │   │   └── domain-error.filter.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── logging.interceptor.ts
│   │   │   │   │   ├── transform.interceptor.ts
│   │   │   │   │   ├── timeout.interceptor.ts
│   │   │   │   │   └── audit.interceptor.ts
│   │   │   │   ├── guards/
│   │   │   │   │   ├── tenant.guard.ts
│   │   │   │   │   └── throttle.guard.ts
│   │   │   │   ├── pipes/
│   │   │   │   │   ├── validation.pipe.ts
│   │   │   │   │   └── parse-sku.pipe.ts
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── tenant.middleware.ts
│   │   │   │   │   ├── logging.middleware.ts
│   │   │   │   │   └── cors.middleware.ts
│   │   │   │   ├── constants/
│   │   │   │   ├── helpers/
│   │   │   │   └── decorators/
│   │   │   │       ├── public.decorator.ts
│   │   │   │       └── skip-audit.decorator.ts
│   │   │   │
│   │   │   └── config/               # Configuración de NestJS
│   │   │       ├── env.config.ts
│   │   │       ├── database.config.ts
│   │   │       ├── redis.config.ts
│   │   │       ├── jwt.config.ts
│   │   │       ├── cors.config.ts
│   │   │       └── swagger.config.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Schema único (modularizado por comentarios)
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── test/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   │
│   │   ├── docker/
│   │   │   └── Dockerfile
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── frontend/                     # Next.js Application
│       ├── src/
│       │   ├── app/                  # App Router (pages)
│       │   │   ├── (shop)/           # Route Group: Tienda pública
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx      # Home
│       │   │   │   ├── productos/
│       │   │   │   │   ├── page.tsx  # Listado
│       │   │   │   │   └── [slug]/
│       │   │   │   │       └── page.tsx  # Detalle
│       │   │   │   ├── categorias/
│       │   │   │   ├── carrito/
│       │   │   │   ├── checkout/
│       │   │   │   ├── cuenta/
│       │   │   │   ├── about/
│       │   │   │   └── contact/
│       │   │   │
│       │   │   ├── (dashboard)/      # Route Group: Admin
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx      # Dashboard home
│       │   │   │   ├── productos/
│       │   │   │   ├── inventario/
│       │   │   │   ├── ventas/
│       │   │   │   ├── compras/
│       │   │   │   ├── clientes/
│       │   │   │   ├── finanzas/
│       │   │   │   ├── crm/
│       │   │   │   ├── marketing/
│       │   │   │   ├── contenido/
│       │   │   │   ├── reportes/
│       │   │   │   ├── configuracion/
│       │   │   │   ├── usuarios/
│       │   │   │   └── roles/
│       │   │   │
│       │   │   ├── (auth)/           # Route Group: Auth
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── login/
│       │   │   │   ├── register/
│       │   │   │   └── reset-password/
│       │   │   │
│       │   │   ├── api/              # Next.js API routes (BFF ligeros)
│       │   │   └── error.tsx
│       │   │
│       │   ├── components/           # Componentes de UI
│       │   │   ├── ui/               # shadcn/ui components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── dropdown-menu.tsx
│       │   │   │   ├── table.tsx
│       │   │   │   ├── data-table.tsx
│       │   │   │   ├── form.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   └── ...
│       │   │   ├── shared/           # Componentes compartidos del negocio
│       │   │   │   ├── header.tsx
│       │   │   │   ├── footer.tsx
│       │   │   │   ├── sidebar.tsx
│       │   │   │   ├── sku-input.tsx
│       │   │   │   ├── price-input.tsx
│       │   │   │   ├── search-input.tsx
│       │   │   │   ├── pagination.tsx
│       │   │   │   ├── empty-state.tsx
│       │   │   │   ├── loading-state.tsx
│       │   │   │   ├── error-state.tsx
│       │   │   │   └── confirm-dialog.tsx
│       │   │   ├── layouts/
│       │   │   │   ├── shop-layout.tsx
│       │   │   │   ├── dashboard-layout.tsx
│       │   │   │   └── auth-layout.tsx
│       │   │   ├── forms/
│       │   │   │   ├── product-form/
│       │   │   │   ├── category-form/
│       │   │   │   ├── order-form/
│       │   │   │   ├── customer-form/
│       │   │   │   ├── supplier-form/
│       │   │   │   └── ...
│       │   │   └── charts/
│       │   │       ├── line-chart.tsx
│       │   │       ├── bar-chart.tsx
│       │   │       ├── pie-chart.tsx
│       │   │       └── kpi-card.tsx
│       │   │
│       │   ├── hooks/                # Custom hooks
│       │   │   ├── use-auth.ts
│       │   │   ├── use-tenant.ts
│       │   │   ├── use-pagination.ts
│       │   │   ├── use-filters.ts
│       │   │   ├── use-debounce.ts
│       │   │   ├── use-media-query.ts
│       │   │   ├── use-permissions.ts
│       │   │   └── use-notification.ts
│       │   │
│       │   ├── stores/               # Estado global (Zustand)
│       │   │   ├── auth-store.ts
│       │   │   ├── cart-store.ts
│       │   │   ├── ui-store.ts
│       │   │   └── tenant-store.ts
│       │   │
│       │   ├── services/             # API clients
│       │   │   ├── api-client.ts     # Axios/fetch wrapper
│       │   │   ├── auth.service.ts
│       │   │   ├── products.service.ts
│       │   │   ├── orders.service.ts
│       │   │   ├── inventory.service.ts
│       │   │   ├── customers.service.ts
│       │   │   └── ...
│       │   │
│       │   ├── lib/                  # Utilidades
│       │   │   ├── auth.ts
│       │   │   ├── session.ts
│       │   │   ├── sku.ts
│       │   │   ├── format.ts
│       │   │   ├── currency.ts
│       │   │   ├── date.ts
│       │   │   ├── cn.ts             # clsx + tailwind-merge
│       │   │   └── constants.ts
│       │   │
│       │   ├── types/                # TypeScript tipos
│       │   │   ├── api.types.ts
│       │   │   ├── product.types.ts
│       │   │   ├── order.types.ts
│       │   │   ├── customer.types.ts
│       │   │   ├── inventory.types.ts
│       │   │   ├── auth.types.ts
│       │   │   ├── common.types.ts
│       │   │   └── ui.types.ts
│       │   │
│       │   ├── validators/           # Zod schemas
│       │   │   ├── product.schema.ts
│       │   │   ├── order.schema.ts
│       │   │   ├── customer.schema.ts
│       │   │   ├── auth.schema.ts
│       │   │   └── common.schema.ts
│       │   │
│       │   ├── providers/            # React Context providers
│       │   │   ├── query-provider.tsx
│       │   │   ├── auth-provider.tsx
│       │   │   ├── theme-provider.tsx
│       │   │   └── tenant-provider.tsx
│       │   │
│       │   ├── middleware.ts         # Next.js Edge Middleware
│       │   ├── i18n.ts               # Internacionalización
│       │   └── styles/
│       │       └── globals.css
│       │
│       ├── public/
│       │   ├── images/
│       │   └── fonts/
│       │
│       ├── docker/
│       │   └── Dockerfile
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       ├── .env.example
│       └── package.json
│
├── packages/
│   ├── shared/                       # Tipos y contratos compartidos
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── product.types.ts
│   │   │   │   ├── order.types.ts
│   │   │   │   ├── customer.types.ts
│   │   │   │   ├── inventory.types.ts
│   │   │   │   ├── finance.types.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   ├── api.types.ts      # Envelope de respuesta genérico
│   │   │   │   └── pagination.types.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── repository.interface.ts
│   │   │   │   └── service.interface.ts
│   │   │   ├── constants/
│   │   │   │   ├── permissions.ts
│   │   │   │   ├── order-status.ts
│   │   │   │   └── error-codes.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── database/                     # Prisma schema + config + seeds
│   │   ├── prisma/
│   │   │   ├── schema/
│   │   │   │   ├── base.prisma       # Tenant, Config, Archivos
│   │   │   │   ├── auth.prisma       # User, Session
│   │   │   │   ├── catalog.prisma    # Product, Variant, Category, Brand
│   │   │   │   ├── inventory.prisma  # Stock, Movement, Warehouse
│   │   │   │   ├── orders.prisma     # Order, OrderLine, Cart
│   │   │   │   ├── crm.prisma        # Customer, Address, Segment
│   │   │   │   ├── finances.prisma   # CashRegister, Transaction, Invoice
│   │   │   │   ├── purchases.prisma  # PurchaseOrder, Supplier
│   │   │   │   ├── marketing.prisma  # Coupon, Campaign
│   │   │   │   ├── cms.prisma        # Page, Section
│   │   │   │   ├── roles.prisma      # Role, Permission, RolePermission
│   │   │   │   └── audit.prisma      # AuditLog
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ui/                           # shadcn/ui — componentes base
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── config/                       # ESLint, TypeScript, Tailwind
│   │   ├── eslint/
│   │   ├── typescript/
│   │   └── tailwind/
│   │
│   ├── queue/                        # BullMQ job definitions
│   │   ├── src/
│   │   │   ├── jobs/
│   │   │   │   ├── email.job.ts
│   │   │   │   ├── notification.job.ts
│   │   │   │   ├── report.job.ts
│   │   │   │   ├── cache-invalidation.job.ts
│   │   │   │   └── stock-alert.job.ts
│   │   │   ├── queues/
│   │   │   │   ├── email.queue.ts
│   │   │   │   ├── notification.queue.ts
│   │   │   │   ├── report.queue.ts
│   │   │   │   └── default.queue.ts
│   │   │   └── processors/
│   │   └── package.json
│   │
│   └── utils/                        # Utilidades compartidas
│       ├── src/
│       │   ├── sku-generator.ts
│       │   ├── slug.ts
│       │   ├── date-utils.ts
│       │   ├── number-utils.ts
│       │   ├── string-utils.ts
│       │   └── validation-utils.ts
│       ├── tsconfig.json
│       └── package.json
│
├── docker/
│   ├── dev/
│   │   ├── docker-compose.yml        # PostgreSQL + Redis + app
│   │   └── Dockerfile
│   └── prod/
│       ├── docker-compose.yml
│       ├── nginx/
│       │   └── nginx.conf
│       └── monitoring/
│           ├── prometheus.yml
│           └── grafana-dashboard.json
│
├── docs/
│   └── architecture/
│       ├── 00-visao-general.md
│       ├── 01-arbol-completo-carpetas.md
│       ├── 02-backend-arquitectura.md
│       ├── 03-frontend-arquitectura.md
│       ├── 04-base-de-datos.md
│       ├── 05-seguridad-rbac.md
│       ├── 06-api-design.md
│       └── 07-dependencias-riesgos-roadmap.md
│
├── scripts/
│   ├── setup.sh
│   ├── seed-dev.sh
│   ├── migrate.sh
│   └── docker-clean.sh
│
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── .dockerignore
├── .prettierrc
├── .eslintrc.js
└── README.md
```

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Módulos NestJS** | kebab-case | `catalog.module.ts` |
| **Controladores** | kebab-case | `products.controller.ts` |
| **Servicios** | kebab-case | `product.service.ts` |
| **Entidades de dominio** | PascalCase | `Product.entity.ts` |
| **Value Objects** | PascalCase | `Sku.value-object.ts` |
| **DTOs** | PascalCase | `CreateProduct.dto.ts` |
| **Comandos** | PascalCase | `CreateProduct.command.ts` |
| **Handlers** | PascalCase | `CreateProduct.handler.ts` |
| **Eventos** | PascalCase | `ProductCreated.event.ts` |
| **Carpetas de módulos** | kebab-case | `inventory/`, `purchases/` |
| **Carpetas de features** | kebab-case | `create-product/` |
| **Componentes React** | PascalCase | `ProductCard.tsx` |
| **Hooks** | camelCase | `useAuth.ts` |
| **Servicios frontend** | camelCase | `products.service.ts` |
| **Stores** | camelCase | `auth-store.ts` |
| **Schemas Zod** | camelCase | `product.schema.ts` |
