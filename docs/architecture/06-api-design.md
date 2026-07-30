# API DESIGN

> REST API Versionada · Convenciones · Respuestas · Errores · Paginación · Filtros

---

## 1. Versionado

```
Estrategia: URL Path Versioning

/api/v1/products
/api/v2/products  (futuro)
```

Headers de versión también disponibles:

```
Accept: application/vnd.tienda.v1+json
```

---

## 2. Convención de Endpoints

### Reglas Generales

| Regla | Ejemplo |
|-------|---------|
| **Sustantivos en plural** | `/products`, `/orders`, `/customers` |
| **SKU como identificador** | `/products/{sku}` (nunca `/products/{id}`) |
| **Snake_case en params** | `?page=1&per_page=20&sort_by=created_at&sort_order=desc` |
| **Nested resources** | `/orders/{id}/lines`, `/products/{sku}/variants` |
| **Acciones como POST** | `/orders/{id}/cancel`, `/products/{sku}/change-status` |
| **No verbos en URL** | ✅ `POST /orders` · ❌ `POST /createOrder` |

### Lista de Endpoints por Módulo

```
# Auth
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/change-password
POST   /api/v1/auth/reset-password                  # futuro
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile

# Catalog
GET    /api/v1/products                             # Listar (paginado, filtros)
POST   /api/v1/products                             # Crear
GET    /api/v1/products/{sku}                       # Por SKU
PUT    /api/v1/products/{sku}                       # Actualizar
DELETE /api/v1/products/{sku}                       # Baja lógica
POST   /api/v1/products/{sku}/change-status         # Acción
GET    /api/v1/products/{sku}/variants              # Variantes
POST   /api/v1/products/{sku}/variants              # Crear variante
PUT    /api/v1/products/{sku}/variants/{variantSku}
DELETE /api/v1/products/{sku}/variants/{variantSku}
POST   /api/v1/products/import                       # Importación CSV
GET    /api/v1/products/export                       # Exportación CSV
GET    /api/v1/categories
POST   /api/v1/categories
GET    /api/v1/categories/{id}
PUT    /api/v1/categories/{id}
DELETE /api/v1/categories/{id}
GET    /api/v1/brands
POST   /api/v1/brands
GET    /api/v1/brands/{id}
PUT    /api/v1/brands/{id}
DELETE /api/v1/brands/{id}

# Inventory
GET    /api/v1/stock                                 # Stock general
GET    /api/v1/stock/{sku}                           # Stock por SKU
PUT    /api/v1/stock/{sku}/adjust                    # Ajuste manual
POST   /api/v1/stock/transfer                        # Transferencia
GET    /api/v1/stock/movements                       # Historial
GET    /api/v1/stock/alerts                          # Alertas de stock bajo
PUT    /api/v1/stock/alerts/{sku}                    # Configurar alerta
GET    /api/v1/warehouses
POST   /api/v1/warehouses
PUT    /api/v1/warehouses/{id}

# Orders
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/{id}
PUT    /api/v1/orders/{id}                           # Actualizar (ej: dirección)
POST   /api/v1/orders/{id}/confirm
POST   /api/v1/orders/{id}/ship                      # Registrar envío
POST   /api/v1/orders/{id}/deliver
POST   /api/v1/orders/{id}/cancel
POST   /api/v1/orders/{id}/refund
GET    /api/v1/orders/{id}/lines
GET    /api/v1/orders/{id}/history

# Cart
GET    /api/v1/cart
POST   /api/v1/cart/items                            # Agregar item
PUT    /api/v1/cart/items/{sku}                      # Actualizar cantidad
DELETE /api/v1/cart/items/{sku}                      # Quitar item
POST   /api/v1/cart/coupon/{code}                    # Aplicar cupón
DELETE /api/v1/cart/coupon                           # Quitar cupón

# Checkout
POST   /api/v1/checkout/start                        # Iniciar checkout
PUT    /api/v1/checkout/address                      # Dirección de envío
GET    /api/v1/checkout/shipping-options              # Opciones de envío
POST   /api/v1/checkout/pay                          # Procesar pago

# Customers (CRM)
GET    /api/v1/customers
POST   /api/v1/customers
GET    /api/v1/customers/{id}
PUT    /api/v1/customers/{id}
DELETE /api/v1/customers/{id}
GET    /api/v1/customers/{id}/orders
GET    /api/v1/customers/{id}/addresses
POST   /api/v1/customers/{id}/addresses
GET    /api/v1/segments
POST   /api/v1/segments/{id}/assign

# Purchases
GET    /api/v1/purchases
POST   /api/v1/purchases
GET    /api/v1/purchases/{id}
PUT    /api/v1/purchases/{id}
POST   /api/v1/purchases/{id}/receive
POST   /api/v1/purchases/{id}/cancel
GET    /api/v1/suppliers
POST   /api/v1/suppliers
GET    /api/v1/suppliers/{id}
PUT    /api/v1/suppliers/{id}

# Finances
GET    /api/v1/cash-registers
POST   /api/v1/cash-registers/open
POST   /api/v1/cash-registers/{id}/close
GET    /api/v1/cash-registers/{id}/movements
POST   /api/v1/cash-registers/{id}/income            # Registrar ingreso
POST   /api/v1/cash-registers/{id}/expense           # Registrar egreso
GET    /api/v1/transactions
GET    /api/v1/invoices
POST   /api/v1/invoices/generate
GET    /api/v1/reports/profitability
GET    /api/v1/reports/profitability/by-sku/{sku}

# Marketing
GET    /api/v1/coupons
POST   /api/v1/coupons
PUT    /api/v1/coupons/{code}
DELETE /api/v1/coupons/{code}
POST   /api/v1/coupons/{code}/validate               # Validar cupón
GET    /api/v1/campaigns
POST   /api/v1/campaigns

# CMS
GET    /api/v1/pages
POST   /api/v1/pages
GET    /api/v1/pages/{slug}
PUT    /api/v1/pages/{id}
DELETE /api/v1/pages/{id}

# Configuration
GET    /api/v1/config
PUT    /api/v1/config
GET    /api/v1/taxes
POST   /api/v1/taxes
PUT    /api/v1/taxes/{id}
GET    /api/v1/payment-methods
PUT    /api/v1/payment-methods/{id}
GET    /api/v1/shipping-methods
PUT    /api/v1/shipping-methods/{id}

# Users & Roles
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
PATCH  /api/v1/users/{id}/deactivate
GET    /api/v1/roles
POST   /api/v1/roles
PUT    /api/v1/roles/{id}
DELETE /api/v1/roles/{id}
GET    /api/v1/roles/{id}/permissions
PUT    /api/v1/roles/{id}/permissions
GET    /api/v1/permissions

# Integrations
GET    /api/v1/integrations
POST   /api/v1/integrations
PUT    /api/v1/integrations/{id}
DELETE /api/v1/integrations/{id}
GET    /api/v1/webhooks
POST   /api/v1/webhooks
PUT    /api/v1/webhooks/{id}
DELETE /api/v1/webhooks/{id}

# System
GET    /api/v1/system/health
GET    /api/v1/system/info
```

