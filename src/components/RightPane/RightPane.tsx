"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import styles from "./RightPane.module.css";
import { useLang } from "@/components/i18n/LanguageProvider";
import { useTranslation } from "@/components/i18n/useTranslation";
import { categories } from "@/data/categories";
import type { Category } from "@/models/category";
import type { CategoryId, Suggestion } from "@/state/AppUiContext";
import { useAppUi } from "@/state/AppUiContext";
import DateFilterPill from "../DateFilterPill/DateFilterPill";

type RightPaneProps = {
  title?: string;
};

export default function RightPane({ title }: RightPaneProps) {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();
  const {
    hasUserStarted,
    isAssistantResponding,
    dateRange,
    setDateRange,
    activeCategoryIds,
    toggleCategory,
    clearCategories,
    suggestionsByCategory,
  } = useAppUi();

  const hasDateFilter = Boolean(dateRange[0] || dateRange[1]);
  const hasAnyTopFilter = hasDateFilter;
  const [showFilterPills, setShowFilterPills] = useState(true);
  const [showCategoryPills, setShowCategoryPills] = useState(true);
  const filterLabels = [t("destination"), t("date"), t("interest")];

  const sortedCategories = useMemo(
    () => categories.slice().sort((a, b) => a.order - b.order),
    []
  );

  const availableCategories = useMemo(
    () =>
      sortedCategories.filter(
        (category) =>
          (suggestionsByCategory[category.id as CategoryId] ?? []).length > 0
      ),
    [sortedCategories, suggestionsByCategory]
  );

  const availableCategoryIds = useMemo(
    () => availableCategories.map((category) => category.id as CategoryId),
    [availableCategories]
  );

  const selectedCategoryIds = activeCategoryIds.filter((categoryId) =>
    availableCategoryIds.includes(categoryId)
  );

  const visibleCategoryIds: CategoryId[] =
    selectedCategoryIds.length > 0 ? selectedCategoryIds : availableCategoryIds;
  const hasVisibleSuggestions = visibleCategoryIds.length > 0;
  const recommendationsLoadingLabel =
    lang === "en" ? "Preparing recommendations" : "Pripremam preporuke";

  const getCategoryLabel = (category: Category) =>
    category.label[lang] ?? category.label.bh ?? category.id;

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{title ?? t("rightTitle")}</h2>

        <div className={styles.langSwitch}>
          <button
            type="button"
            className={`${styles.langBtn} ${lang === "bh" ? styles.langBtnActive : ""}`}
            onClick={() => setLang("bh")}
            aria-label="Bosanski"
            title="Bosanski"
          >
            <img src="/BH.png" alt="BH" width={26} height={26} />
          </button>

          <button
            type="button"
            className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`}
            onClick={() => setLang("en")}
            aria-label="English"
            title="English"
          >
            <img src="/EN.png" alt="EN" width={26} height={26} />
          </button>
        </div>
      </div>

      <div className={styles.divider} />
      <div className={styles.filterHeader}>
        <p className={styles.filterLabel}>{t("activeFilters")}</p>

        <button
          type="button"
          className={styles.eyeButton}
          aria-label="Toggle filter pills"
          onClick={() => setShowFilterPills((value) => !value)}
        >
          {showFilterPills ? (
            <VisibilityOffOutlinedIcon className={styles.eyeIcon} />
          ) : (
            <VisibilityOutlinedIcon className={styles.eyeIcon} />
          )}
        </button>
      </div>

      {showFilterPills && (
        <div className={styles.filters}>
          {filterLabels.map((label) =>
            label === t("date") ? (
              <DateFilterPill
                key={label}
                label={label}
                value={dateRange}
                onChange={setDateRange}
              />
            ) : (
              <FilterPill key={label} label={label} />
            )
          )}

          {hasAnyTopFilter && (
            <button
              type="button"
              className={`${styles.pill} ${styles.clearTopChip}`}
              onClick={() => {
                setDateRange([null, null]);
              }}
            >
              <span className={styles.clearChipX}>&times;</span>
              {t("clearFilters")}
            </button>
          )}
        </div>
      )}

      {hasUserStarted && (
        <div className={styles.scrollArea}>
          <div className={styles.sectionHeaderRow}>
            <span className={styles.filterLabel}>{t("categories")}</span>

            <button
              type="button"
              className={styles.eyeButton}
              aria-label="Toggle category pills"
              onClick={() => setShowCategoryPills((value) => !value)}
            >
              {showCategoryPills ? (
                <VisibilityOffOutlinedIcon className={styles.eyeIcon} />
              ) : (
                <VisibilityOutlinedIcon className={styles.eyeIcon} />
              )}
            </button>
          </div>

          {showCategoryPills && (
            <div className={styles.categoryChips}>
              {availableCategories.map((category) => {
                const id = category.id as CategoryId;
                const isActive = selectedCategoryIds.includes(id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                    onClick={() => toggleCategory(id)}
                  >
                    {getCategoryLabel(category)}
                  </button>
                );
              })}

              {selectedCategoryIds.length > 0 && (
                <button
                  type="button"
                  className={`${styles.categoryChip} ${styles.clearChip}`}
                  onClick={clearCategories}
                >
                  <span className={styles.clearChipX}>&times;</span>
                  {t("clearFilters")}
                </button>
              )}
            </div>
          )}

          {isAssistantResponding && (
            <>
              <div
                className={`${styles.loadingState} ${
                  hasVisibleSuggestions ? styles.loadingStateCompact : ""
                }`}
                role="status"
                aria-live="polite"
              >
                <span className={styles.loadingPulse} aria-hidden="true" />
                <div className={styles.loadingCopy}>
                  <div className={styles.loadingTitle}>
                    {recommendationsLoadingLabel}
                  </div>
                </div>
              </div>

              {!hasVisibleSuggestions && (
                <div className={styles.loadingCards} aria-hidden="true">
                  {[0, 1].map((index) => (
                    <div key={index} className={styles.loadingCard}>
                      <div className={styles.loadingThumb} />
                      <div className={styles.loadingBody}>
                        <div className={`${styles.loadingLine} ${styles.loadingLineShort}`} />
                        <div className={styles.loadingLine} />
                        <div className={`${styles.loadingLine} ${styles.loadingLineShort}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {visibleCategoryIds.map((categoryId) => {
            const list: Suggestion[] = suggestionsByCategory[categoryId] ?? [];
            if (list.length === 0) {
              return null;
            }

            const preview = list.slice(0, 4);
            const hasMore = list.length > 4;
            const categoryLabel =
              categories.find((category) => category.id === categoryId)?.label[lang] ??
              categories.find((category) => category.id === categoryId)?.label.bh ??
              categoryId;

            return (
              <div key={categoryId} className={styles.categoryBlock}>
                <div className={styles.categoryBlockTitle}>
                  {categoryLabel as string}
                </div>

                <div className={styles.cards}>
                  {preview.map((suggestion) => {
                    const cardTitle =
                      suggestion.title[lang] ?? suggestion.title.bh ?? suggestion.id;
                    const cardDescription =
                      suggestion.description[lang] ??
                      suggestion.description.bh ??
                      "";

                    return (
                      <div key={suggestion.id} className={styles.card}>
                        <div className={styles.cardImageWrap}>
                          <img
                            className={styles.cardImage}
                            src={suggestion.imageUrl}
                            alt={cardTitle}
                          />
                        </div>

                        <div className={styles.cardBody}>
                          <div className={styles.cardTitle}>{cardTitle}</div>
                          <div className={styles.cardText}>{cardDescription}</div>
                        </div>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <button type="button" className={styles.readMoreBtn}>
                      <span className={styles.readMoreText}>{t("viewMore")}</span>
                      <span className={styles.readMoreIcon}>
                        <KeyboardArrowRightIcon />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className={styles.pill} type="button">
      <AddIcon className={styles.pillIcon} />
      <span>{label}</span>
    </button>
  );
}
