import type { LocalizedString } from "@/models/category";
import type {
  CategoryId,
  Suggestion,
  SuggestionsByCategory,
} from "@/state/AppUiContext";
import { createEmptySuggestions } from "@/state/AppUiContext";
import { getPublicAssetPath } from "@/utils/getPublicAssetPath";
import type { ExperienceFilterId } from "@/data/experienceFilters";
import { REGION_ENTRIES, type RegionSlug } from "@/data/regions";
import poiRecords from "@/data/poiCatalog.json";

type SuggestionCatalogItem = Suggestion & {
  keywords: string[];
  interestIds?: ExperienceFilterId[];
  routeIds?: string[];
  order: number;
};

const withFallback = (bh: string, en: string): LocalizedString => ({
  bh,
  en,
});

const DESTINATION_URLS: Record<RegionSlug, string> = {
  trebinje: "https://smartherz.info/destinacije/trebinje",
  bileca: "https://smartherz.info/destinacije/bileca",
  kalinovik: "https://smartherz.info/destinacije/kalinovik",
  berkovici: "https://smartherz.info/destinacije/berkovici",
  nevesinje: "https://smartherz.info/destinacije/nevesinje",
  gacko: "https://smartherz.info/destinacije/gacko",
  ljubinje: "https://smartherz.info/destinacije/ljubinje",
  "istocni-mostar": "https://smartherz.info/destinacije/istocni-mostar",
};