---

## 3. Convención de Respuestas

### Envelope de Respuesta

```typescript
// Éxito (lista)
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "perPage": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}

// Éxito (single)
{
  "success": true,
  "data": {
    "sku": "ELE-SAM-WIRE-001",
    "name": "Wireless Mouse",
    "price": 25.99,
    ...
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}

// Éxito (creación - 201 Created)
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}
```

---

## 4. Convención de Errores

```typescript
// Error de validación (400)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación en los datos enviados",
    "details": {
      "sku": ["El SKU es requerido"],
      "price": ["El precio debe ser mayor a 0"]
    }
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}

// Error de negocio (409 Conflict)
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SKU",
    "message": "El SKU ELE-SAM-WIRE-001 ya existe",
    "details": {
      "sku": "ELE-SAM-WIRE-001",
      "existingProductId": "prod_clx..."
    }
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}

// Error de autenticación (401)
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token expirado o inválido",
    "details": null
  },
  "timestamp": "2026-07-29T10:30:00Z",
  "requestId": "req_xyz789"
}
```

### Códigos de Error por Categoría

| Rango HTTP | Código de Error | Significado |
|-----------|----------------|-------------|
| **400** | `VALIDATION_ERROR` | Datos inválidos |
| **400** | `INVALID_SKU_FORMAT` | SKU no cumple formato |
| **400** | `INVALID_STATUS_TRANSITION` | Cambio de estado no permitido |
| **401** | `UNAUTHORIZED` | No autenticado |
| **401** | `TOKEN_EXPIRED` | Token expirado |
| **401** | `INVALID_TOKEN` | Token inválido |
| **403** | `FORBIDDEN` | No tiene permiso |
| **403** | `INSUFFICIENT_PERMISSIONS` | Permiso específico faltante |
| **404** | `NOT_FOUND` | Recurso no existe |
| **404** | `PRODUCT_NOT_FOUND` | Producto no encontrado |
| **404** | `SKU_NOT_FOUND` | SKU no encontrado |
| **409** | `DUPLICATE_SKU` | SKU duplicado |
| **409** | `INSUFFICIENT_STOCK` | Stock insuficiente |
| **409** | `ORDER_CANNOT_BE_CANCELLED` | Orden no cancelable |
| **422** | `BUSINESS_RULE_VIOLATION` | Regla de negocio violada |
| **429** | `RATE_LIMIT_EXCEEDED` | Demasiadas requests |
| **500** | `INTERNAL_ERROR` | Error interno |

