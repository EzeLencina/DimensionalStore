-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('INITIAL', 'INBOUND', 'OUTBOUND', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'RESERVATION', 'RELEASE', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'RELEASED', 'CONSUMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "onHand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "available" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousOnHand" INTEGER NOT NULL,
    "resultingOnHand" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_reservations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "referenceType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_tenantId_code_key" ON "warehouses"("tenantId", "code");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_idx" ON "warehouses"("tenantId");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_status_idx" ON "warehouses"("tenantId", "status");

-- CreateIndex
CREATE INDEX "warehouses_tenantId_isDefault_idx" ON "warehouses"("tenantId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_tenantId_warehouseId_productVariantId_key" ON "inventory_items"("tenantId", "warehouseId", "productVariantId");

-- CreateIndex
CREATE INDEX "inventory_items_tenantId_sku_idx" ON "inventory_items"("tenantId", "sku");

-- CreateIndex
CREATE INDEX "inventory_items_tenantId_warehouseId_idx" ON "inventory_items"("tenantId", "warehouseId");

-- CreateIndex
CREATE INDEX "inventory_items_tenantId_productVariantId_idx" ON "inventory_items"("tenantId", "productVariantId");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_productVariantId_createdAt_idx" ON "stock_movements"("tenantId", "productVariantId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_warehouseId_createdAt_idx" ON "stock_movements"("tenantId", "warehouseId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_movements_tenantId_referenceType_referenceId_idx" ON "stock_movements"("tenantId", "referenceType", "referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_reservations_tenantId_referenceType_referenceId_produ_key" ON "stock_reservations"("tenantId", "referenceType", "referenceId", "productVariantId");

-- CreateIndex
CREATE INDEX "stock_reservations_tenantId_status_expiresAt_idx" ON "stock_reservations"("tenantId", "status", "expiresAt");
