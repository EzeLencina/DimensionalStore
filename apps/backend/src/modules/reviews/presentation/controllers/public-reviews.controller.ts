import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ReviewAppService } from '../../services';
import { GetProductReviewSummaryCommand, GetPublicProductReviewsCommand } from '../../application/commands';

@Controller('api/v1/products/:productId/reviews')
export class PublicReviewsController {
  constructor(private readonly service: ReviewAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  @Get() list(@Headers() headers: Record<string, string>, @Param('productId') productId: string, @Query() query: { rating?: string; verifiedOnly?: string; sort?: string; cursor?: string; limit?: string }) { return this.service.getPublicProductReviews(new GetPublicProductReviewsCommand(this.tenant(headers), productId, query.rating ? Number(query.rating) : undefined, query.verifiedOnly === 'true', query.sort, query.cursor, query.limit ? Number(query.limit) : undefined)); }
  @Get('summary') summary(@Headers() headers: Record<string, string>, @Param('productId') productId: string) { return this.service.getProductReviewSummary(new GetProductReviewSummaryCommand(this.tenant(headers), productId)); }
}
