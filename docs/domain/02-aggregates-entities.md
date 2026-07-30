# AGGREGATE ROOTS, ENTIDADES Y VALUE OBJECTS

> Definición completa del modelo de dominio. Cada Aggregate es una transacción atómica.

---

## 1. Aggregate Roots

| Aggregate Root | Bounded Context | Entidades Hijas | Invariante de Transacción |
|---------------|-----------------|----------------|--------------------------|
| **Tenant** | Configuration | Sucursal | Datos de la empresa inquilina |
| **User** | Identity | — | Email único por tenant |
| **Role** | Identity | RolePermission | Nombre único por tenant |
| **Product** | Catalog | ProductVariant, ProductImage, ProductCategory, ProductPrice, ProductSupplier | SKU único por tenant |
| **Category** | Catalog | — | Slug único por tenant |
| **Brand** | Catalog | — | Slug único por tenant |
| **Stock** | Inventory | — | SKU + sucursal único |
| **InventoryMovement** | Inventory | — | Nunca se modifica ni elimina |
| **StockAlert** | Inventory | — | SKU + sucursal único |
| **Order** | Sales | OrderLine, OrderPayment, OrderShipment, OrderHistory | Número de orden único |
| **Cart** | Sales | CartItem | Por token de sesión |
| **Quote** | Sales | QuoteLine | — |
| **Return** | Sales | ReturnLine | — |
| **PurchaseOrder** | Purchasing | PurchaseOrderLine | Número de OC único |
| **Supplier** | Suppliers | SupplierContact, SupplierPriceList | Código único por tenant |
| **Customer** | Customers | CustomerAddress | Email único por tenant |
| **CustomerSegment** | CRM | — | — |
| **CashRegister** | Cash | CashMovement | Una caja abierta por sucursal a la vez |
| **Transaction** | Finance | — | — |
| **Invoice** | Finance | InvoiceLine | Número fiscal único |
| **Tax** | Configuration | — | — |
| **PaymentMethod** | Configuration | — | — |
| **Coupon** | Marketing | — | Código único por tenant |
| **Campaign** | Marketing | — | — |
| **Page** | CMS | PageSection | Slug único por tenant |
| **Notification** | Notifications | — | — |
| **AuditLog** | Audit | — | Inmutable |
| **File** | Storage | — | — |
| **Webhook** | Integrations | WebhookEvent | — |

---

## 2. Lista Completa de Entidades

### 2.1 Identity Context

```
TENANT (Aggregate Root)
  Propósito: Representa una empresa inquilina en el sistema multi-tenant.
  Camino a SaaS: Cada tenant tiene su propio slug, plan y configuración.

  Atributos:
    id: String (PK)
    slug: String (Unique)                          // Subdominio para acceso
    name: String
    legalName: String?                             // Razón social
    taxId: String?                                 // CUIT/RUT
    plan: Enum (FREE, STARTER, PRO, ENTERPRISE)
    status: Enum (ACTIVE, SUSPENDED, CANCELLED)
    settings: Json                                 // Config global del tenant
    locale: String (default: "es-AR")
    currency: String (default: "ARS")
    timezone: String (default: "America/Argentina/Buenos_Aires")
    logoUrl: String?
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
```

```
SUCURSAL (Entity — pertenece a Tenant)
  Propósito: Unidad operativa dentro de un tenant. Stock, caja y ventas por sucursal.

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    code: String                                  // Código interno
    name: String
    address: String?
    phone: String?
    email: String?
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, code]
```

```
USER (Aggregate Root)
  Propósito: Usuario del sistema (staff, admin, vendedor).

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    email: String (Unique por tenant)
    passwordHash: String
    name: String
    phone: String?
    isActive: Boolean
    mustChangePassword: Boolean
    lastLoginAt: DateTime?
    lastPasswordChangeAt: DateTime?
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, email]
```

```
ROLE (Aggregate Root)
  Propósito: Conjunto de permisos asignables a usuarios.

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    name: String                                  // "admin", "vendedor", etc.
    description: String?
    isSystem: Boolean                             // Roles del sistema: no se editan ni borran
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, name]
```

```
ROLE_PERMISSION (Entity — pertenece a Role)
  Propósito: Asignación de permiso a un rol.

  Atributos:
    id: String (PK)
    roleId: String (FK → Role)
    permissionId: String (FK → Permission)
    createdAt: DateTime

  Unique: [roleId, permissionId]
```

