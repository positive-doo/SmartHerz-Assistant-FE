import type { Lang } from "@/models/category";

export type FoodCatalogItem = {
  id: string;
  title: Record<Lang, string>;
  imageUrl: string;
  keywords: string[];
};

export const FOOD_CATALOG: FoodCatalogItem[] = [
  {
    id: "sir-iz-mijeha",
    title: { bh: "Sir iz mijeha", en: "Cheese aged in sheepskin" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/sir-iz-mjeha.webp",
    keywords: ["sir iz mjeha", "sira iz mijeha", "sira iz mjeha", "sirom iz mijeha", "sirom iz mjeha", "siru iz mijeha", "siru iz mjeha", "sheepskin cheese", "cheese in a sack", "cheese from a sack", "cheese matured in sheepskin"],
  },
  {
    id: "kajmak",
    title: { bh: "Kajmak", en: "Kajmak (clotted cream)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/kajmak-istocna-hercegovina.webp",
    keywords: ["kajmak", "kajmaka", "kajmakom", "kajmaku", "kaymak", "clotted cream"],
  },
  {
    id: "hercegovacki-prsut",
    title: { bh: "Hercegovački pršut", en: "Herzegovinian prosciutto" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/herzegovina-prsut.webp",
    keywords: ["pršut", "pršuta", "pršutom", "pršutu", "prosciutto", "Herzegovinian dry-cured ham", "Herzegovinian cured ham"],
  },
  {
    id: "ovcija-stelja",
    title: { bh: "Ovčija stelja", en: "Stelja (dried mutton)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/ovcija-stelja-istocna-hercegovina.webp",
    keywords: ["stelja", "stelje", "stelju", "steljom", "stelji", "dried mutton", "smoked mutton", "cured mutton"],
  },
  {
    id: "jagnjetina-na-raznju",
    title: { bh: "Jagnjetina na ražnju", en: "Spit-roasted lamb" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/jagnjetina-na-raznju-istocna-hercegovina.webp",
    keywords: ["jagnjetine na ražnju", "jagnjetinu na ražnju", "jagnjetinom na ražnju", "janjetina na ražnju", "janjetine na ražnju", "janjetinu na ražnju", "janjetinom na ražnju", "lamb on a spit", "lamb roasted on a spit", "roast lamb", "roasted lamb"],
  },
  {
    id: "japrak",
    title: { bh: "Japrak", en: "Japrak (stuffed leaves)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/japrak-i-sarma-gastronomija.webp",
    keywords: ["japrak", "japraka", "japraku", "japrakom", "japraci", "japrake", "japracima", "stuffed vine leaves", "stuffed grape leaves", "stuffed collard greens"],
  },
  {
    id: "podrobac-zatop",
    title: { bh: "Podrobac / zatop", en: "Podrobac / zatop" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/podrobac-zatop-istocna-hercegovina.webp",
    keywords: ["podrobac", "podropac", "podrobca", "podropca", "podrobaca", "podropaca", "podrobcem", "podropcem", "zatop", "zatopa", "zatopom", "zatopu"],
  },
  {
    id: "cicvara",
    title: { bh: "Cicvara", en: "Cicvara" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/cicvara-istocna-hercegovina.webp",
    keywords: ["cicvara", "cicvare", "cicvaru", "cicvari", "cicvarom"],
  },
  {
    id: "prijesnac",
    title: { bh: "Prijesnac", en: "Prijesnac (cheese pie)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/prijesnac-istocna-hercegovina.webp",
    keywords: ["prijesnac", "prijesnaca", "prijesnacu", "prijesnacem", "prijesnca", "prijesncu", "prijesncem", "presnac", "presnaca", "presnacu", "presnacem"],
  },
  {
    id: "ustipci",
    title: { bh: "Uštipci", en: "Uštipci (fried dough bites)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/ustipci-istocna-hercegovina.webp",
    keywords: ["uštipci", "uštipaka", "uštipke", "uštipcima", "uštipak", "fried dough bites", "fried dough balls"],
  },
  {
    id: "pura",
    title: { bh: "Pura", en: "Pura (polenta)" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/tradicionalna-jela-cover.webp",
    // "Pure" is also an English adjective, so it must not match by itself.
    keywords: ["pura", "puru", "purom", "palenta", "palente", "palentu", "palentom", "polenta"],
  },
  {
    id: "corba-od-graha-poljaka",
    title: { bh: "Čorba od graha poljaka", en: "Poljak bean soup" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/corba-od-graha-istocna-hercegovina.webp",
    keywords: ["grah poljak", "graha poljaka", "grahom poljakom", "čorba od graha", "čorbe od graha", "čorbu od graha", "čorbom od graha", "čorba od pasulja", "poljak bean", "poljak beans", "bean soup"],
  },
  {
    id: "hercegovacki-med",
    title: { bh: "Hercegovački med", en: "Herzegovinian honey" },
    imageUrl: "https://smartherz.info/wp-content/uploads/2026/10/med-istocna-hecegovina.webp",
    keywords: ["med", "meda", "medom", "medu", "honey"],
  },
];
