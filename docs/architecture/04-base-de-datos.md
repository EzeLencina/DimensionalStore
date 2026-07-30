# MODELO CONCEPTUAL DE BASE DE DATOS

> PostgreSQL 16 · Prisma ORM · Multi-tenant por tenant_id + RLS · SKU como columna vertebral

---

## 1. Diagrama de Entidades (Relaciones Principales)

```
TENANT ──────┬────── CONFIG
             │
             ├────── USER ──────┬── ROLE ──── PERMISSION
             │                  │
             │                  └── CUSTOMER ──── ADDRESS
             │                                ──── CUSTOMER_SEGMENT
             │
             ├────── PRODUCT ────── VARIANT
             │         │           ──── CATEGORY (N:N via ProductCategory)
             │         │           ──── BRAND
             │         │
             │         ├────── STOCK (por sucursal)
             │         ├────── INVENTORY_MOVEMENT
             │         └────── SUPPLIER (N:N via ProductSupplier)
             │
             ├────── PURCHASE_ORDER ── PURCHASE_LINE ── PRODUCT (SKU)
             │
             ├────── ORDER ── ORDER_LINE ── PRODUCT (SKU)
             │    │            └─── VARIANT (SKU)
             │    ├── SHIPMENT
             │    └── PAYMENT
             │
             ├────── CASH_REGISTER ── TRANSACTION
             │                └─── CASH_MOVEMENT (ingreso/egreso)
             │
             ├────── INVOICE
             │
             ├────── COUPON
             │    └── CAMPAIGN
             │
             ├────── PAGE (CMS)
             │    └── SECTION
             │
             ├────── AUDIT_LOG
             └────── FILE
```

---

## 2. Entidades Principales (Modelo Conceptual)

### Base (todo tenant)

```
TENANT
  id              String (PK)
  slug            String (unique)       // Subdominio: midominio
  name            String
  plan            Enum (FREE, PRO, ENTERPRISE)
  settings        Json                  // Configuración genérica del tenant
  isActive        Boolean
  createdAt       DateTime
  updatedAt       DateTime
```

### Auth y Usuarios

```
USER
  id              String (PK)
  tenantId        String (FK → TENANT)
  email           String (unique)
  passwordHash    String
  name            String
  isActive        Boolean
  mustChangePassword Boolean
  lastLoginAt     DateTime?
  createdAt       DateTime
  updatedAt       DateTime

ROLE
  id              String (PK)
  tenantId        String (FK → TENANT)
  name            String                // "admin", "vendedor", "custom_role"
  description     String?
  isSystem        Boolean               // Roles del sistema no se borran
  createdAt       DateTime

PERMISSION
  id              String (PK)
  code            String (unique)       // "products.create", "orders.read"
  name            String
  module          String                // "catalog", "orders", "finances"
  description     String?

ROLE_PERMISSION
  roleId          String (FK → ROLE)
  permissionId    String (FK → PERMISSION)

USER_ROLE
  userId          String (FK → USER)
  roleId          String (FK → ROLE)
  tenantId        String (FK → TENANT)
```

### Catálogo

```
PRODUCT
  id              String (PK)
  tenantId        String (FK → TENANT)
  sku             String                // SKU único por tenant
  name            String
  slug            String
  description     String?
  price           Decimal
  comparePrice    Decimal?              // Precio antes del descuento
  costPrice       Decimal?              // Precio de costo (rentabilidad)
  weight          Decimal?
  status          Enum (ACTIVE, INACTIVE, DRAFT)
  categoryId      String? (FK → CATEGORY)
  brandId         String? (FK → BRAND)
  metadata        Json?                 // Atributos dinámicos
  sortOrder       Int
  createdAt       DateTime
  updatedAt       DateTime
  deletedAt       DateTime?

PRODUCT_VARIANT
  id              String (PK)
  tenantId        String (FK → TENANT)
  productId       String (FK → PRODUCT)
  sku             String                // SKU completo (ej: ELE-SAM-WIRE-001-RED)
  name            String                // "Rojo", "XL", etc.
  priceOverride   Decimal?
  stock           Int                   // Stock actual (desnormalizado)
  metadata        Json?
  sortOrder       Int
  createdAt       DateTime

CATEGORY
  id              String (PK)
  tenantId        String (FK → TENANT)
  name            String
  slug            String
  description     String?
  parentId        String? (FK → CATEGORY)
  imageUrl        String?
  sortOrder       Int
  isActive        Boolean

BRAND
  id              String (PK)
  tenantId        String (FK → TENANT)
  name            String
  slug            String
  description     String?
  logoUrl         String?
  isActive        Boolean

PRODUCT_IMAGE
  id              String (PK)
  tenantId        String
  productId       String (FK → PRODUCT)
  url             String
  alt             String?
  sortOrder       Int
  isPrimary       Boolean
```

