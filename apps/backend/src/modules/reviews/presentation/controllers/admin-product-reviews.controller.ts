import { Controller, Headers, Param, Post } from '@nestjs/common';
import { RequirePermission } from '@modules/authorization/presentation/decorators';
import { ReviewAppService } from '../../services';
import { RecalculateProductReviewSummaryCommand } from '../../application/commands';

@Controller('api/v1/admin/products/:productId/reviews')
export class AdminProductReviewsController {
  constructor(private readonly service: ReviewAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  @Post('recalculate') @RequirePermission({ resource: 'reviews', action: 'recalculate' }) recalculate(@Headers() headers: Record<string, string>, @Param('productId') productId: string) { return this.service.recalculateProductReviewSummary(new RecalculateProductReviewSummaryCommand(this.tenant(headers), productId)); }
}