```
PERMISSION (Entity)
  Propósito: Catálogo de permisos disponibles en el sistema.

  Atributos:
    id: String (PK)
    code: String (Unique)                         // "catalog:create"
    name: String
    module: String                                // "catalog"
    description: String?
    createdAt: DateTime
```

```
USER_ROLE (Entity)
  Propósito: Asignación de rol a usuario.

  Atributos:
    id: String (PK)
    userId: String (FK → User)
    roleId: String (FK → Role)
    sucursalId: String? (FK → Sucursal)           // Opcional: rol por sucursal
    createdAt: DateTime

  Unique: [userId, roleId]
```

### 2.2 Catalog Context

```
CATEGORY (Aggregate Root)
  Propósito: Agrupación jerárquica de productos. Auto-referenciada para subcategorías.

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    name: String
    slug: String (Unique por tenant)
    description: String?
    parentId: String? (FK → Category)             // Auto-referencia jerárquica
    imageUrl: String?
    sortOrder: Int
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, slug]
  Restricción: parentId != id (no auto-parentesco)
```

```
BRAND (Aggregate Root)
  Propósito: Marca o fabricante del producto.

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    name: String
    slug: String (Unique por tenant)
    description: String?
    logoUrl: String?
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, slug]
```

```
PRODUCT (Aggregate Root — CENTRAL)
  Propósito: Bien tangible identificado por SKU. Es la entidad central del sistema.

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    sku: String                                   // SKU del producto base (sin variante)
    barcode: String?                              // Código de barras
    name: String
    slug: String
    description: String?
    shortDescription: String?
    categoryId: String? (FK → Category)
    brandId: String? (FK → Brand)
    basePrice: Decimal                            // Precio base (sin variante)
    costPrice: Decimal?                           // Último costo conocido
    weight: Decimal?
    weightUnit: Enum (KG, G, LB)
    isActive: Boolean
    status: Enum (DRAFT, ACTIVE, INACTIVE, DISCONTINUED)
    type: Enum (SIMPLE, VARIANTEABLE, SERVICE)    // Tipo de producto
    seoTitle: String?
    seoDescription: String?
    metadata: Json?                               // Atributos dinámicos EAV
    sortOrder: Int
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, sku]
  Unique: [tenantId, slug]
  Unique: [tenantId, barcode]                     // Si tiene código de barras
```

```
PRODUCT_VARIANT (Entity)
  Propósito: Variante específica de un producto (talle, color, material).

  Atributos:
    id: String (PK)
    tenantId: String (FK → Tenant)
    productId: String (FK → Product)
    sku: String                                   // SKU completo padre + variante
    barcode: String?
    name: String                                  // "Rojo", "XL", "32GB"
    priceOverride: Decimal?                       // Si tiene precio distinto al base
    costPrice: Decimal?
    weight: Decimal?
    isActive: Boolean
    sortOrder: Int
    metadata: Json?
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, sku]
  Unique: [tenantId, barcode]
```

```
PRODUCT_IMAGE (Entity)
  Propósito: Imágenes asociadas a un producto o variante.

  Atributos:
    id: String (PK)
    tenantId: String
    productId: String (FK → Product)
    variantId: String? (FK → ProductVariant)
    url: String
    alt: String?
    sortOrder: Int
    isPrimary: Boolean                            // Imagen principal
    createdAt: DateTime

  Unique: [productId, url]
```

```
PRODUCT_CATEGORY (Entity)
  Propósito: Relación N:N entre producto y categoría (un producto puede estar en N categorías).

  Atributos:
    id: String (PK)
    productId: String (FK → Product)
    categoryId: String (FK → Category)
    isPrimary: Boolean                            // Categoría principal
    createdAt: DateTime

  Unique: [productId, categoryId]
```

```
PRODUCT_PRICE (Entity)
  Propósito: Histórico de precios. Permite auditoría de cambios de precio.

  Atributos:
    id: String (PK)
    tenantId: String
    productId: String (FK → Product)
    variantId: String? (FK → ProductVariant)
    oldPrice: Decimal
    newPrice: Decimal
    changedBy: String (FK → User)
    reason: String?
    createdAt: DateTime                           // Inmutable
```

```
PRODUCT_SUPPLIER (Entity)
  Propósito: Relación producto-proveedor con precio de costo y lead time.

  Atributos:
    id: String (PK)
    tenantId: String
    productId: String (FK → Product)
    supplierId: String (FK → Supplier)
    supplierSku: String?                          // SKU del proveedor
    costPrice: Decimal
    leadTimeDays: Int?
    isPreferred: Boolean                          // Proveedor preferido
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [productId, supplierId]
```

