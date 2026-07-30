import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { RequirePermission } from '@modules/authorization/presentation/decorators';
import { ReviewAppService } from '../../services';
import type { CreateProductReviewRequestDto, UpdateProductReviewRequestDto, ReviewVoteRequestDto } from '../dto';
import { CreateProductReviewCommand, DeleteProductReviewCommand, GetCustomerReviewsCommand, GetReviewByIdCommand, UpdateProductReviewCommand, CastReviewVoteCommand, RemoveReviewVoteCommand } from '../../application/commands';

@Controller('api/v1/account/reviews')
export class AccountReviewsController {
  constructor(private readonly service: ReviewAppService) {}
  private tenant(headers: Record<string, string>): string { return headers['x-tenant-id'] || 'default'; }
  private customer(headers: Record<string, string>): string { return headers['x-customer-id'] || headers['x-user-id'] || ''; }
  @Post() @RequirePermission({ resource: 'reviews', action: 'create' }) create(@Headers() headers: Record<string, string>, @Body() dto: CreateProductReviewRequestDto) { return this.service.createProductReview(new CreateProductReviewCommand(this.tenant(headers), this.customer(headers), dto.productId, dto.rating, dto.content, dto.title ?? null, dto.productVariantId ?? null)); }
  @Get() @RequirePermission({ resource: 'reviews', action: 'read-own' }) list(@Headers() headers: Record<string, string>) { return this.service.getCustomerReviews(new GetCustomerReviewsCommand(this.tenant(headers), this.customer(headers))); }
  @Get(':id') @RequirePermission({ resource: 'reviews', action: 'read-own' }) get(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.getReviewById(new GetReviewByIdCommand(this.tenant(headers), id)); }
  @Patch(':id') @RequirePermission({ resource: 'reviews', action: 'update-own' }) update(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: UpdateProductReviewRequestDto) { return this.service.updateProductReview(new UpdateProductReviewCommand(this.tenant(headers), this.customer(headers), id, dto.rating, dto.title ?? null, dto.content)); }
  @Delete(':id') @RequirePermission({ resource: 'reviews', action: 'delete-own' }) remove(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.deleteProductReview(new DeleteProductReviewCommand(this.tenant(headers), this.customer(headers), id)); }
  @Post(':id/votes') castVote(@Headers() headers: Record<string, string>, @Param('id') id: string, @Body() dto: ReviewVoteRequestDto) { return this.service.castReviewVote(new CastReviewVoteCommand(this.tenant(headers), id, dto.vote, dto.customerId ?? this.customer(headers) ?? null, dto.guestFingerprintHash ?? null)); }
  @Delete(':id/votes') removeVote(@Headers() headers: Record<string, string>, @Param('id') id: string) { return this.service.removeReviewVote(new RemoveReviewVoteCommand(this.tenant(headers), id, this.customer(headers) || null)); }
}
