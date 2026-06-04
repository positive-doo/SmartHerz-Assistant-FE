export type Lang = "bh" | "en";
export type LocalizedString = Partial<Record<Lang, string>>;

export interface Category {
  id: string;
  label: LocalizedString;
  order: number;
}