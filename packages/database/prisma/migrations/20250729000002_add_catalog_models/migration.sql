-- CreateEnum
CREATE TYPE "CatalogStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CatalogVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('MANUAL', 'RULE_BASED', 'TEMPORARY', 'FEATURED');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "status" "CatalogStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "CatalogVisibility" NOT NULL DEFAULT 'PUBLIC',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "image" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "CollectionType" NOT NULL DEFAULT 'MANUAL',
    "status" "CatalogStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "CatalogVisibility" NOT NULL DEFAULT 'PUBLIC',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("tenantId","productId","categoryId")
);

-- CreateTable
CREATE TABLE "product_collections" (
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("tenantId","productId","collectionId")
);

-- CreateIndex
CREATE INDEX "categories_tenantId_idx" ON "categories"("tenantId");

-- CreateIndex
CREATE INDEX "categories_tenantId_parentId_idx" ON "categories"("tenantId", "parentId");

-- CreateIndex
CREATE INDEX "categories_tenantId_status_idx" ON "categories"("tenantId", "status");

-- CreateIndex
CREATE INDEX "categories_tenantId_visibility_idx" ON "categories"("tenantId", "visibility");

-- CreateIndex
CREATE INDEX "categories_tenantId_displayOrder_idx" ON "categories"("tenantId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "categories_tenantId_slug_key" ON "categories"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "collections_tenantId_idx" ON "collections"("tenantId");

-- CreateIndex
CREATE INDEX "collections_tenantId_status_idx" ON "collections"("tenantId", "status");

-- CreateIndex
CREATE INDEX "collections_tenantId_visibility_idx" ON "collections"("tenantId", "visibility");

-- CreateIndex
CREATE INDEX "collections_tenantId_displayOrder_idx" ON "collections"("tenantId", "displayOrder");

-- CreateIndex
CREATE INDEX "collections_tenantId_startAt_endAt_idx" ON "collections"("tenantId", "startAt", "endAt");

-- CreateIndex
CREATE UNIQUE INDEX "collections_tenantId_slug_key" ON "collections"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "product_categories_tenantId_categoryId_idx" ON "product_categories"("tenantId", "categoryId");

-- CreateIndex
CREATE INDEX "product_categories_tenantId_productId_idx" ON "product_categories"("tenantId", "productId");

-- CreateIndex
CREATE INDEX "product_collections_tenantId_collectionId_idx" ON "product_collections"("tenantId", "collectionId");

-- CreateIndex
CREATE INDEX "product_collections_tenantId_collectionId_displayOrder_idx" ON "product_collections"("tenantId", "collectionId", "displayOrder");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
