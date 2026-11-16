import { FOOD_CATALOG, type FoodCatalogItem } from "@/data/foodCatalog";

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "dj", е: "e",
  ж: "z", з: "z", и: "i", ј: "j", к: "k", л: "l", љ: "lj",
  м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s",
  т: "t", ћ: "c", у: "u", ф: "f", х: "h", ц: "c", ч: "c",
  џ: "dz", ш: "s",
};

const normalize = (text: string): string => text
  .toLowerCase()
  .replace(/[а-яђјљњћџ]/g, (letter) => CYRILLIC_TO_LATIN[letter] ?? letter)
  .replace(/đ/g, "dj")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const matchers = FOOD_CATALOG.map((food) => ({
  food,
  aliases: [...new Set([
    food.title.bh,
    food.title.en,
    ...food.keywords,
  ].map(normalize))],
}));

/** Match visible dish names once each, in the order they occur in this reply. */
export const findFoodImages = (text: string): FoodCatalogItem[] => {
  const visibleText = text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/gi, "");
  const normalizedText = ` ${normalize(visibleText)} `;

  return matchers
    .map(({ food, aliases }) => ({
      food,
      firstMention: Math.min(...aliases.map((alias) => {
        const index = normalizedText.indexOf(` ${alias} `);
        return index === -1 ? Infinity : index;
      })),
    }))
    .filter(({ firstMention }) => Number.isFinite(firstMention))
    .sort((a, b) => a.firstMention - b.firstMention)
    .map(({ food }) => food);
};

const foodQuestionPatterns = [
  /\b(?:hran[aeiu]|hranom|jel[aoeu]|jelima|jelovnik[a-z]*|obro[kc][a-z]*|gastronom[a-z]*|kuhinj[aeiu]|kuhinjom|specijalitet[a-z]*|restoran[a-z]*|recept(?:a|u|om|i|e|ima)?|sastoj(?:ak|ka|ku|kom|ci|ke|cima)|namirnic[a-z]*)\b/,
  /\b(?:rucak|ruck[au]|ruckom|ruca|rucas|rucati|rucam[oa]?|rucate|rucaju|vecer[aeiu]|vecerom|vecerati|veceram[oa]?|vecerate|veceraju|dorucak|doruck[a-z]*|jesti|jede|jedes|jedem[oa]?|jedete|jedu)\b/,
  /\b(?:poslastic[a-z]*|desert[a-z]*|slatkis[a-z]*|ishran[a-z]*|prehran[a-z]*|vegetarijan[a-z]*|vegan[a-z]*)\b/,
  /\b(?:food|foods|dish|dishes|cuisine|cuisines|gastronomy|gastronomic|meal|meals|breakfast|brunch|lunch|dinner|supper|restaurant|restaurants|eat|eating|dine|dining|recipe|recipes|ingredient|ingredients|cook|cooking|dessert|desserts|vegetarian|vegan)\b/,
  /\b(?:local|traditional|regional) (?:specialties|specialities)\b/,
  /\b(?:kakvog je ukusa|kakav je ukus|how does it taste|what does it taste like)\b/,
];

/** Only the user's own question enables food photos, never incidental reply text or filters. */
export const isFoodQuestion = (question: string): boolean => {
  if (findFoodImages(question).length > 0) return true;

  const normalizedQuestion = normalize(question);
  return foodQuestionPatterns.some((pattern) => pattern.test(normalizedQuestion));
};