---

## 5. Paginación

### Request

```
GET /api/v1/products?page=1&per_page=20&sort_by=created_at&sort_order=desc
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "perPage": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Parámetros

| Parámetro | Default | Máximo | Descripción |
|-----------|---------|--------|-------------|
| `page` | 1 | - | Número de página |
| `per_page` | 20 | 100 | Items por página |
| `sort_by` | `created_at` | - | Campo de ordenamiento |
| `sort_order` | `desc` | - | `asc` o `desc` |

---

## 6. Filtros y Búsqueda

### Filtros por campo

```
GET /api/v1/products?status=ACTIVE&category_id=cat_123&price_min=10&price_max=100
GET /api/v1/orders?status=CONFIRMED,PREPARING&created_from=2026-01-01&created_to=2026-07-29
GET /api/v1/customers?search=john&tier=GOLD,PLATINUM&has_purchases=true
```

### Convención de filtros

| Patrón | Ejemplo | Descripción |
|--------|---------|-------------|
| `{campo}` | `?status=ACTIVE` | Igualdad |
| `{campo}_min` | `?price_min=10` | Mayor o igual |
| `{campo}_max` | `?price_max=100` | Menor o igual |
| `{campo}_from` | `?created_from=2026-01-01` | Fecha desde |
| `{campo}_to` | `?created_to=2026-07-29` | Fecha hasta |
| `{campo}` (comma) | `?status=CONFIRMED,PREPARING` | IN list |
| `search` | `?search=wireless` | Búsqueda textual |
| `{campo}_null` | `?category_null=true` | IS NULL |

---

## 7. Headers de Request

| Header | Propósito | Obligatorio |
|--------|-----------|-------------|
| `Authorization: Bearer {token}` | Autenticación JWT | Sí (rutas protegidas) |
| `X-Tenant-Slug` | Slug del tenant | Sí (multi-tenant) |
| `Content-Type: application/json` | Formato del body | Sí (POST/PUT/PATCH) |
| `Accept-Language` | Idioma (es, en) | Opcional (i18n) |
| `Idempotency-Key` | Idempotencia para pagos | Opcional (checkout) |

---

## 8. Idempotencia

```typescript
// POST /api/v1/checkout/pay
// Header: Idempotency-Key: uuid-unico

// Si se recibe la misma key dentro de 24h:
//   → Devolver el resultado original (201 o error)
//   → No procesar nuevamente

// Almacén: Redis con TTL 24h
// Key: idempotency:{tenant}:{key}
// Value: { statusCode, body }
```

---

## 9. Webhooks (para integraciones)

```typescript
// POST /api/v1/webhooks
// Registrar un webhook para recibir eventos

POST /api/v1/webhooks
{
  "url": "https://midominio.com/webhook",
  "events": ["order.confirmed", "order.shipped"],
  "secret": "whsec_..."  // Firmado
}

// Evento enviado al webhook:
POST https://midominio.com/webhook
Headers:
  X-Webhook-Signature: sha256=...
  X-Webhook-Event: order.confirmed
  Content-Type: application/json

Body:
{
  "event": "order.confirmed",
  "tenantId": "tenant_abc",
  "data": {
    "orderId": "ord_123",
    "number": "ORD-0001",
    "total": 150.00,
    "sku": "ELE-SAM-WIRE-001",
    "status": "CONFIRMED"
  },
  "timestamp": "2026-07-29T10:30:00Z"
}
```
