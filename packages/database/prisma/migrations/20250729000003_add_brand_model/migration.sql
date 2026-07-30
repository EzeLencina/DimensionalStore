-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BrandVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');

-- AlterTable
ALTER TABLE "products" ADD COLUMN "brandId" TEXT;

-- CreateIndex
CREATE INDEX "products_tenantId_brandId_idx" ON "products"("tenantId", "brandId");

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "status" "BrandStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "BrandVisibility" NOT NULL DEFAULT 'PUBLIC',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brands_tenantId_idx" ON "brands"("tenantId");

-- CreateIndex
CREATE INDEX "brands_tenantId_status_idx" ON "brands"("tenantId", "status");

-- CreateIndex
CREATE INDEX "brands_tenantId_visibility_idx" ON "brands"("tenantId", "visibility");

-- CreateIndex
CREATE INDEX "brands_tenantId_name_idx" ON "brands"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_tenantId_slug_key" ON "brands"("tenantId", "slug");
