"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Lang = "bh" | "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlLang = (searchParams.get("lang") as Lang) || "bh";
  const [lang, setLangState] = useState<Lang>(urlLang === "en" ? "en" : "bh");

  // sync state if user manually changes URL
  useEffect(() => {
    const next = urlLang === "en" ? "en" : "bh";
    setLangState(next);
  }, [urlLang]);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);

    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}