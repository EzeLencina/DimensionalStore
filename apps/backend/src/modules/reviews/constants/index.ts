export const REVIEW_PERMISSIONS = {
  CREATE: 'reviews.create',
  READ_OWN: 'reviews.read-own',
  UPDATE_OWN: 'reviews.update-own',
  DELETE_OWN: 'reviews.delete-own',
  MODERATE: 'reviews.moderate',
  RESPOND: 'reviews.respond',
  HIDE: 'reviews.hide',
  ARCHIVE: 'reviews.archive',
  RECALCULATE: 'reviews.recalculate',
  MANAGE: 'reviews.manage',
} as const;

export const REVIEW_CONTENT_MIN_LENGTH = 10;
export const REVIEW_CONTENT_MAX_LENGTH = 5000;
export const REVIEW_TITLE_MAX_LENGTH = 120;
export const REVIEW_EDIT_WINDOW_HOURS = 72;
export const REVIEW_MAX_REVIEWS_PER_PERIOD = 5;
export const REVIEW_MAX_VOTES_PER_PERIOD = 50;
export const REVIEW_MIN_PURCHASE_AGE_DAYS = 0;
export const REVIEW_ALLOWED_ORDER_STATUSES = ['PAYMENT_CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED'] as const;
