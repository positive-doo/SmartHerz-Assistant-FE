import type { PageItem } from "@/models/pageItem";
import { getPublicAssetPath } from "@/utils/getPublicAssetPath";

export const pageItems: PageItem[] = [
  {
    id: "trebinje",
    categoryId: "pages",
    title: { bh: "Trebinje", en: "Trebinje" },
    description: {
      bh: "Trebinje je jedan od najljepših gradova na jugu Hercegovine...",
      en: "Trebinje is one of the most beautiful towns in southern Herzegovina...",
    },
    imageUrl: getPublicAssetPath("/placeholders/trebinje.jpg"),
    order: 1,
  },
  {
    id: "bileca",
    categoryId: "pages",
    title: { bh: "Bileća", en: "Bileća" },
    description: {
      bh: "Bileća je miran hercegovački grad smješten uz obalu Bilećkog jezera...",
      en: "Bileća is a calm town by Bileća Lake...",
    },
    imageUrl: getPublicAssetPath("/placeholders/bileca.jpg"),
    order: 2,
  },
  {
    id: "gacko",
    categoryId: "pages",
    title: { bh: "Gacko", en: "Gacko" },
    description: {
      bh: "Gacko je hercegovački grad smješten u prostranoj Gatačkoj dolini...",
      en: "Gacko is located in the spacious Gacko valley...",
    },
    imageUrl: getPublicAssetPath("/placeholders/gacko.jpg"),
    order: 3,
  },
  {
    id: "nevesinje",
    categoryId: "pages",
    title: { bh: "Nevesinje", en: "Nevesinje" },
    description: {
      bh: "Nevesinje je grad smješten na širokoj Nevesinjskoj visoravni...",
      en: "Nevesinje lies on the wide Nevesinje plateau...",
    },
    imageUrl: getPublicAssetPath("/placeholders/nevesinje.jpg"),
    order: 4,
  },
];
