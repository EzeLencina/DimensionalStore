-- Create enums
CREATE TYPE "CheckoutStatus" AS ENUM ('OPEN', 'VALIDATING', 'READY', 'COMPLETED', 'EXPIRED', 'CANCELLED', 'FAILED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- Create CheckoutSession table
CREATE TABLE "checkout_sessions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "customerId" TEXT,
    "guestEmail" TEXT,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'OPEN',
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "shippingAmount" INTEGER NOT NULL DEFAULT 0,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "shippingMethodCode" TEXT,
    "paymentMethodCode" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "idempotencyKey" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);

-- Create CheckoutAddress table
CREATE TABLE "checkout_addresses" (
    "id" TEXT NOT NULL,
    "checkoutSessionId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'SHIPPING',
    "recipientName" TEXT NOT NULL,
    "phone" TEXT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "apartment" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'AR',
    "notes" TEXT,
    CONSTRAINT "checkout_addresses_pkey" PRIMARY KEY ("id")
);

-- Create Order table
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "checkoutSessionId" TEXT NOT NULL,
    "customerId" TEXT,
    "guestEmail" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "shippingAmount" INTEGER NOT NULL DEFAULT 0,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "taxAmount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "shippingMethodCode" TEXT,
    "paymentMethodCode" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- Create OrderItem table
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productNameSnapshot" TEXT NOT NULL,
    "variantNameSnapshot" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- Create IdempotencyRecord table
CREATE TABLE "idempotency_records" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

-- CheckoutSession indexes
CREATE UNIQUE INDEX "checkout_sessions_tenantId_idempotencyKey_key" ON "checkout_sessions"("tenantId", "idempotencyKey");
CREATE INDEX "checkout_sessions_tenantId_cartId_idx" ON "checkout_sessions"("tenantId", "cartId");
CREATE INDEX "checkout_sessions_tenantId_status_expiresAt_idx" ON "checkout_sessions"("tenantId", "status", "expiresAt");

-- CheckoutAddress unique
CREATE UNIQUE INDEX "checkout_addresses_checkoutSessionId_key" ON "checkout_addresses"("checkoutSessionId");

-- Order indexes
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
CREATE UNIQUE INDEX "orders_checkoutSessionId_key" ON "orders"("checkoutSessionId");
CREATE INDEX "orders_tenantId_customerId_createdAt_idx" ON "orders"("tenantId", "customerId", "createdAt");
CREATE INDEX "orders_tenantId_status_createdAt_idx" ON "orders"("tenantId", "status", "createdAt");

-- OrderItem indexes
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productVariantId_idx" ON "order_items"("productVariantId");
CREATE INDEX "order_items_sku_idx" ON "order_items"("sku");

-- IdempotencyRecord indexes
CREATE UNIQUE INDEX "idempotency_records_tenantId_key_operation_key" ON "idempotency_records"("tenantId", "key", "operation");
CREATE INDEX "idempotency_records_tenantId_createdAt_idx" ON "idempotency_records"("tenantId", "createdAt");

-- Foreign keys
ALTER TABLE "checkout_addresses" ADD CONSTRAINT "checkout_addresses_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "checkout_sessions"("id") ON DELETE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;

-- Add unique constraint on tenantId + checkoutSessionId for Order
CREATE UNIQUE INDEX "orders_tenantId_checkoutSessionId_key" ON "orders"("tenantId", "checkoutSessionId");
CREATE UNIQUE INDEX "orders_tenantId_orderNumber_key" ON "orders"("tenantId", "orderNumber");
