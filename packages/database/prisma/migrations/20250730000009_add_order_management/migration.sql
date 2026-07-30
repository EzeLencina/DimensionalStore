-- Extend the order state machine without rewriting prior migrations.
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_FAILED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_PICKUP';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_CANCELLED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'RETURN_REQUESTED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'RETURNED';

ALTER TABLE "orders"
  ADD COLUMN "paymentStatus" TEXT,
  ADD COLUMN "fulfillmentStatus" TEXT,
  ADD COLUMN "cancellationReason" TEXT,
  ADD COLUMN "cancelledAt" TIMESTAMP(3),
  ADD COLUMN "confirmedAt" TIMESTAMP(3),
  ADD COLUMN "processingStartedAt" TIMESTAMP(3),
  ADD COLUMN "readyAt" TIMESTAMP(3),
  ADD COLUMN "shippedAt" TIMESTAMP(3),
  ADD COLUMN "deliveredAt" TIMESTAMP(3),
  ADD COLUMN "expiredAt" TIMESTAMP(3),
  ADD COLUMN "carrierCode" TEXT,
  ADD COLUMN "trackingNumber" TEXT,
  ADD COLUMN "trackingUrl" TEXT;

DROP INDEX IF EXISTS "orders_orderNumber_key";
CREATE INDEX "orders_tenantId_guestEmail_createdAt_idx" ON "orders"("tenantId", "guestEmail", "createdAt");
CREATE INDEX "orders_tenantId_paymentStatus_idx" ON "orders"("tenantId", "paymentStatus");
CREATE INDEX "orders_tenantId_fulfillmentStatus_idx" ON "orders"("tenantId", "fulfillmentStatus");
CREATE INDEX "orders_tenantId_updatedAt_idx" ON "orders"("tenantId", "updatedAt");

CREATE TABLE "order_status_history" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "fromStatus" TEXT,
  "toStatus" TEXT NOT NULL,
  "reason" TEXT,
  "metadata" JSONB,
  "changedByType" TEXT NOT NULL,
  "changedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_notes" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "visibility" TEXT NOT NULL DEFAULT 'INTERNAL',
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "order_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_cancellations" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'FULL',
  "reasonCode" TEXT NOT NULL,
  "reasonText" TEXT,
  "status" TEXT NOT NULL DEFAULT 'COMPLETED',
  "requestedByType" TEXT NOT NULL,
  "requestedById" TEXT,
  "approvedBy" TEXT,
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approvedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "metadata" JSONB,
  CONSTRAINT "order_cancellations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "order_status_history_tenantId_orderId_createdAt_idx" ON "order_status_history"("tenantId", "orderId", "createdAt");
CREATE INDEX "order_status_history_tenantId_toStatus_createdAt_idx" ON "order_status_history"("tenantId", "toStatus", "createdAt");
CREATE INDEX "order_notes_tenantId_orderId_createdAt_idx" ON "order_notes"("tenantId", "orderId", "createdAt");
CREATE INDEX "order_notes_tenantId_visibility_idx" ON "order_notes"("tenantId", "visibility");
CREATE INDEX "order_notes_tenantId_createdBy_idx" ON "order_notes"("tenantId", "createdBy");
CREATE UNIQUE INDEX "order_cancellations_tenantId_orderId_key" ON "order_cancellations"("tenantId", "orderId");
CREATE INDEX "order_cancellations_tenantId_status_requestedAt_idx" ON "order_cancellations"("tenantId", "status", "requestedAt");

ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;
ALTER TABLE "order_notes" ADD CONSTRAINT "order_notes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;
ALTER TABLE "order_cancellations" ADD CONSTRAINT "order_cancellations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;
