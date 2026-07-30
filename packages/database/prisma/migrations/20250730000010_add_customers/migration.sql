-- Create enums
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'ARCHIVED');
CREATE TYPE "CustomerSource" AS ENUM ('WEB', 'ADMIN', 'GUEST_CHECKOUT', 'IMPORT', 'MERCADO_LIBRE', 'TIENDANUBE', 'WOOCOMMERCE', 'MANUAL');
CREATE TYPE "CustomerAddressType" AS ENUM ('SHIPPING', 'BILLING', 'BOTH');

-- Create customers table
CREATE TABLE "customers" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "userId" TEXT,
  "email" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "documentType" TEXT,
  "documentNumber" TEXT,
  "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
  "source" "CustomerSource" NOT NULL DEFAULT 'WEB',
  "locale" TEXT NOT NULL DEFAULT 'es-AR',
  "preferredCurrency" TEXT NOT NULL DEFAULT 'ARS',
  "acceptsMarketing" BOOLEAN NOT NULL DEFAULT false,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  "lastOrderAt" TIMESTAMP(3),
  "firstOrderAt" TIMESTAMP(3),
  "totalOrders" INTEGER NOT NULL DEFAULT 0,
  "totalSpent" INTEGER NOT NULL DEFAULT 0,
  "averageOrderValue" INTEGER NOT NULL DEFAULT 0,
  "deletedAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_addresses" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "type" "CustomerAddressType" NOT NULL DEFAULT 'SHIPPING',
  "label" TEXT,
  "recipientName" TEXT NOT NULL,
  "phone" TEXT,
  "street" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "apartment" TEXT,
  "city" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "notes" TEXT,
  "isDefaultShipping" BOOLEAN NOT NULL DEFAULT false,
  "isDefaultBilling" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_preferences" (
  "customerId" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'es',
  "currency" TEXT NOT NULL DEFAULT 'ARS',
  "marketingEmail" BOOLEAN NOT NULL DEFAULT false,
  "marketingWhatsApp" BOOLEAN NOT NULL DEFAULT false,
  "marketingSms" BOOLEAN NOT NULL DEFAULT false,
  "orderNotifications" BOOLEAN NOT NULL DEFAULT true,
  "productRecommendations" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "customer_preferences_pkey" PRIMARY KEY ("customerId")
);

CREATE TABLE "customer_tags" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "customer_tags_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "customer_tag_assignments" (
  "customerId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  "assignedBy" TEXT NOT NULL,
  "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "customer_tag_assignments_pkey" PRIMARY KEY ("customerId","tagId")
);

CREATE TABLE "customer_notes" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "customer_notes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "customers_tenantId_email_key" ON "customers"("tenantId", "email");
CREATE UNIQUE INDEX "customers_tenantId_userId_key" ON "customers"("tenantId", "userId");
CREATE INDEX "customers_tenantId_status_idx" ON "customers"("tenantId", "status");
CREATE INDEX "customers_tenantId_source_idx" ON "customers"("tenantId", "source");
CREATE INDEX "customers_tenantId_createdAt_idx" ON "customers"("tenantId", "createdAt");
CREATE INDEX "customers_tenantId_lastOrderAt_idx" ON "customers"("tenantId", "lastOrderAt");
CREATE INDEX "customers_tenantId_totalSpent_idx" ON "customers"("tenantId", "totalSpent");

CREATE INDEX "customer_addresses_tenantId_customerId_idx" ON "customer_addresses"("tenantId", "customerId");
CREATE INDEX "customer_addresses_tenantId_customerId_isDefaultShipping_idx" ON "customer_addresses"("tenantId", "customerId", "isDefaultShipping");
CREATE INDEX "customer_addresses_tenantId_customerId_isDefaultBilling_idx" ON "customer_addresses"("tenantId", "customerId", "isDefaultBilling");

CREATE UNIQUE INDEX "customer_tags_tenantId_slug_key" ON "customer_tags"("tenantId", "slug");
CREATE INDEX "customer_tags_tenantId_name_idx" ON "customer_tags"("tenantId", "name");

CREATE INDEX "customer_notes_tenantId_customerId_createdAt_idx" ON "customer_notes"("tenantId", "customerId", "createdAt");
CREATE INDEX "customer_notes_tenantId_createdBy_idx" ON "customer_notes"("tenantId", "createdBy");

ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE;
ALTER TABLE "customer_preferences" ADD CONSTRAINT "customer_preferences_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE;
ALTER TABLE "customer_tag_assignments" ADD CONSTRAINT "customer_tag_assignments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE;
ALTER TABLE "customer_tag_assignments" ADD CONSTRAINT "customer_tag_assignments_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "customer_tags"("id") ON DELETE CASCADE;
ALTER TABLE "customer_notes" ADD CONSTRAINT "customer_notes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE;

ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL;
