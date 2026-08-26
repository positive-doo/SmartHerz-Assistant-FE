import type { RegionSlug } from "@/data/regions";

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasAlias = (text: string, alias: string) =>
  new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizeText(alias))}([^a-z0-9]|$)`).test(
    text
  );

const destinationAliases: Record<RegionSlug, string[]> = {
  trebinje: [
    "trebinje",
    "trebinju",
    "trebinja",
    "trebinjem",
    "trebisnjica",
    "tvrdos",
    "hercegovacka gracanica",
    "hotel apis",
    "jazina",
    "jazina club",
    "bojanic",
  ],
  bileca: [
    "bileca",
    "bileci",
    "bilecu",
    "bileckog jezera",
    "bilecko jezero",
  ],
  gacko: ["gacko", "gacku", "gacka", "gatacka"],
  nevesinje: ["nevesinje", "nevesinju", "nevesinja", "nevesinjska"],
  ljubinje: ["ljubinje", "ljubinju", "ljubinja"],
  berkovici: ["berkovici", "berkovicima", "berkovica"],
  kalinovik: ["kalinovik", "kalinoviku", "kalinovika"],
  "istocni-mostar": [
    "istocni mostar",
    "istocnom mostaru",
    "mostar",
    "mostaru",
    "stari most",
    "starom mostu",
  ],
};

export const detectDestinationSlugsFromText = (text: string): RegionSlug[] => {
  const normalizedText = normalizeText(text);

  if (!normalizedText.trim()) {
    return [];
  }

  return (Object.entries(destinationAliases) as Array<[RegionSlug, string[]]>)
    .filter(([, aliases]) =>
      aliases.some((alias) => hasAlias(normalizedText, alias))
    )
    .map(([slug]) => slug);
};
