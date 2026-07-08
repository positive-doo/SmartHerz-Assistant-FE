"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import type { ExperienceFilterId } from "@/data/experienceFilters";
import type { LocalizedString } from "@/models/category";

export type CategoryId = "pages" | "events" | "special_offers" | "poi" | "news";

export type Suggestion = {
  id: string;
  categoryId: CategoryId;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
};

export type SuggestionsByCategory = Record<CategoryId, Suggestion[]>;

export const createEmptySuggestions = (): SuggestionsByCategory => ({
  pages: [],
  events: [],
  special_offers: [],
  poi: [],
  news: [],
});

type AppUiState = {
  hasUserStarted: boolean;
  setHasUserStarted: (v: boolean) => void;
  isAssistantResponding: boolean;
  setIsAssistantResponding: (v: boolean) => void;

  dateRange: [Dayjs | null, Dayjs | null];
  setDateRange: (range: [Dayjs | null, Dayjs | null]) => void;

  activeCategoryIds: CategoryId[];
  toggleCategory: (id: CategoryId) => void;
  clearCategories: () => void;

  activeExperienceIds: ExperienceFilterId[];
  setActiveExperienceIds: React.Dispatch<
    React.SetStateAction<ExperienceFilterId[]>
  >;
  clearExperienceFilters: () => void;

  suggestionsByCategory: SuggestionsByCategory;
  setSuggestionsByCategory: (data: SuggestionsByCategory) => void;
};

const AppUiContext = createContext<AppUiState | null>(null);

export function AppUiProvider({ children }: { children: React.ReactNode }) {
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  // ✅ multi-select state
  const [activeCategoryIds, setActiveCategoryIds] = useState<CategoryId[]>([]);
  const [activeExperienceIds, setActiveExperienceIds] = useState<
    ExperienceFilterId[]
  >([]);

  // ✅ suggestions state (po kategoriji)
  const [suggestionsByCategory, setSuggestionsByCategory] =
    useState<SuggestionsByCategory>(createEmptySuggestions());

  const toggleCategory = (id: CategoryId) => {
    setActiveCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearCategories = () => setActiveCategoryIds([]);
  const clearExperienceFilters = () => setActiveExperienceIds([]);

  const value = useMemo(
    () => ({
      hasUserStarted,
      setHasUserStarted,
      isAssistantResponding,
      setIsAssistantResponding,
      dateRange,
      setDateRange,
      activeCategoryIds,
      toggleCategory,
      clearCategories,
      activeExperienceIds,
      setActiveExperienceIds,
      clearExperienceFilters,
      suggestionsByCategory,
      setSuggestionsByCategory,
    }),
    [
      hasUserStarted,
      isAssistantResponding,
      dateRange,
      activeCategoryIds,
      activeExperienceIds,
      suggestionsByCategory,
    ]
  );

  return <AppUiContext.Provider value={value}>{children}</AppUiContext.Provider>;
}

export function useAppUi() {
  const ctx = useContext(AppUiContext);
  if (!ctx) throw new Error("useAppUi must be used within AppUiProvider");
  return ctx;
}
