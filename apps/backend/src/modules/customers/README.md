# Customers Module (Fase 6.10)

Gestión de clientes del ecommerce con perfil, direcciones, preferencias, etiquetas, notas internas y métricas comerciales básicas.

## Arquitectura

```text
customers/
├── domain/            # Aggregate, VOs, entidades, eventos, repositorios y puertos
├── application/       # Commands, DTOs, mappers y validators
├── infrastructure/    # Repositorios InMemory + Prisma
├── presentation/      # Admin y Account REST controllers
├── services/          # CustomerAppService
└── customers.module.ts
```

## Aggregate Root

`Customer` concentra:

- perfil comercial
- estado comercial
- conversión guest -> authenticated
- direcciones
- preferencias
- etiquetas
- notas internas
- métricas básicas

## Estados

- `ACTIVE`
- `INACTIVE`
- `BLOCKED`
- `ARCHIVED`

## Orígenes

- `WEB`
- `ADMIN`
- `GUEST_CHECKOUT`
- `IMPORT`
- `MERCADO_LIBRE`
- `TIENDANUBE`
- `WOOCOMMERCE`
- `MANUAL`

## Endpoints

### Admin

- `POST /api/v1/admin/customers`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id/status`
- `POST /api/v1/admin/customers/:id/archive`
- `POST /api/v1/admin/customers/:id/restore`
- `GET /api/v1/admin/customers/:id/addresses`
- `POST /api/v1/admin/customers/:id/addresses`
- `PATCH /api/v1/admin/customers/:id/addresses/:addressId`
- `DELETE /api/v1/admin/customers/:id/addresses/:addressId`
- `POST /api/v1/admin/customers/:id/addresses/:addressId/default-shipping`
- `POST /api/v1/admin/customers/:id/addresses/:addressId/default-billing`
- `GET /api/v1/admin/customer-tags`
- `POST /api/v1/admin/customer-tags`
- `POST /api/v1/admin/customers/:id/tags/:tagId`
- `DELETE /api/v1/admin/customers/:id/tags/:tagId`
- `GET /api/v1/admin/customers/:id/notes`
- `POST /api/v1/admin/customers/:id/notes`
- `PATCH /api/v1/admin/customers/:id/notes/:noteId`
- `DELETE /api/v1/admin/customers/:id/notes/:noteId`
- `POST /api/v1/admin/customers/:id/recalculate-metrics`

### Account

- `GET /api/v1/account/profile`
- `PATCH /api/v1/account/profile`
- `GET /api/v1/account/addresses`
- `POST /api/v1/account/addresses`
- `PATCH /api/v1/account/addresses/:addressId`
- `DELETE /api/v1/account/addresses/:addressId`
- `PATCH /api/v1/account/preferences`

## Prisma Models

- `Customer`
- `CustomerAddress`
- `CustomerPreferences`
- `CustomerTag`
- `CustomerTagAssignment`
- `CustomerNote`

## Metrics

- `totalOrders`
- `totalSpent`
- `averageOrderValue`
- `firstOrderAt`
- `lastOrderAt`

`averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0`

## Tests

- 8 tests actuales cubren aggregate y service.
- `typecheck`, `jest` y `build` pasan.

## Pospuesto

- campañas marketing
- automatizaciones CRM
- loyalty/puntos
- segmentación avanzada
- facturación fiscal
- frontend
