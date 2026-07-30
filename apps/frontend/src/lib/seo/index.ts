export {
  SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_LOCALE, SITE_LANGUAGE,
  SITE_THEME_COLOR, SITE_TWITTER_HANDLE,
  TITLE_TEMPLATE, DEFAULT_TITLE, DEFAULT_DESCRIPTION,
  OG_IMAGE_DEFAULT, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT,
  ORGANIZATION, ROBOTS_RULES,
} from './constants';

export { buildMetadata, buildProductMetadata, buildCategoryMetadata, buildBrandMetadata } from './metadata';

export {
  organizationSchema, websiteSchema, productSchema,
  breadcrumbSchema, faqSchema,
} from './schema';