### 2.3 Inventory Context

```
STOCK (Aggregate Root)
  Propósito: Stock disponible, reservado y configuraciones por SKU y sucursal.

  Atributos:
    id: String (PK)
    tenantId: String
    sku: String                                   // SKU directo (no ID)
    sucursalId: String (FK → Sucursal)
    quantity: Int                                 // Stock disponible
    reservedQuantity: Int                         // Stock reservado (carritos activos)
    minStock: Int (default: 0)                    // Mínimo deseable
    maxStock: Int?                                // Máximo deseable
    location: String?                             // Ubicación física (ej: "A-12-3")
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, sku, sucursalId]
  Restricción: quantity >= 0, reservedQuantity >= 0
  Restricción: reservedQuantity <= quantity
```

```
WAREHOUSE (Entity)
  Propósito: Almacén o depósito físico.

  Atributos:
    id: String (PK)
    tenantId: String
    sucursalId: String (FK → Sucursal)
    code: String
    name: String
    address: String?
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
```

```
INVENTORY_MOVEMENT (Aggregate Root — INMUTABLE)
  Propósito: Registro atómico de entrada o salida de stock. NUNCA se modifica ni elimina.

  Atributos:
    id: String (PK)
    tenantId: String
    sku: String                                   // SKU directo
    sucursalId: String (FK → Sucursal)
    type: Enum (ENTRY, EXIT, RESERVATION, RELEASE, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT)
    quantity: Int                                 // Positiva para entradas, negativa para salidas
    stockBefore: Int                              // Stock antes del movimiento
    stockAfter: Int                               // Stock después del movimiento
    referenceType: String                         // "order", "purchase", "adjustment", "return", "transfer"
    referenceId: String                           // ID del documento origen
    reason: String?
    userId: String (FK → User)
    createdAt: DateTime                           // INMUTABLE

  Restricción: quantity != 0
  Restricción: stockAfter = stockBefore + quantity
```

```
STOCK_ALERT (Aggregate Root)
  Propósito: Configuración de alerta de stock bajo para un SKU en una sucursal.

  Atributos:
    id: String (PK)
    tenantId: String
    sku: String
    sucursalId: String (FK → Sucursal)
    minThreshold: Int
    maxThreshold: Int?
    isActive: Boolean
    lastTriggeredAt: DateTime?
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, sku, sucursalId]
```

### 2.4 Sales Context

```
ORDER (Aggregate Root — CRÍTICO)
  Propósito: Pedido de compra realizado por un cliente. Maneja su ciclo de vida completo.

  Atributos:
    id: String (PK)
    tenantId: String
    sucursalId: String (FK → Sucursal)
    number: String                                // Número visible (ORD-000001)
    customerId: String? (FK → Customer)
    customerName: String                          // Snapshot
    customerEmail: String                         // Snapshot
    customerPhone: String?
    customerTaxId: String?
    shippingAddressId: String? (FK → CustomerAddress)
    billingAddressId: String? (FK → CustomerAddress)
    status: Enum (PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED, REFUNDED)
    subtotal: Decimal
    discountTotal: Decimal
    shippingCost: Decimal
    taxTotal: Decimal
    total: Decimal
    currency: String
    notes: String?
    couponId: String? (FK → Coupon)
    trackingNumber: String?
    carrier: String?
    estimatedDeliveryDate: DateTime?
    deliveredAt: DateTime?
    cancelledAt: DateTime?
    cancelReason: String?
    userId: String (FK → User)
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Solo en casos extremos

  Unique: [tenantId, number]
  Restricción: total = subtotal - discountTotal + shippingCost + taxTotal
  Restricción: discountTotal <= subtotal
```

```
ORDER_LINE (Entity)
  Propósito: Línea individual de producto dentro de una orden.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String (FK → Order)
    sku: String                                   // SKU directo (nunca cambia)
    productName: String                           // Snapshot del nombre al momento de la venta
    variantName: String?
    quantity: Int
    unitPrice: Decimal                            // Precio unitario al momento de la venta
    discountAmount: Decimal
    costPrice: Decimal?                           // Costo al momento de la venta (para rentabilidad)
    totalPrice: Decimal
    createdAt: DateTime

  Restricción: quantity > 0
  Restricción: totalPrice = (unitPrice * quantity) - discountAmount
```

