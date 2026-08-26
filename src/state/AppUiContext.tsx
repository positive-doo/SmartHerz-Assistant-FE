"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import type { ExperienceFilterId } from "@/data/experienceFilters";
import {
  getExperienceFilterIdsForQuizContext,
  getQuizContextFromSearchParams,
  type QuizContext,
} from "@/data/quizContext";
import type { RegionSlug } from "@/data/regions";
import type { LocalizedString } from "@/models/category";

export type CategoryId = "pages" | "events" | "special_offers" | "poi" | "news";

export type Suggestion = {
  id: string;
  categoryId: CategoryId;
  title: LocalizedString;
  description: LocalizedString;
  imageUrl: string;
  municipalitySlug: RegionSlug;
};

export type SuggestionsByCategory = Record<CategoryId, Suggestion[]>;

export const createEmptySuggestions = (): SuggestionsByCategory => ({
  pages: [],
  events: [],
  special_offers: [],
  poi: [],
  news: [],
});

const getQuizContextFromLocation = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return getQuizContextFromSearchParams(
    new URLSearchParams(window.location.search)
  );
};

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

  selectedDestinationSlugs: RegionSlug[];
  setSelectedDestinationSlugs: React.Dispatch<
    React.SetStateAction<RegionSlug[]>
  >;
  clearDestinationFilters: () => void;

  activeExperienceIds: ExperienceFilterId[];
  setActiveExperienceIds: React.Dispatch<
    React.SetStateAction<ExperienceFilterId[]>
  >;
  clearExperienceFilters: () => void;

  quizContext: QuizContext | null;

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
  const [selectedDestinationSlugs, setSelectedDestinationSlugs] = useState<
    RegionSlug[]
  >([]);
  const [activeExperienceIds, setActiveExperienceIds] = useState<
    ExperienceFilterId[]
  >([]);
  const [quizContext, setQuizContext] = useState<QuizContext | null>(null);

  // ✅ suggestions state (po kategoriji)
  const [suggestionsByCategory, setSuggestionsByCategory] =
    useState<SuggestionsByCategory>(createEmptySuggestions());

  useEffect(() => {
    const syncQuizContext = () => {
      const nextQuizContext = getQuizContextFromLocation();

      setQuizContext(nextQuizContext);

      if (!nextQuizContext) {
        return;
      }

      const quizExperienceFilterIds =
        getExperienceFilterIdsForQuizContext(nextQuizContext);

      setActiveExperienceIds((prevIds) =>
        quizExperienceFilterIds.every((id) => prevIds.includes(id))
          ? prevIds
          : Array.from(new Set([...prevIds, ...quizExperienceFilterIds]))
      );
    };

    syncQuizContext();
    window.addEventListener("popstate", syncQuizContext);

    return () => {
      window.removeEventListener("popstate", syncQuizContext);
    };
  }, []);

  const toggleCategory = (id: CategoryId) => {
    setActiveCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearCategories = () => setActiveCategoryIds([]);
  const clearDestinationFilters = () => setSelectedDestinationSlugs([]);
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
      selectedDestinationSlugs,
      setSelectedDestinationSlugs,
      clearDestinationFilters,
      activeExperienceIds,
      setActiveExperienceIds,
      clearExperienceFilters,
      quizContext,
      suggestionsByCategory,
      setSuggestionsByCategory,
    }),
    [
      hasUserStarted,
      isAssistantResponding,
      dateRange,
      activeCategoryIds,
      selectedDestinationSlugs,
      activeExperienceIds,
      quizContext,
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
