import type { LocalizedString } from "@/models/category";
import type {
  CategoryId,
  Suggestion,
  SuggestionsByCategory,
} from "@/state/AppUiContext";
import { createEmptySuggestions } from "@/state/AppUiContext";
import { getPublicAssetPath } from "@/utils/getPublicAssetPath";
import type { ExperienceFilterId } from "@/data/experienceFilters";

type SuggestionCatalogItem = Suggestion & {
  keywords: string[];
  interestIds?: ExperienceFilterId[];
  order: number;
};

const withFallback = (bh: string, en: string): LocalizedString => ({
  bh,
  en,
});

const DESTINATION_URLS = {
  trebinje: "https://smart-herz.modoos.rs/destinacije/trebinje",
  bileca: "https://smart-herz.modoos.rs/destinacije/bileca",
  kalinovik: "https://smart-herz.modoos.rs/destinacije/kalinovik",
  berkovici: "https://smart-herz.modoos.rs/destinacije/berkovici",
} as const;

const suggestionCatalog: SuggestionCatalogItem[] = [
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
    id: "page-monasteries",
    categoryId: "pages",
    title: withFallback("Manastir Tvrdoš", "Tvrdoš Monastery"),
    description: withFallback(
      "Manastir Tvrdoš je najstariji živi manastir u današnjoj Hercegovini. Nalazi se na oko 270 m nadmorske visine, a njegova crkva je na vrhu stijene, koja se nekad u okomitim stepenicama spuštala prema dvadesetak metara nižoj Trebišnjici. Danas taj istaknuti položaj nije tako upadljiv zbog zgrada koje su zaklonile litice s južne strane. Sa zapadne i istočne strane također su bile strme padine, te se samo sa sjevera moglo jednostavno prići crkvi.",
      "Tvrdoš Monastery is the oldest active monastery in present-day Herzegovina. It stands at about 270 meters above sea level, and its church sits on top of a rock that once descended in steep steps toward the Trebišnjica River, around twenty meters below. Today, that prominent position is less striking because buildings have screened the cliffs on the southern side. There were also steep slopes on the western and eastern sides, so the church could be approached easily only from the north."
    ),
    imageUrl: getPublicAssetPath("/images/manastir-tvrdos.png"),
    municipalitySlug: "trebinje",
    url: DESTINATION_URLS.trebinje,
    keywords: ["manastir tvrdos", "manastir tvrdoš", "tvrdos", "tvrdoš", "trebinje"],
    order: 2,
  },
  {
    id: "poi-trebisnjica",
    categoryId: "poi",
    title: withFallback("Trebišnjica", "Trebišnjica River"),
    description: withFallback(
      "Trebišnjica, jedna od rijetkih ponornica koja protiče kroz gradsko jezgro, daje Trebinju poseban šarm. Duž njenih obala prostiru se uređeno šetalište i veslačka staza, dok je vožnja čamcem rijekom jedan od doživljaja koji posjetioci najčešće izdvajaju kao uspomenu na boravak u gradu.", 
      "The Trebišnjica, one of the few sinking rivers that flows through a city center, gives Trebinje a unique charm. Along its banks stretch a beautifully landscaped promenade and a rowing course, while a boat ride on the river is one of the experiences visitors most often highlight as a lasting memory of their stay in the city."),
    imageUrl: getPublicAssetPath("/images/trebisnjica.png"),
    municipalitySlug: "trebinje",
    url: DESTINATION_URLS.trebinje,
    keywords: ["trebisnjica", "rijeka trebisnjica", "trebišnjica", "trebišnjicu", "trebišnjice", "trebinje"],
    order: 1,
  },
  {
    id: "poi-vinarije-andjelic-vukoje",
    categoryId: "poi",
    title: withFallback(
      "Vinarije Anđelić i Vukoje",
      "Anđelić and Vukoje wineries"
    ),
    description: withFallback(
      "Trebinje je jedan od najznačajnijih vinogradarskih centara Hercegovine, područje u kojem se tradicija uzgoja vinove loze prenosi generacijama. Poznate vinarije, poput Anđelić i Vukoje, otvaraju svoja vrata posjetiocima kroz vođene obilaske i degustacije vrhunskih vina.",
      "Trebinje is one of Herzegovina’s most important wine-growing regions, where the tradition of viticulture has been passed down through generations. Renowned wineries such as Anđelić and Vukoje welcome visitors with guided tours and tastings of premium local wines."
    ),
    imageUrl: getPublicAssetPath("/images/vinarije-trebinje.png"),
    municipalitySlug: "trebinje",
    url: DESTINATION_URLS.trebinje,
    keywords: [
      "vinarije andjelic i vukoje",
      "vinarija andjelic",
      "vinarija vukoje",
      "andjelic",
      "vinarije",
      "vinariji",
      "anđelić",
      "vukoje",
      "trebinje"
    ],
    order: 2,
  },
  {
    id: "poi-hercegovacka-gracanica",
    categoryId: "poi",
    title: withFallback("Hercegovačka Gračanica", "Herzegovinian Gračanica"),
    description: withFallback(
      "Hram Blagoveštenja, Hercegovačka Gračanica uzdiže se iznad Trebinja, nudeći zadivljujući pogled, spokojno manastirsko okruženje te spoj duhovnosti, istorije i arhitekture.", 
      "The Church of the Annunciation at Hercegovačka Gračanica rises above Trebinje, offering breathtaking views, a peaceful monastic setting, and a unique blend of spirituality, history, and architecture."),
    imageUrl: getPublicAssetPath("/images/gracanica.png"),
    municipalitySlug: "trebinje",
    url: DESTINATION_URLS.trebinje,
    keywords: [
      "hercegovacka gracanica",
      "hercegovačka gračanica",
      "gracanica",
      "gračanica",
    ],
    order: 3,
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
    id: "poi-bilecko-jezero",
    categoryId: "poi",
    title: withFallback("Bilećko jezero", "Bileća Lake"),
    description: withFallback(
      "Jedna od najvećih vještačkih akumulacija na Balkanu – 18 km dužine, 104 m dubine, kristalno čista voda. Na dnu jezera leže potopljena sela i jedno od najvećih arheoloških nalazišta iz doba Rimskog carstva na Balkanu – tiha istorija koja čeka da bude ispričana.",
      "One of the largest artificial lakes in the Balkans, Lake Bileća stretches for 18 kilometers and reaches depths of up to 104 meters, with remarkably clear waters. Beneath the surface lie submerged villages and one of the Balkans’ largest archaeological sites from the Roman era — a silent piece of history waiting to be discovered."
    ),
    imageUrl: getPublicAssetPath("/images/bilecko-jezero.png"),
    municipalitySlug: "bileca",
    url: DESTINATION_URLS.bileca,
    keywords: ["bilecko jezero", "bilećko jezero"],
    order: 4,
  },
  {
    id: "poi-manastir-dobricevo",
    categoryId: "poi",
    title: withFallback("Manastir Dobrićevo", "Dobrićevo Monastery"),
    description: withFallback(
      "Srpski pravoslavni manastir iz 13. vijeka, nacionalni spomenik BiH. Tri puta spaljen, tri puta obnovljen. Godine 1967. fizički premješten da ne bude potopljen — u konzervatorskom poduhvatu koji je realizovan uz podršku Stanfordskog univerziteta.",
      "A 13th-century Serbian Orthodox monastery and a National Monument of Bosnia and Herzegovina. Burned down three times and rebuilt three times, it was physically relocated in 1967 to save it from being submerged — a remarkable conservation effort carried out with support from Stanford University."
    ),
    imageUrl: getPublicAssetPath("/images/manastir-dobricevo.png"),
    municipalitySlug: "bileca",
    url: DESTINATION_URLS.bileca,
    keywords: ["manastir dobricevo", "dobricevo", "dobrićevo"],
    order: 5,
  },
  {
    id: "poi-tvrdjava-drakuljica",
    categoryId: "poi",
    title: withFallback("Tvrđava Drakuljica", "Drakuljica Fortress"),
    description: withFallback(
      "Austro-ugarska vojna tvrđava iznad Bilećkog jezera – jedna od osam koje su nadgledale grad. Odavde se pruža najljepši panoramski pogled na cijelo jezero i okolne planine.",
      "An Austro-Hungarian military fortress overlooking Lake Bileća, one of eight that once guarded the town. From here, visitors can enjoy some of the finest panoramic views of the lake and the surrounding mountains."
    ),
    imageUrl: getPublicAssetPath("/images/tvrdjava-drakuljica.png"),
    municipalitySlug: "bileca",
    url: DESTINATION_URLS.bileca,
    keywords: ["tvrdjava drakuljica", "tvrđava drakuljica", "drakuljica"],
    order: 6,
  },
  {
    id: "poi-bileca-nekropola-stecaka",
    categoryId: "poi",
    title: withFallback("Nekropola stećaka", "Stećak Necropolis"),
    description: withFallback(
      "Na listi UNESCO svjetske baštine. Najveća vještačka nekropola srednjovjekovnih nadgrobnih spomenika na Balkanu, nastala 1967. da spasi stećke od potapanja jezera. Na UNESCO listi od 2016. Kameni jezik jedne civilizacije.",
      "Listed as a UNESCO World Heritage Site, this is the largest man-made necropolis of medieval tombstones in the Balkans. It was created in 1967 to preserve the stećci from being submerged by the lake and has been on the UNESCO list since 2016. A stone language of a vanished civilization."
    ),
    imageUrl: getPublicAssetPath("/images/nekropola.png"),
    municipalitySlug: "bileca",
    url: DESTINATION_URLS.bileca,
    keywords: [
      "nekropola stecaka",
      "nekropola stećaka",
      "bileca nekropola",
      "bileća nekropola",
      "nekropola bileca",
    ],
    order: 7,
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
    id: "poi-zelengora-gorske-oci",
    categoryId: "poi",
    title: withFallback(
      "Zelengora – jezera Gorske oči",
      "Zelengora – Gorske oči lakes"
    ),
    description: withFallback(
      "Mnogi je smatraju najljepšom planinom u BiH. Glacijalna jezera (Orlovačko, Kladopoljsko, Borilovačko/Jugovo, Štirinsko, Kotlaničko, Crvanjsko), crnogorična i listopadna šuma, bogati pašnjaci i klisure. Najviši vrh Bregoč, 2.014 m.",
      "Considered by many to be one of the most beautiful mountains in Bosnia and Herzegovina, Zelengora is known for its glacial lakes, including Orlovačko, Kladopoljsko, Borilovačko (Jugovo), Štirinsko, Kotlaničko, and Crvanjsko. Its landscape combines coniferous and deciduous forests, rich mountain pastures, and dramatic gorges. Its highest peak, Bregoč, rises to 2,014 meters."
    ),
    imageUrl: getPublicAssetPath("/images/jezera-gorske-oci.png"),
    municipalitySlug: "kalinovik",
    url: DESTINATION_URLS.kalinovik,
    keywords: ["zelengora", "jezera gorske oci", "gorske oči", "gorske oci"],
    order: 8,
  },
  {
    id: "poi-nekropole-cengica-bara-gvozno",
    categoryId: "poi",
    title: withFallback(
      "Nekropole stećaka Čengića Bara i Gvozno",
      "Čengića Bara and Gvozno stećak necropolises"
    ),
    description: withFallback(
      "Čengića bara (11 km jugozapadno, 1.370 m n.v.): 52 stećka, 19 ukrašenih, motivima mača, štita i lova na jelene, natpis o Stojanu Opodinoviću. Gvozno (11 km sjeverozapadno, Treskavica): 87 stećaka, jedinstveni prikaz krilatih zmajeva. Dio transnacionalne UNESCO liste stećaka.",
      "Čengića Bara (11 km southwest, 1,370 m above sea level): 52 stećci, 19 of them decorated with motifs of swords, shields, and deer hunting, as well as an inscription mentioning Stojan Opodinović. Gvozno (11 km northwest, on Treskavica): 87 stećci, including a unique depiction of winged dragons. Both sites are part of the transnational UNESCO World Heritage listing of stećci."
    ),
    imageUrl: getPublicAssetPath("/images/nekropola-cengica-bara.png"),
    municipalitySlug: "kalinovik",
    url: DESTINATION_URLS.kalinovik,
    keywords: ["cengica bara", "čengića bara", "gvozno"],
    order: 9,
  },
  {
    id: "poi-via-dinarica-kalinovik",
    categoryId: "poi",
    title: withFallback("Via Dinarica", "Via Dinarica"),
    description: withFallback(
      "Kalinovik leži na glavnoj planinarskoj liniji Dinarida (334 km u BiH). Planinarski put “Dr Jovo Elčić” (2013) povezuje Treskavicu, Leliju i Zelengoru kroz 15 kontrolnih tačaka. PSD “Lelija” markiralo je oko 150 km staza – organizovane ture moguće uz licencirane vodiče.",
      "Kalinovik lies along the main hiking route through the Dinaric Alps, which stretches for 334 km across Bosnia and Herzegovina. The “Dr Jovo Elčić” hiking trail, established in 2013, connects Treskavica, Lelija, and Zelengora through 15 checkpoints. The PSD “Lelija” mountaineering club has marked around 150 km of trails, and guided tours can be arranged with licensed mountain guides."
    ),
    imageUrl: getPublicAssetPath("/images/via-dinarica-kalinovik.png"),
    municipalitySlug: "kalinovik",
    url: DESTINATION_URLS.kalinovik,
    keywords: ["via dinarica"],
    order: 10,
  },
  {
    id: "poi-pecina-kuk",
    categoryId: "poi",
    title: withFallback("Pećina Kuk", "Kuk Cave"),
    description: withFallback(
      "Jedna od tri najljepše pećine u Republici Srpskoj, na Sijeračkim stijenama u kanjonu rijeke Bistrice. Značajan paleontološki lokalitet — pronađeni ostaci pećinskog medvjeda starosti 36.000–40.000 godina. Pod zaštitom Zavoda za zaštitu kulturno-istorijskog i prirodnog nasljeđa RS.",
      "Considered one of the three most beautiful caves in Republika Srpska, this cave is located in the Sijeračke Cliffs in the canyon of the Bistrica River. It is also an important paleontological site, where remains of a cave bear dating back 36,000–40,000 years were discovered. The site is protected by the Institute for the Protection of Cultural, Historical and Natural Heritage of Republika Srpska."
    ),
    imageUrl: getPublicAssetPath("/images/pecina-kuk.png"),
    municipalitySlug: "kalinovik",
    url: DESTINATION_URLS.kalinovik,
    keywords: ["pecina kuk", "pećina kuk"],
    order: 11,
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
    id: "poi-stari-grad-kostun",
    categoryId: "poi",
    title: withFallback("Stari grad Koštun", "Koštun Old Town"),
    description: withFallback(
      "Nacionalni spomenik BiH. Ranovizantijsko utvrđenje iz VI vijeka, izgrađeno u doba cara Justinijana I u selu Dabrica. Nacionalni spomenik BiH od 2004. Ostaci keramike iz bronzanog i željeznog doba pronađeni unutar zidina — jedan od najstarijih gradova na ovom prostoru.",
      "A National Monument of Bosnia and Herzegovina. This 6th-century Early Byzantine fortress, located in the village of Dabrica, was built during the reign of Emperor Justinian I. It has been protected as a national monument since 2004. Remains of Bronze and Iron Age pottery found within its walls suggest that it is one of the oldest settlements in the area."
    ),
    imageUrl: getPublicAssetPath("/images/stari-grad-kostun.png"),
    municipalitySlug: "berkovici",
    url: DESTINATION_URLS.berkovici,
    keywords: ["stari grad kostun", "stari grad koštun", "kostun", "koštun"],
    order: 12,
  },
  {
    id: "poi-nekropola-potkuk",
    categoryId: "poi",
    title: withFallback("Nekropola stećaka Potkuk", "Potkuk Stećak Necropolis"),
    description: withFallback(
      "Nekropola Potkuk u selu Bitunja upisana je 2016. godine na UNESCO Listu svjetske kulturne baštine. Autentičan ambijent i očuvani stećci različitih oblika čine je najznačajnijim kulturnim lokalitetom opštine. Praktično svako selo u opštini posjeduje sopstvenu nekropolu.",
      "The Potkuk Necropolis in the village of Bitunja was inscribed on the UNESCO World Heritage List in 2016. Its authentic setting and well-preserved stećci of various shapes make it the municipality’s most important cultural site. Almost every village in the area has its own stećci necropolis."
    ),
    imageUrl: getPublicAssetPath("/images/nekropola-potkuk.png"),
    municipalitySlug: "berkovici",
    url: DESTINATION_URLS.berkovici,
    keywords: ["nekropola stecaka potkuk", "nekropola stećaka potkuk", "potkuk"],
    order: 13,
  },
  {
    id: "poi-paraglajding-trusina",
    categoryId: "poi",
    title: withFallback(
      "Paraglajding poletište Trusina",
      "Trusina paragliding take-off site"
    ),
    description: withFallback(
      "Prema ocjenama pilota, jedno od tri najbolja paraglajding poletišta u Bosni i Hercegovini. Povoljan položaj terena i vazdušna strujanja omogućavaju dugačke panoramske letove iznad hercegovačkog krša. Radno vrijeme: po vremenskim uslovima.",
      "According to experienced pilots, this is one of the top three paragliding launch sites in Bosnia and Herzegovina. Its favorable terrain and air currents allow for long panoramic flights over the Herzegovinian karst landscape. Operating hours depend on weather conditions."
    ),
    imageUrl: getPublicAssetPath("/images/paraglajdin-poletiste-trusina.png"),
    municipalitySlug: "berkovici",
    url: DESTINATION_URLS.berkovici,
    keywords: [
      "paraglajding poletiste trusina",
      "paraglajding poletište trusina",
      "poletiste trusina",
      "trusina",
    ],
    order: 14,
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
    url: "https://smart-herz.modoos.rs/tematske-rute/staza-ukusa-istocna-hercegovina",
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
    url: "https://smart-herz.modoos.rs/tematske-rute/price-uklesane-u-kamenu/",
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
    url: "https://smart-herz.modoos.rs/tematske-rute/izmedu-planina-i-neba/",
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
];

const featuredCategoryIds: CategoryId[] = ["pages", "poi", "thematic_routes"];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const sortByOrder = (a: SuggestionCatalogItem, b: SuggestionCatalogItem) =>
  a.order - b.order;

export const buildRightSuggestions = (
  assistantText: string,
  activeExperienceIds: ExperienceFilterId[] = [],
  userText = ""
): SuggestionsByCategory => {
  const suggestions = createEmptySuggestions();
  const normalizedText = normalizeText(`${userText}\n${assistantText}`);
  const activeExperienceIdSet = new Set(activeExperienceIds);

  if (!normalizedText.trim() && activeExperienceIdSet.size === 0) {
    return suggestions;
  }

  const matchedItems = suggestionCatalog
    .filter((item) => {
      const matchesAssistantText = item.keywords.some((keyword) =>
        normalizedText.includes(normalizeText(keyword))
      );
      const matchesInterest = item.interestIds?.some((interestId) =>
        activeExperienceIdSet.has(interestId)
      );

      return matchesAssistantText || matchesInterest;
    })
    .sort(sortByOrder);

  for (const categoryId of featuredCategoryIds) {
    suggestions[categoryId] = matchedItems.filter(
      (item) => item.categoryId === categoryId
    );
  }

  return suggestions;
};