```
ORDER_PAYMENT (Entity)
  Propósito: Pagos asociados a una orden.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String (FK → Order)
    paymentMethodId: String (FK → PaymentMethod)
    status: Enum (PENDING, APPROVED, REJECTED, REFUNDED)
    amount: Decimal
    gateway: String?                              // "mercadopago", "stripe"
    gatewayTransactionId: String?
    gatewayStatus: String?
    fee: Decimal?
    netAmount: Decimal?
    paidAt: DateTime?
    createdAt: DateTime

  Restricción: amount > 0
```

```
ORDER_SHIPMENT (Entity)
  Propósito: Envío asociado a una orden.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String (FK → Order)
    carrier: String
    trackingNumber: String?
    status: Enum (PENDING, PICKED_UP, IN_TRANSIT, DELIVERED, FAILED)
    shippingCost: Decimal
    estimatedDate: DateTime?
    deliveredAt: DateTime?
    address: Json
    createdAt: DateTime
    updatedAt: DateTime
```

```
ORDER_HISTORY (Entity)
  Propósito: Trazabilidad de cambios de estado de la orden.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String (FK → Order)
    fromStatus: Enum?                             // Null si es el primer estado
    toStatus: Enum
    changedBy: String (FK → User)
    reason: String?
    createdAt: DateTime                           // Inmutable
```

```
CART (Aggregate Root)
  Propósito: Carrito de compras temporal. Vive en Redis + DB para persistencia.

  Atributos:
    id: String (PK)
    tenantId: String
    token: String                                 // UUID token para carritos anónimos
    userId: String? (FK → User)                   // Null si es anónimo
    couponId: String? (FK → Coupon)
    expiresAt: DateTime
    createdAt: DateTime
    updatedAt: DateTime
```

```
CART_ITEM (Entity)
  Propósito: Item dentro del carrito.

  Atributos:
    id: String (PK)
    cartId: String (FK → Cart)
    sku: String
    quantity: Int
    unitPrice: Decimal
    createdAt: DateTime
    updatedAt: DateTime
```

```
QUOTE (Aggregate Root)
  Propósito: Presupuesto o cotización (sin compromiso de compra).

  Atributos:
    id: String (PK)
    tenantId: String
    number: String
    customerId: String? (FK → Customer)
    customerName: String
    customerEmail: String
    status: Enum (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)
    subtotal: Decimal
    discountTotal: Decimal
    taxTotal: Decimal
    total: Decimal
    validUntil: DateTime
    notes: String?
    userId: String (FK → User)
    createdAt: DateTime
    updatedAt: DateTime
```

```
QUOTE_LINE (Entity)
  Propósito: Item dentro del presupuesto.

  Atributos: similar a OrderLine
```

```
RETURN (Aggregate Root)
  Propósito: Devolución parcial o total de una venta.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String (FK → Order)
    number: String
    type: Enum (FULL, PARTIAL)
    status: Enum (PENDING, APPROVED, REJECTED, COMPLETED)
    reason: String
    total: Decimal
    userId: String (FK → User)
    createdAt: DateTime
    updatedAt: DateTime
```

```
RETURN_LINE (Entity)
  Propósito: Línea de devolución.

  Atributos:
    id: String (PK)
    returnId: String (FK → Return)
    orderLineId: String (FK → OrderLine)
    sku: String
    quantity: Int
    unitPrice: Decimal
    total: Decimal
    condition: Enum (GOOD, DAMAGED, DEFECTIVE)
    createdAt: DateTime
```

### 2.5 Purchasing Context

```
PURCHASE_ORDER (Aggregate Root)
  Propósito: Orden de compra a un proveedor.

  Atributos:
    id: String (PK)
    tenantId: String
    number: String                                // OC-000001
    supplierId: String (FK → Supplier)
    sucursalId: String (FK → Sucursal)
    status: Enum (DRAFT, SENT, PARTIALLY_RECEIVED, RECEIVED, CANCELLED)
    expectedDate: DateTime?
    receivedAt: DateTime?
    subtotal: Decimal
    taxTotal: Decimal
    shippingCost: Decimal
    total: Decimal
    notes: String?
    userId: String (FK → User)
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, number]
```

