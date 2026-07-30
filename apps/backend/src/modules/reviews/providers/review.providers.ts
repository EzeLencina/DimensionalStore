import { Provider } from '@nestjs/common';
import { PrismaClient } from '@tienda/database';
import { MailSanitizer } from '@core/mail/utils/sanitizer';
import { REVIEW_REPOSITORY, REVIEW_RESPONSE_REPOSITORY, REVIEW_VOTE_REPOSITORY, REVIEW_SUMMARY_REPOSITORY } from '../domain';
import { PrismaReviewRepository, PrismaReviewResponseRepository, PrismaReviewVoteRepository, PrismaReviewSummaryRepository, InMemoryReviewRepository, InMemoryReviewResponseRepository, InMemoryReviewVoteRepository, InMemoryReviewSummaryRepository } from '../infrastructure';
import { ReviewAppService } from '../services';

class ContentSanitizerAdapter {
  private readonly sanitizer = new MailSanitizer();
  sanitize(input: string): string { return input.replace(/\s+/g, ' ').trim(); }
  stripHtml(input: string): string { return this.sanitizer.stripHtml(input); }
}

export const ReviewRepositoryProvider: Provider = { provide: REVIEW_REPOSITORY, useClass: PrismaReviewRepository };
export const ReviewResponseRepositoryProvider: Provider = { provide: REVIEW_RESPONSE_REPOSITORY, useClass: PrismaReviewResponseRepository };
export const ReviewVoteRepositoryProvider: Provider = { provide: REVIEW_VOTE_REPOSITORY, useClass: PrismaReviewVoteRepository };
export const ReviewSummaryRepositoryProvider: Provider = { provide: REVIEW_SUMMARY_REPOSITORY, useClass: PrismaReviewSummaryRepository };

export const REVIEW_PROVIDERS: Provider[] = [
  ReviewRepositoryProvider,
  ReviewResponseRepositoryProvider,
  ReviewVoteRepositoryProvider,
  ReviewSummaryRepositoryProvider,
  ReviewAppService,
  { provide: 'PRISMA_CLIENT_REVIEWS', useFactory: () => new PrismaClient() },
  { provide: 'PRODUCT_READER', useFactory: () => ({ getProduct: async () => null }) },
  { provide: 'PRODUCT_VARIANT_READER', useFactory: () => ({ getVariant: async () => null }) },
  { provide: 'CUSTOMER_READER', useFactory: () => ({ exists: async () => true, isActive: async () => true, getDisplayName: async () => null }) },
  { provide: 'ORDER_READER', useFactory: () => ({ findVerifiedPurchase: async () => null, isOrderAllowedForReview: async () => false }) },
  { provide: 'EVENT_PUBLISHER_REVIEWS', useFactory: () => ({ publish: async () => {} }) },
  { provide: 'CLOCK_REVIEWS', useFactory: () => ({ now: () => new Date() }) },
  { provide: 'CURRENT_ACTOR_REVIEWS', useFactory: () => ({ getType: () => 'SYSTEM', getId: () => null }) },
  { provide: 'CONTENT_SANITIZER', useClass: ContentSanitizerAdapter },
];
