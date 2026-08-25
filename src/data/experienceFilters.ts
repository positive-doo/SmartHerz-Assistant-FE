import type { Lang } from "@/components/i18n/LanguageProvider";
import type { LocalizedString } from "@/models/category";

export type ExperienceFilterId = string;
export const quizPersonaCodes = ["H", "T", "A", "G", "F"] as const;
export type QuizPersonaCode = (typeof quizPersonaCodes)[number];

export type ExperienceFilterNode = {
  id: ExperienceFilterId;
  label: LocalizedString;
  role?: LocalizedString;
  children?: ExperienceFilterNode[];
};

export const experienceFilterColumns: ExperienceFilterNode[][] = [
  [
    {
      id: "culture",
      label: { bh: "Kultura", en: "Culture" },
      role: { bh: "ISTRAŽIVAČ", en: "EXPLORER" },
      children: [
        {
          id: "historical_archaeological_heritage",
          label: {
            bh: "Istorijsko i arheološko naslijeđe",
            en: "Historical and archaeological heritage",
          },
        },
        {
          id: "religious_heritage",
          label: { bh: "Religijsko naslijeđe", en: "Religious heritage" },
        },
        {
          id: "museums_monuments_architecture",
          label: {
            bh: "Muzeji, spomenici i arhitektura",
            en: "Museums, monuments and architecture",
          },
        },
        { id: "stecak", label: { bh: "Stećci", en: "Stećci" } },
        {
          id: "cultural_routes",
          label: { bh: "Kulturne rute", en: "Cultural routes" },
        },
        {
          id: "folklore_old_crafts",
          label: { bh: "Folklor i stari zanati", en: "Folklore and old crafts" },
        },
        {
          id: "myths_legends_famous_people",
          label: {
            bh: "Mitovi, legende i poznate ličnosti",
            en: "Myths, legends and famous people",
          },
        },
      ],
    },
    {
      id: "gastronomy",
      label: { bh: "Gastronomija", en: "Gastronomy" },
      role: { bh: "GASTRO TURIST", en: "GASTRO TOURIST" },
      children: [
        {
          id: "traditional_dishes",
          label: { bh: "Tradicionalna jela", en: "Traditional dishes" },
        },
        {
          id: "wineries_tasting_rooms",
          label: {
            bh: "Vinarije i degustacione sale",
            en: "Wineries and tasting rooms",
          },
        },
        {
          id: "cheese_kaymak_honey_producers",
          label: {
            bh: "Proizvođači sira, kajmaka i meda",
            en: "Cheese, kaymak and honey producers",
          },
        },
        { id: "gastro_tours", label: { bh: "Gastro ture", en: "Gastro tours" } },
        {
          id: "slow_food_producers",
          label: { bh: "Slow Food proizvođači", en: "Slow Food producers" },
        },
      ],
    },
  ],
  [
    {
      id: "nature",
      label: { bh: "Priroda", en: "Nature" },
      role: { bh: "PLANINAR", en: "HIKER" },
      children: [
        {
          id: "mountains_viewpoints",
          label: { bh: "Planine i vidikovci", en: "Mountains and viewpoints" },
        },
        {
          id: "rivers_lakes_springs",
          label: { bh: "Rijeke, jezera i izvori", en: "Rivers, lakes and springs" },
        },
        {
          id: "protected_areas_caves",
          label: {
            bh: "Zaštićena područja i pećine",
            en: "Protected areas and caves",
          },
        },
        { id: "flora_fauna", label: { bh: "Flora i fauna", en: "Flora and fauna" } },
        {
          id: "medicinal_herbs_forest_fruits",
          label: {
            bh: "Ljekovito bilje i šumski plodovi",
            en: "Medicinal herbs and forest fruits",
          },
        },
      ],
    },
    {
      id: "adventure",
      label: { bh: "Avantura", en: "Adventure" },
      role: { bh: "AVANTURISTA", en: "ADVENTURER" },
      children: [
        { id: "hiking_trekking", label: { bh: "Hiking / trekking", en: "Hiking / trekking" } },
        { id: "cycling", label: { bh: "Biciklizam", en: "Cycling" } },
        {
          id: "kayak_canoe_boat",
          label: { bh: "Kajak, kanu i vožnja barkom", en: "Kayak, canoe and boat rides" },
        },
        {
          id: "climbing_via_ferrata",
          label: { bh: "Penjanje i via ferrata", en: "Climbing and via ferrata" },
        },
        { id: "paragliding", label: { bh: "Paraglajding", en: "Paragliding" } },
        {
          id: "outdoor_activities",
          label: { bh: "Outdoor aktivnosti", en: "Outdoor activities" },
        },
      ],
    },
  ],
  [
    {
      id: "family",
      label: { bh: "Porodica", en: "Family" },
      role: { bh: "PORODICA", en: "FAMILY" },
      children: [
        {
          id: "children_activities",
          label: { bh: "Aktivnosti za djecu", en: "Activities for children" },
        },
        {
          id: "family_trips",
          label: { bh: "Porodični izleti", en: "Family trips" },
        },
        {
          id: "play_relax_space",
          label: { bh: "Prostor za igru i opuštanje", en: "Play and relaxation spaces" },
        },
        {
          id: "family_friendly_content",
          label: {
            bh: "Sadržaji prilagođeni porodicama",
            en: "Family-friendly content",
          },
        },
      ],
    },
    {
      id: "other",
      label: { bh: "Ostalo", en: "Other" },
      children: [
        {
          id: "romantic_getaways",
          label: { bh: "Romantični odmori", en: "Romantic getaways" },
        },
        { id: "shopping", label: { bh: "Šoping", en: "Shopping" } },
        { id: "events_experience", label: { bh: "Događaji", en: "Events" } },
      ],
    },
  ],
];