```
PURCHASE_ORDER_LINE (Entity)
  Propósito: Línea de una orden de compra.

  Atributos:
    id: String (PK)
    tenantId: String
    purchaseOrderId: String (FK → PurchaseOrder)
    sku: String
    productName: String
    quantity: Int
    receivedQuantity: Int
    unitCost: Decimal
    totalCost: Decimal
    createdAt: DateTime

  Restricción: receivedQuantity <= quantity
```

### 2.6 Customers Context

```
CUSTOMER (Aggregate Root)
  Propósito: Cliente de la empresa. Puede comprar en el ecommerce o ser registrado por admin.

  Atributos:
    id: String (PK)
    tenantId: String
    email: String
    name: String
    phone: String?
    documentType: Enum? (DNI, CUIT, PASSPORT)
    documentNumber: String?
    birthDate: DateTime?
    gender: String?
    status: Enum (ACTIVE, INACTIVE, BLOCKED)
    tier: Enum (REGULAR, SILVER, GOLD, PLATINUM) // Segmento RFM
    totalPurchases: Decimal                       // Desnormalizado
    totalOrders: Int                              // Desnormalizado
    lastPurchaseAt: DateTime?
    source: String?                               // "ecommerce", "admin", "import"
    notes: String?
    metadata: Json?
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, email]
```

```
CUSTOMER_ADDRESS (Entity)
  Propósito: Dirección de un cliente.

  Atributos:
    id: String (PK)
    tenantId: String
    customerId: String (FK → Customer)
    type: Enum (SHIPPING, BILLING, BOTH)
    name: String                                  // "Casa", "Trabajo"
    street: String
    number: String
    complement: String?
    city: String
    province: String
    zipCode: String
    country: String
    lat: Decimal?                                 // Geolocalización
    lng: Decimal?
    isDefault: Boolean
    createdAt: DateTime
    updatedAt: DateTime
```

### 2.7 Suppliers Context

```
SUPPLIER (Aggregate Root)
  Propósito: Proveedor de productos.

  Atributos:
    id: String (PK)
    tenantId: String
    code: String                                  // Código interno
    businessName: String
    taxId: String?                                // CUIT/RUT
    email: String?
    phone: String?
    address: String?
    paymentTerms: String?
    notes: String?
    status: Enum (ACTIVE, INACTIVE, BLOCKED)
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, code]
```

```
SUPPLIER_CONTACT (Entity)
  Propósito: Persona de contacto en el proveedor.

  Atributos:
    id: String (PK)
    supplierId: String (FK → Supplier)
    name: String
    position: String?
    email: String?
    phone: String?
    isPrimary: Boolean
    createdAt: DateTime
```

```
SUPPLIER_PRICE_LIST (Entity)
  Propósito: Lista de precios de un proveedor (vigencia).

  Atributos:
    id: String (PK)
    tenantId: String
    supplierId: String (FK → Supplier)
    name: String                                  // "Lista junio 2026"
    validFrom: DateTime
    validUntil: DateTime?
    isActive: Boolean
    createdAt: DateTime
```

### 2.8 Finance Context

```
TRANSACTION (Aggregate Root)
  Propósito: Movimiento financiero del libro diario.

  Atributos:
    id: String (PK)
    tenantId: String
    sucursalId: String (FK → Sucursal)
    type: Enum (SALE, PURCHASE, EXPENSE, REFUND, TRANSFER, ADJUSTMENT)
    amount: Decimal
    currency: String
    exchangeRate: Decimal (default: 1)
    sku: String?                                  // SKU si es transacción de producto
    referenceType: String
    referenceId: String
    description: String
    paymentMethodId: String? (FK → PaymentMethod)
    transactionDate: DateTime
    userId: String (FK → User)
    createdAt: DateTime                           // Inmutable

  Restricción: amount != 0
```

```
INVOICE (Aggregate Root)
  Propósito: Comprobante fiscal de una venta.

  Atributos:
    id: String (PK)
    tenantId: String
    orderId: String? (FK → Order)
    number: String                                // Número fiscal
    type: Enum (A, B, C, E, M)                   // Según legislación
    status: Enum (DRAFT, ISSUED, CANCELLED)
    receiverTaxId: String
    receiverName: String
    grossAmount: Decimal
    taxAmount: Decimal
    total: Decimal
    cae: String?                                  // Código de Autorización Electrónico (AFIP)
    caeDueDate: DateTime?
    metadata: Json?
    userId: String (FK → User)
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, number]
```

