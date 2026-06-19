"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";

export type CategoryId = "pages" | "events" | "special_offers" | "poi" | "news";

export type Suggestion = {
  id: string;
  categoryId: CategoryId;
  title: string;
  description: string;
  imageUrl: string;
};

export type SuggestionsByCategory = Record<CategoryId, Suggestion[]>;

type AppUiState = {
  hasUserStarted: boolean;
  setHasUserStarted: (v: boolean) => void;

  dateRange: [Dayjs | null, Dayjs | null];
  setDateRange: (range: [Dayjs | null, Dayjs | null]) => void;

  activeCategoryIds: CategoryId[];
  toggleCategory: (id: CategoryId) => void;
  clearCategories: () => void;

  suggestionsByCategory: SuggestionsByCategory;
  setSuggestionsByCategory: (data: SuggestionsByCategory) => void;
};

const AppUiContext = createContext<AppUiState | null>(null);

export function AppUiProvider({ children }: { children: React.ReactNode }) {
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  // ✅ multi-select state
  const [activeCategoryIds, setActiveCategoryIds] = useState<CategoryId[]>([]);

  // ✅ suggestions state (po kategoriji)
  const [suggestionsByCategory, setSuggestionsByCategory] =
    useState<SuggestionsByCategory>({
      pages: [],
      events: [],
      special_offers: [],
      poi: [],
      news: [],
    });

  const toggleCategory = (id: CategoryId) => {
    setActiveCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearCategories = () => setActiveCategoryIds([]);

  const value = useMemo(
    () => ({
      hasUserStarted,
      setHasUserStarted,
      dateRange,
      setDateRange,
      activeCategoryIds,
      toggleCategory,
      clearCategories,
      suggestionsByCategory,
      setSuggestionsByCategory,
    }),
    [hasUserStarted, dateRange, activeCategoryIds, suggestionsByCategory]
  );

  return <AppUiContext.Provider value={value}>{children}</AppUiContext.Provider>;
}

export function useAppUi() {
  const ctx = useContext(AppUiContext);
  if (!ctx) throw new Error("useAppUi must be used within AppUiProvider");
  return ctx;
}
