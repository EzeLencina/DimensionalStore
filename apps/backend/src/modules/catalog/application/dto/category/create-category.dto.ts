export type CreateCategoryDto = {
  name: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  status?: string;
  visibility?: string;
  displayOrder?: number;
  icon?: string | null;
  image?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
