-- Create wishlist enums
CREATE TYPE "WishlistStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'EXPIRED', 'DELETED');
CREATE TYPE "WishlistPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- Create wishlists table
CREATE TABLE "wishlists" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "customerId" TEXT,
  "guestTokenHash" TEXT,
  "name" TEXT NOT NULL,
  "status" "WishlistStatus" NOT NULL DEFAULT 'ACTIVE',
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "expiresAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wishlist_items" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "wishlistId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productVariantId" TEXT,
  "sku" TEXT,
  "itemKey" TEXT NOT NULL,
  "note" TEXT,
  "priority" "WishlistPriority" NOT NULL DEFAULT 'NORMAL',
  "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wishlists_tenantId_guestTokenHash_key" ON "wishlists"("tenantId", "guestTokenHash");
CREATE INDEX "wishlists_tenantId_customerId_status_idx" ON "wishlists"("tenantId", "customerId", "status");
CREATE INDEX "wishlists_tenantId_guestTokenHash_status_idx" ON "wishlists"("tenantId", "guestTokenHash", "status");
CREATE INDEX "wishlists_tenantId_customerId_isDefault_idx" ON "wishlists"("tenantId", "customerId", "isDefault");
CREATE INDEX "wishlists_tenantId_status_expiresAt_idx" ON "wishlists"("tenantId", "status", "expiresAt");
CREATE INDEX "wishlists_tenantId_updatedAt_idx" ON "wishlists"("tenantId", "updatedAt");

CREATE UNIQUE INDEX "wishlist_items_wishlistId_itemKey_key" ON "wishlist_items"("wishlistId", "itemKey");
CREATE INDEX "wishlist_items_tenantId_wishlistId_idx" ON "wishlist_items"("tenantId", "wishlistId");
CREATE INDEX "wishlist_items_tenantId_productId_idx" ON "wishlist_items"("tenantId", "productId");
CREATE INDEX "wishlist_items_tenantId_productVariantId_idx" ON "wishlist_items"("tenantId", "productVariantId");
CREATE INDEX "wishlist_items_tenantId_sku_idx" ON "wishlist_items"("tenantId", "sku");
CREATE INDEX "wishlist_items_tenantId_addedAt_idx" ON "wishlist_items"("tenantId", "addedAt");

ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL;
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE CASCADE;