### Inventario

```
STOCK
  id              String (PK)
  tenantId        String (FK → TENANT)
  sku             String                // SKU del producto o variante
  warehouseId     String? (FK → WAREHOUSE)
  quantity        Int                   // Stock disponible
  reservedQuantity Int                  // Stock reservado (carritos no expirados)
  minStock        Int                   // Stock mínimo (alerta)
  maxStock        Int?                  // Stock máximo
  createdAt       DateTime
  updatedAt       DateTime

WAREHOUSE
  id              String (PK)
  tenantId        String
  name            String                // "Depósito Central", "Sucursal Norte"
  code            String                // Código interno
  address         String?
  isActive        Boolean

INVENTORY_MOVEMENT
  id              String (PK)
  tenantId        String (FK → TENANT)
  sku             String                // SKU directo (no ID)
  type            Enum                  // ENTRY, EXIT, RESERVATION, RELEASE, ADJUSTMENT, TRANSFER
  quantity        Int
  referenceType   String?               // "order", "purchase", "adjustment"
  referenceId     String?               // ID de la orden o compra relacionada
  reason          String?
  warehouseId     String?
  userId          String
  createdAt       DateTime
```

### Ventas (Orders)

```
ORDER
  id              String (PK)
  tenantId        String (FK → TENANT)
  number          String                // Número de orden visible (ORD-0001)
  customerId      String? (FK → CUSTOMER)
  customerName    String
  customerEmail   String
  customerPhone   String?
  shippingAddress Json?
  status          Enum (PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
  subtotal        Decimal
  discountTotal   Decimal
  shippingCost    Decimal
  taxTotal        Decimal
  total           Decimal
  currency        String                // "ARS", "USD"
  notes           String?
  couponId        String? (FK → COUPON)
  createdAt       DateTime
  updatedAt       DateTime

ORDER_LINE
  id              String (PK)
  tenantId        String
  orderId         String (FK → ORDER)
  sku             String                // SKU directo
  productName     String                // Snapshot del nombre al momento de la venta
  variantName     String?
  quantity        Int
  unitPrice       Decimal
  discountAmount  Decimal
  totalPrice      Decimal
  costPrice       Decimal?              // Para rentabilidad

SHIPMENT
  id              String (PK)
  tenantId        String
  orderId         String (FK → ORDER)
  carrier         String                // "CORREO_ARG", "ANDREANI", etc.
  trackingNumber  String?
  status          Enum
  estimatedDate   DateTime?
  deliveredAt     DateTime?
  address         Json
  createdAt       DateTime

PAYMENT
  id              String (PK)
  tenantId        String
  orderId         String (FK → ORDER)
  method          String                // "mercadopago", "stripe", "transfer"
  status          Enum (PENDING, APPROVED, REJECTED, REFUNDED)
  externalId      String?               // ID en el gateway
  amount          Decimal
  fee             Decimal?              // Comisión del gateway
  netAmount       Decimal?              // Amount - fee
  metadata        Json?
  paidAt          DateTime?
  createdAt       DateTime
```

### Compras

```
PURCHASE_ORDER
  id              String (PK)
  tenantId        String
  number          String                // OC-0001
  supplierId      String (FK → SUPPLIER)
  status          Enum (DRAFT, SENT, RECEIVED, CANCELLED)
  expectedDate    DateTime?
  receivedAt      DateTime?
  subtotal        Decimal
  taxTotal        Decimal
  total           Decimal
  notes           String?
  userId          String
  createdAt       DateTime

PURCHASE_LINE
  id              String (PK)
  tenantId        String
  purchaseOrderId String (FK → PURCHASE_ORDER)
  sku             String
  productName     String
  quantity        Int
  receivedQuantity Int
  unitCost        Decimal
  totalCost       Decimal

SUPPLIER
  id              String (PK)
  tenantId        String
  code            String
  businessName    String
  cuit            String?
  email           String?
  phone           String?
  address         String?
  paymentTerms    String?
  isActive        Boolean
  createdAt       DateTime
```