const featuredCatalog: SuggestionCatalogItem[] = [
  {
    id: "page-trebinje",
    categoryId: "pages",
    title: withFallback("Trebinje", "Trebinje"),
    description: withFallback(
      "Grad na obali Trebišnjice, prepoznatljiv po kamenim sokacima, vinogradima i mediteranskoj klimi. Trebinje se nalazi na krajnjem jugu Republike Srpske i Bosne i Hercegovine, svega 28 km od Dubrovnika i 40 km od Herceg Novog. Zahvaljujući položaju između mediteranskog i kontinentalnog prostora, odlikuju ga blaga klima, duga topla ljeta i oko 240 sunčanih dana godišnje. Bogata istorija grada vidljiva je u njegovoj arhitekturi, kulturi i tradiciji. Stari grad, vijekovni manastiri i duga tradicija vinogradarstva čine važan dio identiteta današnjeg Trebinja.",
      "A city on the banks of the Trebišnjica River, known for its stone-paved streets, vineyards, and Mediterranean climate. Trebinje is located in the southernmost part of Republika Srpska and Bosnia and Herzegovina, just 28 km from Dubrovnik and 40 km from Herceg Novi. Thanks to its position between the Mediterranean and continental regions, the city enjoys a mild climate, long warm summers, and around 240 sunny days a year. Trebinje’s rich history is reflected in its architecture, culture, and traditions. Its Old Town, centuries-old monasteries, and long-standing winemaking tradition remain an important part of the city’s identity today."
    ),
    imageUrl: getPublicAssetPath("/images/trebinje.png"),
    municipalitySlug: "trebinje",
    url: DESTINATION_URLS.trebinje,
    keywords: ["trebinje", "trebisnjica", "trebinju"],
    order: 1,
  },
  {
    id: "page-bileca",
    categoryId: "pages",
    title: withFallback("Bileća", "Bileća"),
    description: withFallback(
      "Bileća, skriveni dragulj juga Hercegovine, smještena je 30 kilometara sjeveroistočno od Trebinja, na raskrsnici puteva prema Crnoj Gori i Hrvatskoj. Grad odiše mirnom, autentičnom atmosferom, dok se u njegovom centru i danas prepoznaje nasljeđe austrougarske arhitekture. Okružena toplom mediteransko-kontinentalnom klimom i prostranstvom Bilećkog jezera, Bileća je idealna za putnike koji žele otkriti manje poznatu, ali bogatu stranu Hercegovine. Njenu posebnost upotpunjuju vrijedno kulturno-istorijsko nasljeđe, srednjovjekovni manastiri, stećci pod zaštitom UNESCO-a i priče o značajnim umjetnicima i stvaraocima porijeklom iz ovog kraja. Bileća je destinacija za one koji traže mir, prirodu, istoriju i autentičan hercegovački doživljaj.",
      "Bileća, a hidden gem in southern Herzegovina, lies 30 kilometers northeast of Trebinje, at a crossroads connecting Montenegro and Croatia. The town has a calm, authentic feel, with traces of Austro-Hungarian architecture still visible in its center. Surrounded by a mild Mediterranean-continental climate and the wide blue waters of Lake Bileća, it is a great choice for travelers looking to discover a quieter, less explored side of Herzegovina. Bileća also stands out for its rich cultural heritage, medieval monasteries, UNESCO-listed stećci, and connections to notable artists and writers from the region. It is a place for those drawn to peaceful landscapes, history, and a more authentic Herzegovinian experience."
    ),
    imageUrl: getPublicAssetPath("/images/bileca.png"),
    municipalitySlug: "bileca",
    url: DESTINATION_URLS.bileca,
    keywords: ["bileca", "bileća", "bilecko jezero", "bilećko jezero"],
    order: 3,
  },
  {
    id: "page-kalinovik",
    categoryId: "pages",
    title: withFallback("Kalinovik", "Kalinovik"),
    description: withFallback(
      "Kalinovik, smješten na visoravni Zagorje na oko 1.100 metara nadmorske visine, predstavlja jedno od najautentičnijih planinskih područja Istočne Hercegovine. Okružen Treskavicom, Lelijom, Zelengorom i Crvnjem, ovaj kraj nudi netaknutu prirodu, planinska jezera, atraktivne staze i pravi doživljaj Via Dinarice. Idealna je destinacija za planinarenje, avanturistički turizam, boravak u prirodi i otkrivanje mirnijih, manje poznatih predjela Bosne i Hercegovine. Pored impresivnih planinskih pejzaža, Kalinovik čuva i bogato kulturno-istorijsko nasljeđe — srednjovjekovne utvrde, brojne nekropole stećaka i tragove različitih civilizacija koje su vijekovima oblikovale ovaj kraj. Danas je to mjesto za putnike koji traže prirodu, istoriju i autentičnu planinsku avanturu.",
      "Kalinovik, set on the Zagorje plateau at around 1,100 meters above sea level, is one of the most authentic mountain destinations in Eastern Herzegovina. Surrounded by the Treskavica, Lelija, Zelengora, and Crvanj mountains, the area offers unspoiled nature, mountain lakes, scenic trails, and a true Via Dinarica experience. It is an ideal destination for hiking, outdoor adventures, and discovering the quieter, lesser-known landscapes of Bosnia and Herzegovina. Beyond its striking mountain scenery, Kalinovik also boasts a rich cultural and historical heritage, with medieval fortresses, numerous stećci necropolises, and traces of the many civilizations that have shaped the region over the centuries. Today, it is a destination for travelers seeking nature, history, and an authentic mountain adventure."
    ),
    imageUrl: getPublicAssetPath("/images/kalinovik.png"),
    municipalitySlug: "kalinovik",
    url: DESTINATION_URLS.kalinovik,
    keywords: ["kalinovik", "jezera gorske oci", "gorske oči", "gorske oci"],
    order: 4,
  },
  {
    id: "page-berkovici",
    categoryId: "pages",
    title: withFallback("Berkovići", "Berkovići"),
    description: withFallback(
      "Berkovići, smješteni u istočnoj Hercegovini, izdvajaju se očuvanom prirodom, bogatim nasljeđem i autentičnim hercegovačkim ambijentom. Okruženi kraškim poljima, planinskim pejzažima i vidikovcima, nude brojne mogućnosti za planinarenje, biciklizam i paraglajding. Posebnu vrijednost predstavljaju periodični vodopad Opačice, srednjovjekovne nekropole stećaka, među kojima je Potkuk pod zaštitom UNESCO-a, te Stari grad Koštun. Berkovići su idealna destinacija za ljubitelje prirode, istorije i mirnijeg odmora.",
      "Berkovići, located in eastern Herzegovina, stands out for its unspoiled nature, rich heritage, and authentic Herzegovinian atmosphere. Surrounded by karst fields, mountain landscapes, and scenic viewpoints, the area offers plenty of opportunities for hiking, cycling, and paragliding. Highlights include the seasonal Opačica Waterfall, medieval stećci necropolises, including the UNESCO-protected Potkuk site, and the historic Koštun Old Town. Berkovići is an ideal destination for travelers looking to enjoy nature, history, and a peaceful getaway."
    ),
    imageUrl: getPublicAssetPath("/images/berkovici.png"),
    municipalitySlug: "berkovici",
    url: DESTINATION_URLS.berkovici,
    keywords: ["berkovici", "berkovići", "stari grad koštun", "nekropola stećaka potkuk"],
    order: 5,
  },
  {
    id: "page-stari-most",
    categoryId: "pages",
    title: withFallback("Stari most", "Old Bridge"),
    description: withFallback(
      "Stari most, poznat i kao Mostarski most, obnovljeni je osmanski most iz 16. stoljeća u gradu Mostaru u Bosni i Hercegovini. Prelazi preko rijeke Neretve i povezuje dva dijela grada, koji je ime dobio po mostarima, čuvarima koji su tokom osmanskog perioda čuvali Stari most.",
      "Stari Most, also known as Mostar Bridge, is a rebuilt 16th-century Ottoman bridge in the city of Mostar in Bosnia and Herzegovina. It crosses the river Neretva and connects the two parts of the city, which is named after the bridge keepers who guarded the Stari Most during the Ottoman era."
    ),
    imageUrl: getPublicAssetPath("/images/stari-most.png"),
    municipalitySlug: "istocni-mostar",
    keywords: ["stari most", "old bridge"],
    order: 6,
  },
  {
    id: "page-mostar",
    categoryId: "pages",
    title: withFallback("Mostar", "Mostar"),
    description: withFallback(
      "U dolini rijeke Neretve, okružen trima planinama, smješten je Mostar, ekonomski, kulturni, univerzitetski, historijski i turistički centar Hercegovine. Grad je nastao oko Starog mosta, podignutog još 1566. godine, koji je i danas najveća turistička atrakcija Mostara i Hercegovine. Mostar je nesumnjivo jedan od najvećih turističkih centara Balkana.",
      "Located in the Neretva River valley and surrounded by three mountains, Mostar is the economic, cultural, university, historical, and tourist center of Herzegovina. The city developed around the Old Bridge, built as early as 1566, which remains the greatest tourist attraction of Mostar and Herzegovina today. Mostar is undoubtedly one of the largest tourist centers in the Balkans."
    ),
    imageUrl: getPublicAssetPath("/images/mostar.png"),
    municipalitySlug: "istocni-mostar",
    keywords: ["mostar"],
    order: 7,
  },
  {
    id: "route-staza-ukusa-istocne-hercegovine",
    categoryId: "thematic_routes",
    title: withFallback(
      "Staza ukusa Istočne Hercegovine",
      "The Taste Trail of Eastern Herzegovina"
    ),
    description: withFallback(
      "Staza ukusa Istočne Hercegovine vodi od vinograda i gradske pijace Trebinja do planinskih predjela Kalinovika, otkrivajući autentične ukuse, mirise i tradiciju ovog kraja.\n\nNa ruti se smjenjuju vinarije, lokalni proizvodi, manastirsko nasljeđe i planinski ambijent, stvarajući putovanje kroz različita lica Hercegovine. Domaći sir, kajmak, med, vino i tradicionalna kuhinja povezuju mjesta i ljude u jedinstven gastronomski doživljaj.\n\nOvo je ruta za putnike koji žele Hercegovinu upoznati kroz njene ukuse, krajolike i gostoprimstvo.",
      "The Taste Trail of Eastern Herzegovina leads from the vineyards and city market of Trebinje to the mountain landscapes of Kalinovik, revealing the authentic flavors, aromas, and traditions of the region.\n\nAlong the route, wineries, local products, monastic heritage, and mountain scenery come together to create a journey through the many faces of Herzegovina. Homemade cheese, kaymak, honey, wine, and traditional cuisine connect places and people in a unique gastronomic experience.\n\nThis route is for travelers who want to discover Herzegovina through its flavors, landscapes, and hospitality."
    ),
    imageUrl: getPublicAssetPath("/images/routes/ruta-staza-ukusa.png"),
    url: "https://smartherz.info/tematske-rute/staza-ukusa-istocna-hercegovina",
    keywords: [
      "staza ukusa",
      "stazu ukusa",
      "ukusa istocne hercegovine",
      "gastro tura",
      "gastro ture",
      "gastronomija",
    ],
    interestIds: ["gastronomy"],
    order: 1,
  },
  {
    id: "route-price-uklesane-u-kamenu",
    categoryId: "thematic_routes",
    title: withFallback(
      "Priče uklesane u kamenu",
      "Stories Carved in Stone"
    ),
    description: withFallback(
      "Ruta „Priče uklesane u kamenu“ vodi kroz kulturno-istorijsko nasljeđe Istočne Hercegovine, povezujući stećke, srednjovjekovne gradove, tvrđave, manastire, crkve, mostove i tragove različitih civilizacija.\n\nOd Trebinja i Bileće, preko Ljubinja i Berkovića, do Nevesinja i Gacka, svaki lokalitet otkriva novo poglavlje prošlosti ovog prostora. Posebno mjesto zauzimaju srednjovjekovne nekropole stećaka, među kojima se nalaze i lokaliteti pod zaštitom UNESCO-a.\n\nOvo je ruta za putnike koji žele da Hercegovinu upoznaju kroz njene kamene spomenike, istorijske pejzaže i priče koje su vijekovima ostale sačuvane na mjestima na kojima su nastale.",
      "The Stories Carved in Stone route explores the cultural and historical heritage of Eastern Herzegovina, connecting stećci, medieval towns, fortresses, monasteries, churches, bridges, and traces of different civilizations.\n\nFrom Trebinje and Bileća, through Ljubinje and Berkovići, to Nevesinje and Gacko, each site reveals a new chapter in the region’s past. Medieval stećak necropolises hold a special place along the route, including sites protected by UNESCO.\n\nThis route is for travelers who want to discover Herzegovina through its stone monuments, historical landscapes, and stories preserved for centuries in the places where they originated."
    ),
    imageUrl: getPublicAssetPath("/images/routes/ruta-price-uklesane-u-kamenu.png"),
    url: "https://smartherz.info/tematske-rute/price-uklesane-u-kamenu/",
    keywords: [
      "price uklesane u kamenu",
      "priče uklesane u kamenu",
      "kulturna bastina",
      "kulturna baština",
      "kulturno-istorijsko nasljedje",
      "kulturno-istorijsko nasljeđe",
    ],
    interestIds: ["culture"],
    order: 2,
  },
  {
    id: "route-izmedju-planina-i-neba",
    categoryId: "thematic_routes",
    title: withFallback(
      "Između planina i neba",
      "Between the Mountains and the Sky"
    ),
    description: withFallback(
      "Ruta „Između planina i neba“ otkriva divlju i planinsku stranu Istočne Hercegovine, kroz glacijalna jezera, visoke grebene, izvore, pećine i prostrane planinske pejzaže.\n\nOd Zelengore i njenih čuvenih „gorskih očiju“, preko planinskih predjela Kalinovika i Gacka, ruta pruža brojne mogućnosti za planinarenje, trekking i istraživanje gotovo netaknute prirode. Različite dionice mogu se prilagoditi iskustvu i kondiciji posjetilaca — od kraćih izleta do zahtjevnijih cjelodnevnih tura.\n\nOvo je ruta za ljubitelje aktivnog odmora, tišine planina i pejzaža koji se najbolje otkrivaju pješke.",
      "The Between the Mountains and the Sky route reveals the wild, mountainous side of Eastern Herzegovina through glacial lakes, high ridges, springs, caves, and vast mountain landscapes.\n\nFrom Zelengora and its famous “mountain eyes” to the highlands of Kalinovik and Gacko, the route offers numerous opportunities for hiking, trekking, and exploring nearly untouched nature. Different sections can be adapted to visitors’ experience and fitness levels, from shorter excursions to demanding full-day tours.\n\nThis route is for lovers of active holidays, mountain solitude, and landscapes best discovered on foot."
    ),
    imageUrl: getPublicAssetPath("/images/routes/ruta-izmedju-planina-i-neba.png"),
    url: "https://smartherz.info/tematske-rute/izmedu-planina-i-neba/",
    keywords: [
      "izmedju planina i neba",
      "između planina i neba",
      "planinarska ruta",
      "planinarske rute",
      "avanturista",
      "avanturisticka ruta",
      "avanturistička ruta",
    ],
    interestIds: ["adventure"],
    order: 3,
  },
  {
    id: "route-hercegovina-za-cijelu-porodicu",
    categoryId: "thematic_routes",
    title: withFallback("Hercegovina za cijelu porodicu", "Herzegovina for the Whole Family"),
    description: withFallback(
      "Pronađite ideje za porodični obilazak Hercegovine kroz istorijske znamenitosti, prirodne predele i mesta za predah. Izaberite stanice koje odgovaraju uzrastu, interesovanjima i vremenu koje imate na raspolaganju.",
      "Find ideas for a family visit to Herzegovina through historic landmarks, natural landscapes and places to take a break. Choose stops that suit your family's ages, interests and available time."
    ),
    imageUrl: getPublicAssetPath("/images/routes/ruta-herzegovina-za-celu-porodicu.png"),
    url: "https://smartherz.info/tematske-rute/hercegovina-za-cijelu-porodicu/",
    keywords: ["hercegovina za cijelu porodicu", "hercegovina za celu porodicu", "herzegovina for the whole family"],
    order: 4,
  },
  {
    id: "route-staza-vode-i-krsa",
    categoryId: "thematic_routes",
    title: withFallback("Staza vode i krša", "The Water and Karst Trail"),
    description: withFallback(
      "Istražite Hercegovinu kroz njene reke, jezera, izvore, mostove i kraške predele. Ova ruta daje ideje za nastavak obilaska uz vodu i upoznavanje pejzaža koje su oblikovali voda i kamen.",
      "Explore Herzegovina through its rivers, lakes, springs, bridges and karst landscapes. This route offers ideas for continuing your visit beside the water and discovering scenery shaped by water and stone."
    ),
    imageUrl: getPublicAssetPath("/images/routes/ruta-staza-vode-i-krsa-hero.png"),
    url: "https://smartherz.info/tematske-rute/staza-vode-i-krsa/",
    keywords: ["staza vode i krsa", "water and karst trail", "trail of water and karst"],
    order: 5,
  },
];