```
INVOICE_LINE (Entity)
  Propósito: Línea de factura.

  Atributos:
    id: String (PK)
    invoiceId: String (FK → Invoice)
    sku: String
    description: String
    quantity: Int
    unitPrice: Decimal
    taxRate: Decimal
    taxAmount: Decimal
    total: Decimal
```

### 2.9 Cash Context

```
CASH_REGISTER (Aggregate Root)
  Propósito: Caja diaria. Una por sucursal. Solo una puede estar abierta a la vez.

  Atributos:
    id: String (PK)
    tenantId: String
    sucursalId: String (FK → Sucursal)
    name: String                                  // "Caja Principal"
    openingBalance: Decimal                       // Monto inicial
    currentBalance: Decimal
    closingBalance: Decimal?                      // Monto al cerrar
    isOpen: Boolean
    openedAt: DateTime
    closedAt: DateTime?
    openedBy: String (FK → User)
    closedBy: String? (FK → User)
    notes: String?
    discrepancy: Decimal?                         // Diferencia arqueo vs. esperado
    createdAt: DateTime
    updatedAt: DateTime
```

```
CASH_MOVEMENT (Entity)
  Propósito: Movimiento individual de efectivo dentro de una caja.

  Atributos:
    id: String (PK)
    tenantId: String
    cashRegisterId: String (FK → CashRegister)
    type: Enum (INCOME, EXPENSE)
    amount: Decimal
    reason: String
    referenceType: String?                        // "order", "expense", "transfer"
    referenceId: String?
    userId: String (FK → User)
    createdAt: DateTime

  Restricción: amount > 0
```

### 2.10 CRM Context

```
CUSTOMER_SEGMENT (Aggregate Root)
  Propósito: Segmento de clientes para marketing y análisis.

  Atributos:
    id: String (PK)
    tenantId: String
    name: String
    rules: Json                                   // Reglas de segmentación
    customerCount: Int
    createdAt: DateTime
    updatedAt: DateTime
```

```
CUSTOMER_NOTE (Entity)
  Propósito: Nota interna sobre un cliente.

  Atributos:
    id: String (PK)
    tenantId: String
    customerId: String (FK → Customer)
    content: String
    type: Enum (NOTE, COMPLAINT, COMPLEMENT)
    userId: String (FK → User)
    createdAt: DateTime
```

### 2.11 Marketing Context

```
COUPON (Aggregate Root)
  Propósito: Código de descuento aplicable a ventas.

  Atributos:
    id: String (PK)
    tenantId: String
    code: String
    type: Enum (PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING)
    value: Decimal                                // Porcentaje o monto
    minPurchaseAmount: Decimal?
    maxUsageCount: Int?
    currentUsageCount: Int
    appliesTo: Enum (ALL, CATEGORY, PRODUCT)
    appliesToId: String?                          // ID de categoría o producto
    startsAt: DateTime
    endsAt: DateTime
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime

  Unique: [tenantId, code]
  Restricción: endsAt > startsAt
  Restricción: currentUsageCount <= maxUsageCount (si maxUsageCount está definido)
```

```
CAMPAIGN (Aggregate Root)
  Propósito: Campaña de marketing.

  Atributos:
    id: String (PK)
    tenantId: String
    name: String
    type: Enum (EMAIL, SOCIAL, LANDING, DISCOUNT)
    status: Enum (DRAFT, ACTIVE, PAUSED, FINISHED)
    startsAt: DateTime
    endsAt: DateTime?
    budget: Decimal?
    segmentId: String? (FK → CustomerSegment)
    couponId: String? (FK → Coupon)
    metrics: Json?                                // Resultados
    createdAt: DateTime
    updatedAt: DateTime
```

### 2.12 CMS Context

```
PAGE (Aggregate Root)
  Propósito: Página del sitio web (home, about, contacto, etc.).

  Atributos:
    id: String (PK)
    tenantId: String
    title: String
    slug: String
    metaTitle: String?
    metaDescription: String?
    isPublished: Boolean
    isHomepage: Boolean
    publishedAt: DateTime?
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime?                          // Soft delete

  Unique: [tenantId, slug]
```

```
PAGE_SECTION (Entity)
  Propósito: Bloque visual dentro de una página.

  Atributos:
    id: String (PK)
    pageId: String (FK → Page)
    type: String                                  // "hero", "featured_products", "banner", "text", "newsletter"
    config: Json                                  // Config del bloque
    sortOrder: Int
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
```

