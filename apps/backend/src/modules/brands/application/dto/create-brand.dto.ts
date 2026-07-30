export type CreateBrandDto = {
  name: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  status?: string;
  visibility?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