const featuredCategoryIds: CategoryId[] = ["pages", "poi", "thematic_routes"];

const cyrillicLetters: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "dj", е: "e", ж: "z",
  з: "z", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n",
  њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ћ: "c", у: "u",
  ф: "f", х: "h", ц: "c", ч: "c", џ: "dz", ш: "s",
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[а-яђјљњћџ]/g, (letter) => cyrillicLetters[letter] ?? letter)
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bsv\b/g, "svetog")
    .trim();

// Keep every master-sheet row while sharing one card for confirmed duplicate places.
const poiById = new Map<string, SuggestionCatalogItem>();
for (const record of poiRecords) {
  const existing = poiById.get(record.canonicalId);
  if (existing) {
    existing.keywords = [...new Set([...existing.keywords, ...record.keywords])];
    existing.imageUrl ||= record.imageUrl || undefined;
    existing.routeIds = [...new Set([...(existing.routeIds ?? []), ...record.routeIds])];
    continue;
  }
  const municipalities = new Set(record.municipalities.map(normalizeText));
  const municipalitySlugs = REGION_ENTRIES
    .filter(([, name]) => municipalities.has(normalizeText(name)))
    .map(([slug]) => slug);
  poiById.set(record.canonicalId, {
    id: record.canonicalId,
    categoryId: "poi",
    title: record.title,
    description: record.description,
    imageUrl: record.imageUrl || undefined,
    url: DESTINATION_URLS[municipalitySlugs[0]],
    municipalitySlug: municipalitySlugs[0],
    municipalitySlugs,
    keywords: [...record.keywords],
    routeIds: record.routeIds,
    order: poiById.size + 1,
  });
}

