// ──────────────────────────────────────────────
// @tienda/schemas — Reusable Zod schemas
// ──────────────────────────────────────────────

export {
  uuidSchema,
  idSchema,
  slugSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  urlSchema,
  nameSchema,
  descriptionSchema,
  positiveNumberSchema,
  nonNegativeNumberSchema,
  integerSchema,
  quantitySchema,
  percentageSchema,
  moneySchema,
  dateSchema,
  optionalDateSchema,
  futureDateSchema,
  pastDateSchema,
  dateRangeSchema,
  booleanSchema,
  colorSchema,
  localeSchema,
  languageSchema,
  timeZoneSchema,
  currencySchema,
  statusSchema,
  orderStatusSchema,
  paymentStatusSchema,
} from './common';

export {
  paginationSchema,
  sortingSchema,
  searchSchema,
} from './shared';

export type {
  PaginationInput,
  PaginationOutput,
  SortingInput,
  SortingOutput,
  SearchInput,
  SearchOutput,
} from './shared';
