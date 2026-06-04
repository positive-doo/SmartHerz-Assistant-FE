import type { Category } from "@/models/category";

export const categories: Category[] = [
  { id: "pages", label: { bh: "Stranice", en: "Pages" }, order: 1 },
  { id: "events", label: { bh: "Događaji", en: "Events" }, order: 2 },
  { id: "special_offers", label: { bh: "Specijalne ponude", en: "Special Offers" }, order: 3 },
  { id: "poi", label: { bh: "POI", en: "POI" }, order: 4 },
  { id: "news", label: { bh: "Vesti", en: "News" }, order: 5 },
];