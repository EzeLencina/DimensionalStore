CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN', 'ARCHIVED');
CREATE TYPE "ReviewVoteType" AS ENUM ('HELPFUL', 'NOT_HELPFUL');

CREATE TABLE "product_reviews" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productVariantId" TEXT,
  "customerId" TEXT NOT NULL,
  "orderId" TEXT,
  "orderItemId" TEXT,
  "rating" INTEGER NOT NULL,
  "title" TEXT,
  "content" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "rejectedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review_responses" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "review_responses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "review_votes" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "reviewId" TEXT NOT NULL,
  "customerId" TEXT,
  "guestFingerprintHash" TEXT,
  "actorKey" TEXT NOT NULL,
  "vote" "ReviewVoteType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "product_review_summaries" (
  "tenantId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "averageRating" DECIMAL(10,2) NOT NULL,
  "totalReviews" INTEGER NOT NULL,
  "rating1Count" INTEGER NOT NULL,
  "rating2Count" INTEGER NOT NULL,
  "rating3Count" INTEGER NOT NULL,
  "rating4Count" INTEGER NOT NULL,
  "rating5Count" INTEGER NOT NULL,
  "verifiedReviewsCount" INTEGER NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "product_review_summaries_pkey" PRIMARY KEY ("tenantId", "productId")
);

CREATE UNIQUE INDEX "product_reviews_tenantId_customerId_productId_key" ON "product_reviews"("tenantId", "customerId", "productId");
CREATE INDEX "product_reviews_tenantId_productId_status_createdAt_idx" ON "product_reviews"("tenantId", "productId", "status", "createdAt");
CREATE INDEX "product_reviews_tenantId_customerId_createdAt_idx" ON "product_reviews"("tenantId", "customerId", "createdAt");
CREATE INDEX "product_reviews_tenantId_orderId_idx" ON "product_reviews"("tenantId", "orderId");
CREATE INDEX "product_reviews_tenantId_orderItemId_idx" ON "product_reviews"("tenantId", "orderItemId");
CREATE INDEX "product_reviews_tenantId_rating_idx" ON "product_reviews"("tenantId", "rating");
CREATE INDEX "product_reviews_tenantId_isVerifiedPurchase_idx" ON "product_reviews"("tenantId", "isVerifiedPurchase");

CREATE UNIQUE INDEX "review_responses_reviewId_key" ON "review_responses"("reviewId");
CREATE INDEX "review_responses_tenantId_reviewId_idx" ON "review_responses"("tenantId", "reviewId");

CREATE UNIQUE INDEX "review_votes_tenantId_reviewId_actorKey_key" ON "review_votes"("tenantId", "reviewId", "actorKey");
CREATE INDEX "review_votes_tenantId_reviewId_vote_idx" ON "review_votes"("tenantId", "reviewId", "vote");
CREATE INDEX "review_votes_tenantId_customerId_idx" ON "review_votes"("tenantId", "customerId");

CREATE INDEX "product_review_summaries_tenantId_averageRating_idx" ON "product_review_summaries"("tenantId", "averageRating");
CREATE INDEX "product_review_summaries_tenantId_totalReviews_idx" ON "product_review_summaries"("tenantId", "totalReviews");
