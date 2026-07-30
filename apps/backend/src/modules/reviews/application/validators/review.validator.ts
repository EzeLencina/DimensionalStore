import { REVIEW_CONTENT_MAX_LENGTH, REVIEW_CONTENT_MIN_LENGTH, REVIEW_TITLE_MAX_LENGTH } from '../../constants';
import type { CreateProductReviewCommand, UpdateProductReviewCommand, AddReviewResponseCommand, RejectProductReviewCommand } from '../commands';

export class ReviewValidator {
  static normalize(value: string): string { return value.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/gi, '').replace(/\s+/g, ' ').trim(); }
  static validateCreate(cmd: CreateProductReviewCommand): string[] { const content = this.normalize(cmd.content); const errors: string[] = []; if (!Number.isInteger(cmd.rating) || cmd.rating < 1 || cmd.rating > 5) errors.push('Invalid rating'); if (content.length < REVIEW_CONTENT_MIN_LENGTH) errors.push('Content too short'); if (content.length > REVIEW_CONTENT_MAX_LENGTH) errors.push('Content too long'); if (cmd.title && this.normalize(cmd.title).length > REVIEW_TITLE_MAX_LENGTH) errors.push('Title too long'); return errors; }
  static validateUpdate(cmd: UpdateProductReviewCommand): string[] { return cmd.rating !== undefined && (!Number.isInteger(cmd.rating) || cmd.rating < 1 || cmd.rating > 5) ? ['Invalid rating'] : []; }
  static validateResponse(cmd: AddReviewResponseCommand): string[] { return this.normalize(cmd.content).length > 0 ? [] : ['Invalid response']; }
  static validateRejection(cmd: RejectProductReviewCommand): string[] { return cmd.reason?.trim() ? [] : ['Rejection reason required']; }
}
