import { Body, Controller, Get, Headers, Param, Patch, Post, Delete } from '@nestjs/common';
import { RequirePermission } from '@modules/authorization/presentation/decorators';
import { ReviewAppService } from '../../services';
import type { ReviewResponseRequestDto } from '../dto';
import { ApproveProductReviewCommand, ArchiveProductReviewCommand, HideProductReviewCommand, ListReviewsForModerationCommand, RejectProductReviewCommand, RestoreProductReviewCommand, UnhideProductReviewCommand, AddReviewResponseCommand, UpdateReviewResponseCommand, RemoveReviewResponseCommand, GetReviewByIdCommand } from '../../application/commands';

@Controller('api/v1/admin/reviews')
export class AdminReviewsController {
  constructor(private readonly service: ReviewAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  @Get() @RequirePermission({ resource: 'reviews', action: 'manage' }) list(@Headers() headers: Record<string, string>) { return this.service.listReviewsForModeration(new ListReviewsForModerationCommand(this.tenant(headers))); }
  @Get(':id') @RequirePermission({ resource: 'reviews', action: 'manage' }) get(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.getReviewById(new GetReviewByIdCommand(this.tenant(headers), id)); }
  @Post(':id/approve') @RequirePermission({ resource: 'reviews', action: 'moderate' }) approve(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.approveProductReview(new ApproveProductReviewCommand(this.tenant(headers), id)); }
  @Post(':id/reject') @RequirePermission({ resource: 'reviews', action: 'moderate' }) reject(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('reason') reason: string) { return this.service.rejectProductReview(new RejectProductReviewCommand(this.tenant(headers), id, reason)); }
  @Post(':id/hide') @RequirePermission({ resource: 'reviews', action: 'hide' }) hide(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body('reason') reason: string) { return this.service.hideProductReview(new HideProductReviewCommand(this.tenant(headers), id, reason)); }
  @Post(':id/unhide') @RequirePermission({ resource: 'reviews', action: 'hide' }) unhide(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.unhideProductReview(new UnhideProductReviewCommand(this.tenant(headers), id)); }
  @Post(':id/archive') @RequirePermission({ resource: 'reviews', action: 'archive' }) archive(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.archiveProductReview(new ArchiveProductReviewCommand(this.tenant(headers), id)); }
  @Post(':id/restore') @RequirePermission({ resource: 'reviews', action: 'archive' }) restore(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.restoreProductReview(new RestoreProductReviewCommand(this.tenant(headers), id)); }
  @Post(':id/response') @RequirePermission({ resource: 'reviews', action: 'respond' }) addResponse(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: ReviewResponseRequestDto) { return this.service.addReviewResponse(new AddReviewResponseCommand(this.tenant(headers), id, dto.content, headers['x-user-id'] || 'admin')); }
  @Patch(':id/response') @RequirePermission({ resource: 'reviews', action: 'respond' }) updateResponse(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: ReviewResponseRequestDto) { return this.service.updateReviewResponse(new UpdateReviewResponseCommand(this.tenant(headers), id, dto.content)); }
  @Delete(':id/response') @RequirePermission({ resource: 'reviews', action: 'respond' }) removeResponse(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.removeReviewResponse(new RemoveReviewResponseCommand(this.tenant(headers), id)); }
}
