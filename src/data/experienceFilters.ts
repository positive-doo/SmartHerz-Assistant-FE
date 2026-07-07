import type { Lang } from "@/components/i18n/LanguageProvider";
import type { LocalizedString } from "@/models/category";

export type ExperienceFilterId = string;

export type ExperienceFilterNode = {
  id: ExperienceFilterId;
  label: LocalizedString;
  children?: ExperienceFilterNode[];
};

export const experienceFilterColumns: ExperienceFilterNode[][] = [
  [
    {
      id: "active_holidays",
      label: { bh: "Aktivni odmor", en: "Active holidays" },
      children: [
        {
          id: "hiking_mountaineering",
          label: { bh: "Planinarenje i alpinizam", en: "Hiking and Mountaineering" },
        },
        { id: "biking", label: { bh: "Biciklizam", en: "Biking" } },
        {
          id: "water_activities",
          label: { bh: "Aktivnosti na vodi", en: "Water activities" },
        },
        {
          id: "adrenaline_sports",
          label: { bh: "Adrenalinski sportovi", en: "Adrenaline sports" },
        },
        {
          id: "winter_activities",
          label: { bh: "Zimske aktivnosti", en: "Winter activities" },
        },
        { id: "horse_riding", label: { bh: "Jahanje", en: "Horse riding" } },
        { id: "golf", label: { bh: "Golf", en: "Golf" } },
      ],
    },
    {
      id: "spas_health_resorts",
      label: { bh: "Banje i wellness centri", en: "Spas and health resorts" },
      children: [
        { id: "health", label: { bh: "Zdravlje", en: "Health" } },
        {
          id: "pampering_treatment",
          label: { bh: "Njega i tretmani", en: "Pampering and treatment" },
        },
        {
          id: "spa_water_experiences",
          label: {
            bh: "Vodena iskustva u banjama",
            en: "Water experiences in spas",
          },
        },
      ],
    },
  ],
  [
    {
      id: "discover_nature",
      label: { bh: "Otkrij prirodu", en: "Discover nature" },
      children: [
        {
          id: "herzegovina_waters",
          label: { bh: "Vode Hercegovine", en: "Herzegovina's waters" },
        },
        {
          id: "nature_parks",
          label: { bh: "Parkovi prirode", en: "Nature parks" },
        },
        { id: "caves", label: { bh: "Pećine", en: "Caves" } },
        {
          id: "mountains_hills",
          label: { bh: "Planine i brda", en: "Mountains and hills" },
        },
        { id: "countryside", label: { bh: "Selo i priroda", en: "Countryside" } },
      ],
    },
    {
      id: "food_wine",
      label: { bh: "Hrana i vino", en: "Food and wine" },
      children: [
        {
          id: "flavours_herzegovina",
          label: { bh: "Ukusi Hercegovine", en: "The flavours of Herzegovina" },
        },
        {
          id: "wines_herzegovina",
          label: { bh: "Vina Hercegovine", en: "Wines of Herzegovina" },
        },
        { id: "where_to_eat", label: { bh: "Gdje jesti", en: "Where to eat" } },
        {
          id: "best_for_gourmets",
          label: { bh: "Najbolje za gurmane", en: "The best for gourmets" },
        },
        { id: "locally_typical", label: { bh: "Lokalno i tipično", en: "Locally typical" } },
      ],
    },
  ],
  [
    {
      id: "arts_culture",
      label: { bh: "Umjetnost i kultura", en: "Arts and Culture" },
    },
    { id: "shopping", label: { bh: "Kupovina", en: "Shopping" } },
    {
      id: "family_fun",
      label: { bh: "Porodična zabava", en: "Family fun" },
    },
    {
      id: "romantic_getaways",
      label: { bh: "Romantični odmori", en: "Romantic getaways" },
    },
    {
      id: "unique_experiences",
      label: {
        bh: "Jedinstvena iskustva Hercegovine",
        en: "Herzegovina Unique Experiences",
      },
    },
    { id: "events_experience", label: { bh: "Događaji", en: "Events" } },
    {
      id: "tour_guides",
      label: { bh: "Turistički vodiči", en: "Tour guides" },
    },
    {
      id: "sound_stories",
      label: {
        bh: "Zvučne priče iz Hercegovine",
        en: "Sound stories from Herzegovina",
      },
    },
  ],
];

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

export const getExperienceFilterLabel = (
  id: ExperienceFilterId,
  lang: Lang
) =>
  experienceFilters.find((item) => item.id === id)?.label[lang] ??
  experienceFilters.find((item) => item.id === id)?.label.bh ??
  id;