### CRM

```
CUSTOMER
  id              String (PK)
  tenantId        String
  email           String
  name            String
  phone           String?
  documentNumber  String?
  birthDate       DateTime?
  tier            Enum (REGULAR, SILVER, GOLD, PLATINUM)
  totalPurchases  Decimal               // Desnormalizado
  totalOrders     Int
  lastPurchaseAt  DateTime?
  notes           String?
  metadata        Json?
  createdAt       DateTime
  updatedAt       DateTime

CUSTOMER_ADDRESS
  id              String (PK)
  tenantId        String
  customerId      String (FK → CUSTOMER)
  type            Enum (SHIPPING, BILLING, BOTH)
  street          String
  number          String
  complement      String?
  city            String
  province        String
  zipCode         String
  country         String
  isDefault       Boolean

CUSTOMER_SEGMENT
  id              String (PK)
  tenantId        String
  name            String
  rules           Json                  // Reglas de segmentación
  customerCount   Int                   // Cache
```

### Finanzas

```
CASH_REGISTER
  id              String (PK)
  tenantId        String
  name            String
  balance         Decimal
  isOpen          Boolean
  openedAt        DateTime?
  closedAt        DateTime?
  openedBy        String?
  closedBy        String?

TRANSACTION
  id              String (PK)
  tenantId        String
  cashRegisterId  String (FK → CASH_REGISTER)
  type            Enum (SALE, EXPENSE, TRANSFER, REFUND, ADJUSTMENT)
  amount          Decimal
  sku             String?               // SKU si es venta de producto
  referenceType   String?               // "order", "purchase", "expense"
  referenceId     String?
  description     String
  paymentMethod   String?
  userId          String
  createdAt       DateTime

INVOICE
  id              String (PK)
  tenantId        String
  orderId         String? (FK → ORDER)
  number          String
  type            Enum (A, B, C, E)     // Tipo de factura (AFIP)
  cuit            String
  companyName     String
  grossAmount     Decimal
  taxAmount       Decimal
  total           Decimal
  cae             String?               // CAE de AFIP
  caeDueDate      DateTime?
  metadata        Json?
  createdAt       DateTime
```

### Marketing

```
COUPON
  id              String (PK)
  tenantId        String
  code            String
  type            Enum (PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING)
  value           Decimal
  minPurchase     Decimal?
  maxUsage        Int?
  currentUsage    Int
  startsAt        DateTime
  endsAt          DateTime
  isActive        Boolean
  createdAt       DateTime

CAMPAIGN
  id              String (PK)
  tenantId        String
  name            String
  type            Enum (EMAIL, SOCIAL, LANDING)
  status          Enum (DRAFT, ACTIVE, PAUSED, FINISHED)
  startsAt        DateTime
  endsAt          DateTime?
  budget          Decimal?
  metadata        Json?
```

### CMS

```
PAGE
  id              String (PK)
  tenantId        String
  title           String
  slug            String
  metaTitle       String?
  metaDescription String?
  isHomepage      Boolean
  status          Enum (DRAFT, PUBLISHED)
  createdAt       DateTime
  updatedAt       DateTime

SECTION
  id              String (PK)
  tenantId        String
  pageId          String (FK → PAGE)
  type            String                // "hero", "featured_products", "banner", "text"
  config          Json                  // Config del bloque
  sortOrder       Int
```

### Auditoría y Archivos

```
AUDIT_LOG
  id              String (PK)
  tenantId        String
  userId          String?
  action          String                // "PRODUCT.CREATED", "ORDER.STATUS_CHANGED"
  entityType      String                // "product", "order"
  entityId        String
  oldValue        Json?
  newValue        Json?
  metadata        Json?
  ipAddress       String?
  userAgent       String?
  createdAt       DateTime

FILE
  id              String (PK)
  tenantId        String
  originalName    String
  mimeType        String
  size            Int
  url             String                // URL en R2/S3
  key             String                // Key en el bucket
  alt             String?
  entityType      String?               // "product", "category", "brand"
  entityId        String?
  createdAt       DateTime
```

---

