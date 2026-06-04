import type { Lang } from "./LanguageProvider";

export const dictionary: Record<Lang, Record<string, string>> = {
  bh: {
    rightTitle: "AI asistent vam preporučuje",
    activeFilters: "Aktivni filteri",
    placeholder: "Kako mogu da vam pomognem?",
    recordTooltip: "Kliknite za snimanje",
    destination: "Unesi odredište",
    date: "Unesi datum",
    interest: "Unesi interesovanje",
    sendButton: "Pošalji poruku",
    recordButton: "Klikni da započneš snimanje",
    assistantIntro: "Zdravo, ja sam tvoj virtuelni savetnik za istraživanje Istočne Hercegovine. Reci mi više o aktivnostima koje te zanimaju, koju destinaciju želiš da posetiš i kada planiraš putovanje. Daću ti savete i preporuke koje će se prikazati na desnoj strani tvog ekrana.",
    hint: "Molimo vas da ne unosite lične podatke (ime, prezime, email, broj telefona, itd.) u prozor za ćaskanje.",
    categories: "Kategorije",
    pages: "Stranice",
    cat_events: "Događaji",
    cat_pages: "Stranice",
    clearFilters: "Ukloni filtere",
    viewMore: "Pogledaj više",
  },
  en: {
    rightTitle: "AI assistant recommends",
    activeFilters: "Active filters",
    placeholder: "How can I help you?",
    recordTooltip: "Click to record",
    destination: "Enter destination",
    date: "Enter date",
    interest: "Enter interest",
    sendButton: "Send message",
    recordButton: "Click to start recording",
    assistantIntro: "Hello, I'm your virtual assistant for exploring Eastern Herzegovina. Tell me more about the activities you're interested in, which destination you want to visit, and when you plan to travel. I'll provide you with tips and recommendations that will appear on the right side of your screen.",
    hint: "Please do not enter personal information (name, surname, email, phone number, etc.) in the chat window.",
    categories: "Categories",
    pages: "Pages",
    cat_events: "Events",
    cat_pages: "Pages",
    clearFilters: "Remove filters",
    viewMore: "View more",
  },
};

export function t(lang: Lang, key: string) {
  return dictionary[lang][key] ?? key;
}