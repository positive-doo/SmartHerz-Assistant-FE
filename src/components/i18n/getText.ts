import type { Lang } from "@/models/category";
import type { LocalizedString } from "@/models/category";

export function getText(value: LocalizedString, lang: Lang, fallback: Lang = "bh") {
  return value[lang] ?? value[fallback] ?? "";
}