## 3. Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Tablas** | snake_case, plural | `products`, `inventory_movements` |
| **Columnas** | camelCase (Prisma) | `tenantId`, `createdAt` |
| **PK** | `id` tipo String (cuid) | `clx...` |
| **FK** | `{tabla}Id` | `productId`, `categoryId` |
| **Timestamps** | `createdAt`, `updatedAt`, `deletedAt` | |
| **SKU** | String, único por tenant | `ELE-SAM-WIRE-001` |
| **Enums** | UPPER_SNAKE_CASE | `ACTIVE`, `PENDING_PAYMENT` |
| **JSON** | `Json` (Prisma) para datos dinámicos | `metadata`, `settings` |

---

## 4. Indexación Estratégica

```sql
-- Multi-tenant: toda consulta incluye tenant_id
CREATE INDEX idx_products_tenant_sku ON products (tenant_id, sku);
CREATE INDEX idx_products_tenant_status ON products (tenant_id, status, created_at DESC);
CREATE INDEX idx_products_tenant_category ON products (tenant_id, category_id);
CREATE INDEX idx_products_search ON products
  USING GIN (to_tsvector('spanish', name || ' ' || COALESCE(description, '')));

-- Órdenes
CREATE INDEX idx_orders_tenant_number ON orders (tenant_id, number);
CREATE INDEX idx_orders_tenant_customer ON orders (tenant_id, customer_id);
CREATE INDEX idx_orders_tenant_status ON orders (tenant_id, status, created_at DESC);
CREATE INDEX idx_orders_tenant_created ON orders (tenant_id, created_at DESC);
CREATE INDEX idx_order_lines_sku ON order_lines (tenant_id, sku);  -- Reportes por SKU

-- Inventario
CREATE INDEX idx_stock_tenant_sku ON stock (tenant_id, sku);
CREATE INDEX idx_movements_tenant_sku ON inventory_movements (tenant_id, sku, created_at DESC);
CREATE INDEX idx_movements_tenant_type ON inventory_movements (tenant_id, type, created_at DESC);

-- CRM
CREATE INDEX idx_customers_tenant_email ON customers (tenant_id, email);
CREATE INDEX idx_customers_tenant_tier ON customers (tenant_id, tier);

-- Auditoría
CREATE INDEX idx_audit_tenant_entity ON audit_logs (tenant_id, entity_type, entity_id);
CREATE INDEX idx_audit_tenant_action ON audit_logs (tenant_id, action, created_at DESC);
```

---

## 5. Vistas Materializadas para Reportes

```sql
-- Ventas diarias por SKU
CREATE MATERIALIZED VIEW mv_daily_sales_by_sku AS
SELECT
  ol.tenant_id,
  ol.sku,
  DATE(o.created_at) AS sale_date,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(ol.quantity) AS total_units,
  SUM(ol.total_price) AS total_revenue,
  SUM(ol.total_price - (ol.quantity * COALESCE(ol.cost_price, 0))) AS total_profit
FROM order_lines ol
JOIN orders o ON o.id = ol.order_id
WHERE o.status NOT IN ('CANCELLED', 'REFUNDED')
GROUP BY ol.tenant_id, ol.sku, DATE(o.created_at);

-- Refresh: cron job via BullMQ (cada 1h en horario laboral)
CREATE INDEX idx_mv_daily_sales ON mv_daily_sales_by_sku (tenant_id, sale_date DESC, sku);
```

---

## 6. Particionamiento (Futuro — Escalamiento)

```sql
-- Particionar tablas grandes por tenant_id (cuando se superen 50+ GB)
CREATE TABLE inventory_movements (
  id UUID,
  tenant_id TEXT,  -- Partition key
  sku TEXT,
  ...
) PARTITION BY LIST (tenant_id);

-- Cada tenant grande obtiene su partición
CREATE TABLE inventory_movements_tenant_a PARTITION OF inventory_movements
  FOR VALUES IN ('tenant_a');
```

---

## 7. Row-Level Security (RLS)

```sql
-- Habilitar RLS en tablas multi-tenant
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

-- Política de aislamiento
CREATE POLICY tenant_isolation ON products
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::TEXT);

-- Política para admins (pueden ver todos los tenants)
CREATE POLICY admin_all_tenants ON products
  FOR SELECT
  USING (current_setting('app.role')::TEXT = 'admin');
```