const suggestionCatalog = [...featuredCatalog, ...poiById.values()];

// Match complete words and common case endings, e.g. Gračanica / Gračanice / Gračanicu.
const keywordPattern = (keyword: string) => {
  const words = normalizeText(keyword).split(" ").map((word) => {
    if (word.length < 4) return word;
    const stem = word.replace(/(?:ima|ama|og|oj|ih|im|om|em|a|e|i|o|u)$/, "");
    if (stem.length < 4) return word;
    return `(?:${word}|${stem}(?:a|e|i|o|u|om|em|ima|ama|og|oga|oj|ih|im|ovima|evima)?)`;
  });
  return new RegExp(`\\b${words.join("\\s+")}\\b`, "g");
};

const searchableCatalog = suggestionCatalog.map((item) => ({
  item,
  patterns: [...new Set([
    ...item.keywords,
    ...Object.values(item.title).filter((title): title is string => Boolean(title)),
  ].map(normalizeText))]
    .filter(Boolean)
    .map(keywordPattern),
}));

export const buildRightSuggestions = (
  assistantText: string,
  activeExperienceIds: ExperienceFilterId[] = [],
  userText = ""
): SuggestionsByCategory => {
  const suggestions = createEmptySuggestions();
  const activeExperienceIdSet = new Set(activeExperienceIds);
  const matchedIds = new Set<string>();

  // Evaluate messages separately so a phrase cannot span the question/answer boundary.
  for (const text of [userText, assistantText].map(normalizeText)) {
    const mentions = searchableCatalog.flatMap(({ item, patterns }) =>
      patterns.flatMap((pattern) =>
        Array.from(text.matchAll(pattern), (match) => ({
          item,
          start: match.index!,
          end: match.index! + match[0].length,
        }))
      )
    );
    for (const mention of mentions) {
      // A longer place name takes precedence over a name nested inside it.
      const nested = mention.item.categoryId === "poi" && mentions.some((other) =>
        other.item.categoryId === "poi" &&
        other.item.id !== mention.item.id &&
        other.start <= mention.start && other.end >= mention.end &&
        other.end - other.start > mention.end - mention.start
      );
      if (!nested) matchedIds.add(mention.item.id);
    }
  }

  for (const poi of poiById.values()) {
    if (matchedIds.has(poi.id)) {
      for (const routeId of poi.routeIds ?? []) matchedIds.add(routeId);
    }
  }

  const matchedItems = suggestionCatalog.filter((item) =>
    matchedIds.has(item.id) ||
    item.interestIds?.some((interestId) => activeExperienceIdSet.has(interestId))
  ).sort((a, b) => a.order - b.order);

  for (const categoryId of featuredCategoryIds) {
    suggestions[categoryId] = matchedItems.filter((item) => item.categoryId === categoryId);
  }
  return suggestions;
};
