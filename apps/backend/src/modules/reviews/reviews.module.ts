import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from '@tienda/logger/nest';
import { AuthorizationModule } from '@modules/authorization';
import { REVIEW_PROVIDERS } from './providers';
import { PublicReviewsController, AccountReviewsController, AdminReviewsController, AdminProductReviewsController } from './presentation';
import { ReviewExceptionFilter } from './presentation';

@Module({
  imports: [LoggerModule, AuthorizationModule],
  controllers: [PublicReviewsController, AccountReviewsController, AdminReviewsController, AdminProductReviewsController],
  providers: [...REVIEW_PROVIDERS, { provide: APP_FILTER, useClass: ReviewExceptionFilter }],
  exports: [],
})
export class ReviewsModule {}
