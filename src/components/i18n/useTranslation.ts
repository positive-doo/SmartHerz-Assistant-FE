"use client";

import { useLang } from "./LanguageProvider";
import { dictionary } from "./dictionary";

export function useTranslation() {
  const { lang } = useLang();

  const t = (key: string) => dictionary[lang][key] ?? key;

  return { t, lang };
}