export const getExperienceFilterDescendantIds = (
  item: ExperienceFilterNode
): ExperienceFilterId[] =>
  item.children?.flatMap((child) => [
    child.id,
    ...getExperienceFilterDescendantIds(child),
  ]) ?? [];

const getExperienceFilterAncestorIdsFromNodes = (
  nodes: ExperienceFilterNode[],
  id: ExperienceFilterId,
  path: ExperienceFilterId[] = []
): ExperienceFilterId[] => {
  for (const node of nodes) {
    if (node.id === id) {
      return path;
    }

    if (node.children) {
      const result = getExperienceFilterAncestorIdsFromNodes(node.children, id, [
        ...path,
        node.id,
      ]);

      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
};

export const getExperienceFilterAncestorIds = (id: ExperienceFilterId) =>
  getExperienceFilterAncestorIdsFromNodes(experienceFilterColumns.flat(), id);

const flattenExperienceFilters = (
  nodes: ExperienceFilterNode[]
): ExperienceFilterNode[] =>
  nodes.flatMap((node) => [
    node,
    ...(node.children ? flattenExperienceFilters(node.children) : []),
  ]);

export const experienceFilters = experienceFilterColumns.flatMap((column) =>
  flattenExperienceFilters(column)
);

export const getExperienceFilterById = (id: ExperienceFilterId) =>
  experienceFilters.find((item) => item.id === id);

export const getExperienceFilterLabel = (
  id: ExperienceFilterId,
  lang: Lang
) =>
  getExperienceFilterById(id)?.label[lang] ??
  getExperienceFilterById(id)?.label.bh ??
  id;

const quizPersonaExperienceFilterIds: Record<
  QuizPersonaCode,
  ExperienceFilterId
> = {
  H: "culture",
  T: "nature",
  A: "adventure",
  G: "gastronomy",
  F: "family",
};

export const isQuizPersonaCode = (
  value: string | null | undefined
): value is QuizPersonaCode =>
  quizPersonaCodes.includes(value as QuizPersonaCode);

export const getExperienceFilterIdForQuizPersona = (
  value: string | null | undefined
): ExperienceFilterId | null => {
  const normalizedValue = value?.trim().toUpperCase();

  if (!isQuizPersonaCode(normalizedValue)) {
    return null;
  }

  return quizPersonaExperienceFilterIds[normalizedValue];
};
