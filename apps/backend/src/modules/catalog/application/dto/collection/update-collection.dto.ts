export type UpdateCollectionDto = {
  name?: string;
  slug?: string;
  description?: string | null;
  type?: string;
  displayOrder?: number;
  startAt?: string | null;
  endAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};
