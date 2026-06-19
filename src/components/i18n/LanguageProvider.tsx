"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

export type Lang = "bh" | "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const resolveLang = (value: string | null | undefined): Lang =>
  value === "en" ? "en" : "bh";

const getLangFromLocation = (): Lang => {
  if (typeof window === "undefined") {
    return "bh";
  }

  return resolveLang(new URLSearchParams(window.location.search).get("lang"));
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bh");

  useEffect(() => {
    const syncLangFromUrl = () => {
      setLangState(getLangFromLocation());
    };

    syncLangFromUrl();
    window.addEventListener("popstate", syncLangFromUrl);

    return () => {
      window.removeEventListener("popstate", syncLangFromUrl);
    };
  }, []);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);

    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("lang", nextLang);
    window.history.replaceState(
      window.history.state,
      "",
      `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
    );
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
