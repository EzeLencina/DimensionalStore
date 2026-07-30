-- CreateEnum
CREATE TYPE "PriceListType" AS ENUM ('RETAIL', 'WHOLESALE', 'CHANNEL', 'CUSTOMER_GROUP', 'PROMOTIONAL');

-- CreateEnum
CREATE TYPE "SalesChannel" AS ENUM ('WEB', 'ADMIN', 'MERCADO_LIBRE', 'TIENDANUBE', 'WOOCOMMERCE', 'MANUAL');

-- CreateTable
CREATE TABLE "price_lists" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "type" "PriceListType" NOT NULL DEFAULT 'RETAIL',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "channel" "SalesChannel",
    "customerGroup" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_prices" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "costAmount" INTEGER,
    "listAmount" INTEGER NOT NULL,
    "saleAmount" INTEGER,
    "promotionalAmount" INTEGER,
    "promotionalStartsAt" TIMESTAMP(3),
    "promotionalEndsAt" TIMESTAMP(3),
    "minimumQuantity" INTEGER NOT NULL DEFAULT 1,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "variant_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "variantPriceId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "changeType" TEXT NOT NULL,
    "previousValues" JSONB NOT NULL,
    "newValues" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_lists_tenantId_code_key" ON "price_lists"("tenantId", "code");

-- CreateIndex
CREATE INDEX "price_lists_tenantId_status_idx" ON "price_lists"("tenantId", "status");

-- CreateIndex
CREATE INDEX "price_lists_tenantId_currency_idx" ON "price_lists"("tenantId", "currency");

-- CreateIndex
CREATE INDEX "price_lists_tenantId_channel_idx" ON "price_lists"("tenantId", "channel");

-- CreateIndex
CREATE INDEX "price_lists_tenantId_isDefault_idx" ON "price_lists"("tenantId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "variant_prices_tenantId_priceListId_productVariantId_minim_key" ON "variant_prices"("tenantId", "priceListId", "productVariantId", "minimumQuantity");

-- CreateIndex
CREATE INDEX "variant_prices_tenantId_productVariantId_idx" ON "variant_prices"("tenantId", "productVariantId");

-- CreateIndex
CREATE INDEX "variant_prices_tenantId_sku_idx" ON "variant_prices"("tenantId", "sku");

-- CreateIndex
CREATE INDEX "variant_prices_tenantId_promotionalStartsAt_promotionalEnd_idx" ON "variant_prices"("tenantId", "promotionalStartsAt", "promotionalEndsAt");

-- CreateIndex
CREATE INDEX "price_history_tenantId_variantPriceId_createdAt_idx" ON "price_history"("tenantId", "variantPriceId", "createdAt");

-- CreateIndex
CREATE INDEX "price_history_tenantId_productVariantId_createdAt_idx" ON "price_history"("tenantId", "productVariantId", "createdAt");
