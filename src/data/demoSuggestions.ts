import type { LocalizedString } from "@/models/category";
import type {
  CategoryId,
  Suggestion,
  SuggestionsByCategory,
} from "@/state/AppUiContext";
import { createEmptySuggestions } from "@/state/AppUiContext";

type SuggestionCatalogItem = Suggestion & {
  keywords: string[];
  order: number;
};

const withFallback = (bh: string, en: string): LocalizedString => ({
  bh,
  en,
});

const suggestionCatalog: SuggestionCatalogItem[] = [
  {
    id: "page-trebinje",
    categoryId: "pages",
    title: withFallback("Trebinje", "Trebinje"),
    description: withFallback(
      "Trebinje osvaja toplom atmosferom, mediteranskom klimom i starim gradom uz Trebišnjicu. Posjeta donosi spoj znamenitosti, gostoprimstva i ugodnog boravka tokom cijele godine.",
      "According to many, Trebinje is the most beautiful Serbian city, and what definitely adorns it is the real homely atmosphere and great Mediterranean climate. What to see in Trebinje is a question we often get, so we tried to answer it through this article. A trip to Trebinje means visiting beautiful sights, but above all warm hospitality, characteristic of these regions. Of course, there are also pleasant temperatures that make tourists love to visit this city in Republika Srpska all year round."
    ),
    imageUrl: "/demo/trebinje.png",
    keywords: ["trebinje", "trebisnjica"],
    order: 1,
  },
  {
    id: "page-monasteries",
    categoryId: "pages",
    title: withFallback("Manastir Tvrdoš", "Tvrdoš Monastery"),
    description: withFallback(
      "Manastir Tvrdoš je najstariji živi manastir u današnjoj Hercegovini. Nalazi se na oko 270 m nadmorske visine, a njegova crkva je na vrhu stijene, koja se nekad u okomitim stepenicama spuštala prema dvadesetak metara nižoj Trebišnjici. Danas taj istaknuti položaj nije tako upadljiv zbog zgrada koje su zaklonile litice s južne strane. Sa zapadne i istočne strane također su bile strme padine, te se samo sa sjevera moglo jednostavno prići crkvi.",
      "Tvrdoš Monastery is the oldest active monastery in present-day Herzegovina. It stands at about 270 meters above sea level, and its church sits on top of a rock that once descended in steep steps toward the Trebišnjica River, around twenty meters below. Today, that prominent position is less striking because buildings have screened the cliffs on the southern side. There were also steep slopes on the western and eastern sides, so the church could be approached easily only from the north."
    ),
    imageUrl: "/demo/manastir.png",
    keywords: [
      "manastir",
      "manastir tvrdos",
      "tvrdos",
      "hercegovacka gracanica",
      "gracanica",
    ],
    order: 2,
  },
  {
    id: "page-stari-most",
    categoryId: "pages",
    title: withFallback("Stari most", "Old Bridge"),
    description: withFallback(
      "Stari most, poznat i kao Mostarski most, obnovljeni je osmanski most iz 16. stoljeća u gradu Mostaru u Bosni i Hercegovini. Prelazi preko rijeke Neretve i povezuje dva dijela grada, koji je ime dobio po mostarima, čuvarima koji su tokom osmanskog perioda čuvali Stari most.",
      "Stari Most, also known as Mostar Bridge, is a rebuilt 16th-century Ottoman bridge in the city of Mostar in Bosnia and Herzegovina. It crosses the river Neretva and connects the two parts of the city, which is named after the bridge keepers who guarded the Stari Most during the Ottoman era."
    ),
    imageUrl: "/demo/stari-most.png",
    keywords: ["stari most", "old bridge"],
    order: 3,
  },
  {
    id: "page-mostar",
    categoryId: "pages",
    title: withFallback("Mostar", "Mostar"),
    description: withFallback(
      "U dolini rijeke Neretve, okružen trima planinama, smješten je Mostar, ekonomski, kulturni, univerzitetski, historijski i turistički centar Hercegovine. Grad je nastao oko Starog mosta, podignutog još 1566. godine, koji je i danas najveća turistička atrakcija Mostara i Hercegovine. Mostar je nesumnjivo jedan od najvećih turističkih centara Balkana.",
      "Located in the Neretva River valley and surrounded by three mountains, Mostar is the economic, cultural, university, historical, and tourist center of Herzegovina. The city developed around the Old Bridge, built as early as 1566, which remains the greatest tourist attraction of Mostar and Herzegovina today. Mostar is undoubtedly one of the largest tourist centers in the Balkans."
    ),
    imageUrl: "/demo/mostar.png",
    keywords: ["mostar"],
    order: 4,
  },
  {
    id: "poi-hotel-apis",
    categoryId: "poi",
    title: withFallback("Hotel APIS", "Hotel APIS"),
    description: withFallback(
      "Centralna lokacija u Trebinju. Praktičan izbor ako želiš večeru i večernju šetnju bez dodatne vožnje.",
      "A central Trebinje stay that works well if you want dinner and evening walks without extra driving."
    ),
    imageUrl: "/demo/hotel-apis.jpg",
    keywords: ["hotel apis", "apis"],
    order: 1,
  },
  {
    id: "poi-jazina-club",
    categoryId: "poi",
    title: withFallback("Jazina Club", "Jazina Club"),
    description: withFallback(
      "Smještaj i restoran uz Trebišnjicu, sa više atmosfere i dobrim ritmom za sporiji dan pored vode.",
      "A stay-and-lunch option by the Trebišnjica river with more atmosphere and a slower pace by the water."
    ),
    imageUrl: "/demo/jazina-club.jpg",
    keywords: ["jazina club", "jazina"],
    order: 2,
  },
  {
    id: "poi-vinarija-bojanic",
    categoryId: "poi",
    title: withFallback("Vinarija Bojanić", "Bojanić Winery"),
    description: withFallback(
      "Vinarija Bojanić, smještena u Pridvorcima kod Trebinja, nudi ugodnu atmosferu, obilazak vinarije i degustaciju lokalnih vina. Dobra je stanica za parove i sve koji žele mirniji hercegovački vinski doživljaj.",
      "'Bojanić' winery, located in Pridvorci near Trebinje, offers a welcoming atmosphere, winery tours, and tastings of local wines. It is a strong stop for couples and for anyone looking for a calmer Herzegovinian wine experience."
    ),
    imageUrl: "/demo/vinarija-bojanic.png",
    keywords: ["vinarija bojanic", "bojanic winery", "bojanic", "vinarija"],
    order: 3,
  },
  {
    id: "offer-romantic-trebinje",
    categoryId: "special_offers",
    title: withFallback(
      "Romantični boravak u Trebinju",
      "Romantic Trebinje stay"
    ),
    description: withFallback(
      "Trebinje, šetnja starim gradom, pogled s Gračanice i večera uz rijeku za opušten ritam za parove.",
      "Trebinje, an old-town walk, a viewpoint stop, and a riverside dinner for a relaxed couple rhythm."
    ),
    imageUrl: "/demo/trebisnjica.jpg",
    keywords: ["couple", "romantic", "par", "parovski", "trebinje", "gracanica"],
    order: 1,
  },
  {
    id: "offer-wine-river-combo",
    categoryId: "special_offers",
    title: withFallback("Vino i rijeka", "Wine and river combo"),
    description: withFallback(
      "Tvrdoš, Bojanić i ručak u Jazini za dan s malo vožnje i puno ugođaja.",
      "Tvrdoš, Bojanić, and lunch at Jazina for a day with less driving and more atmosphere."
    ),
    imageUrl: "/demo/vinarija-bojanic.png",
    keywords: ["tvrdos", "bojanic", "jazina", "wine", "vino", "rucak"],
    order: 2,
  },
  {
    id: "offer-mostar-excursion",
    categoryId: "special_offers",
    title: withFallback("Mostar izlet dodatak", "Mostar excursion add-on"),
    description: withFallback(
      "Kravice i Mostar kao aktivnija dnevna opcija ako želite sadržajniji izlet.",
      "Kravice and Mostar as a more active day-trip option if you want one fuller excursion."
    ),
    imageUrl: "/demo/mostar.png",
    keywords: ["mostar", "stari most", "kravice", "hutovo blato", "izlet"],
    order: 3,
  },
];

const featuredCategoryIds: CategoryId[] = ["pages", "poi", "special_offers"];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sortByOrder = (a: SuggestionCatalogItem, b: SuggestionCatalogItem) =>
  a.order - b.order;

export const buildDemoSuggestionsFromAssistantText = (
  text: string
): SuggestionsByCategory => {
  const suggestions = createEmptySuggestions();
  const normalizedText = normalizeText(text);

  if (!normalizedText.trim()) {
    return suggestions;
  }

  const matchedItems = suggestionCatalog
    .filter((item) =>
      item.keywords.some((keyword) =>
        normalizedText.includes(normalizeText(keyword))
      )
    )
    .sort(sortByOrder);

  for (const categoryId of featuredCategoryIds) {
    suggestions[categoryId] = matchedItems.filter(
      (item) => item.categoryId === categoryId
    );
  }

  return suggestions;
};
