export type UpdateCategoryDto = {
  name?: string;
  slug?: string;
  parentId?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  displayOrder?: number;
  icon?: string | null;
  image?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