### 2.13 Configuration Context

```
SYSTEM_CONFIG (Entity)
  Propósito: Configuraciones clave-valor por tenant.

  Atributos:
    id: String (PK)
    tenantId: String
    key: String
    value: Json
    description: String?
    updatedBy: String (FK → User)
    updatedAt: DateTime

  Unique: [tenantId, key]
```

```
TAX (Aggregate Root)
  Propósito: Impuesto aplicable a productos y ventas.

  Atributos:
    id: String (PK)
    tenantId: String
    name: String                                  // "IVA 21%"
    rate: Decimal                                 // 21.00
    type: Enum (IVA, IIBB, PERCEPTION)
    isActive: Boolean
    createdAt: DateTime
    updatedAt: DateTime
```

```
PAYMENT_METHOD (Aggregate Root)
  Propósito: Método de pago disponible.

  Atributos:
    id: String (PK)
    tenantId: String
    name: String                                  // "Mercado Pago", "Efectivo", "Transferencia"
    code: String
    type: Enum (CASH, CARD, TRANSFER, GATEWAY)
    gateway: String?                              // "mercadopago", "stripe"
    isActive: Boolean
    sortOrder: Int
    createdAt: DateTime
    updatedAt: DateTime
```

### 2.14 Storage Context

```
FILE (Aggregate Root)
  Propósito: Archivo almacenado (imagen, documento, etc.).

  Atributos:
    id: String (PK)
    tenantId: String
    originalName: String
    mimeType: String
    size: Int                                     // En bytes
    url: String                                   // URL en R2/S3
    key: String                                   // Key en el bucket
    alt: String?
    width: Int?                                   // Si es imagen
    height: Int?
    entityType: String?                           // "product", "category", "brand"
    entityId: String?
    userId: String (FK → User)
    createdAt: DateTime                           // Inmutable
```

### 2.15 Notifications Context

```
NOTIFICATION (Aggregate Root)
  Propósito: Notificación enviada a un usuario o cliente.

  Atributos:
    id: String (PK)
    tenantId: String
    type: Enum (EMAIL, SMS, WHATSAPP, PUSH)
    recipient: String
    subject: String
    body: String
    status: Enum (PENDING, SENT, FAILED, READ)
    sentAt: DateTime?
    readAt: DateTime?
    error: String?
    referenceType: String?                        // "order", "customer"
    referenceId: String?
    createdAt: DateTime
```

### 2.16 Audit Context

```
AUDIT_LOG (Aggregate Root — INMUTABLE)
  Propósito: Registro de auditoría de toda modificación importante.

  Atributos:
    id: String (PK)
    tenantId: String
    userId: String? (FK → User)
    action: String                                // "PRODUCT.CREATED", "ORDER.STATUS_CHANGED"
    entityType: String                            // "product", "order"
    entityId: String
    oldValue: Json?
    newValue: Json?
    diff: Json?
    metadata: Json?
    ipAddress: String?
    userAgent: String?
    createdAt: DateTime                           // INMUTABLE
```

### 2.17 Integrations Context

```
WEBHOOK (Aggregate Root)
  Propósito: Webhook registrado para recibir eventos del sistema.

  Atributos:
    id: String (PK)
    tenantId: String
    url: String
    secret: String                                // Para firma HMAC
    events: Json                                  // Lista de eventos suscritos
    isActive: Boolean
    lastTriggeredAt: DateTime?
    lastSuccessAt: DateTime?
    lastError: String?
    createdAt: DateTime
    updatedAt: DateTime
```

```
WEBHOOK_EVENT (Entity)
  Propósito: Registro de evento enviado a un webhook.

  Atributos:
    id: String (PK)
    webhookId: String (FK → Webhook)
    event: String
    payload: Json
    status: Enum (PENDING, SENT, FAILED)
    responseStatus: Int?
    responseBody: String?
    attempts: Int
    nextRetryAt: DateTime?
    sentAt: DateTime?
    createdAt: DateTime
```

```
INTEGRATION_LOG (Entity)
  Propósito: Registro de comunicación con sistemas externos.

  Atributos:
    id: String (PK)
    tenantId: String
    integration: String                           // "mercadopago", "stripe", "afip"
    type: Enum (INCOMING, OUTGOING)
    endpoint: String
    request: Json?
    response: Json?
    status: Enum (SUCCESS, FAILED)
    error: String?
    duration: Int                                 // En ms
    createdAt: DateTime
```
