import type { LocalizedString } from "./category";

export interface PageItem {
  id: string;
  categoryId: string;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  order: number;
}