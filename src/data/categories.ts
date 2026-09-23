import type { Category } from "@/models/category";

export const categories: Category[] = [
  { id: "pages", label: { bh: "Stranice", en: "Pages" }, order: 1 },
  { id: "poi", label: { bh: "POI", en: "POI" }, order: 2 },
  {
    id: "thematic_routes",
    label: { bh: "Tematske rute", en: "Thematic Routes" },
    order: 3,
  },
  { id: "events", label: { bh: "Događaji", en: "Events" }, order: 4 },
  { id: "news", label: { bh: "Vesti", en: "News" }, order: 5 },
];
