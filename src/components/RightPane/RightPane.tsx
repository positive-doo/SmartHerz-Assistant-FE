"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from "./RightPane.module.css";
import { useLang } from "@/components/i18n/LanguageProvider";
import { useTranslation } from "@/components/i18n/useTranslation";
import { useAppUi } from "@/state/AppUiContext";

import { categories } from "@/data/categories";
import type { Category } from "@/models/category";
import type { CategoryId, Suggestion } from "@/state/AppUiContext";

type RightPaneProps = {
  title?: string;
};

export default function RightPane({ title }: RightPaneProps) {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();

  const {
    hasUserStarted,
    activeCategoryIds,
    toggleCategory,
    clearCategories,
    suggestionsByCategory,
  } = useAppUi();

  const [showFilterPills, setShowFilterPills] = useState(true);
  const [showCategoryPills, setShowCategoryPills] = useState(true);
  const filterLabels = [t("destination"), t("date"), t("interest")];
  const sortedCategories = useMemo(
    () => categories.slice().sort((a, b) => a.order - b.order),
    []
  );

  const allCategoryIds = useMemo(
    () => sortedCategories.map((c) => c.id as CategoryId),
    [sortedCategories]
  );

  const visibleCategoryIds: CategoryId[] =
    activeCategoryIds.length > 0 ? activeCategoryIds : allCategoryIds;

  const getCategoryLabel = (c: Category) => c.label[lang] ?? c.label.bh ?? c.id;

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
          onClick={() => setShowFilterPills((v) => !v)}
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
          {filterLabels.map((label) => (
            <FilterPill key={label} label={label} />
          ))}
        </div>
      )}

      {hasUserStarted && (
        <>
          <div className={styles.scrollArea}>
          <div className={styles.sectionHeaderRow}>
            <span className={styles.filterLabel}>{t("categories")}</span>

            <button
              type="button"
              className={styles.eyeButton}
              aria-label="Toggle category pills"
              onClick={() => setShowCategoryPills((v) => !v)}
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
              {sortedCategories.map((c) => {
                const id = c.id as CategoryId;
                const isActive = activeCategoryIds.includes(id);

                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                    onClick={() => toggleCategory(id)}
                  >
                    {getCategoryLabel(c)}
                  </button>
                );
              })}

              {activeCategoryIds.length > 0 && (
                <button
                  type="button"
                  className={`${styles.categoryChip} ${styles.clearChip}`}
                  onClick={clearCategories}
                >
                  <span className={styles.clearChipX}>×</span>
                  {t("clearFilters")}
                </button>
              )}
            </div>
          )}

          {visibleCategoryIds.map((catId) => {
            const list: Suggestion[] = suggestionsByCategory[catId] ?? [];
            if (list.length === 0) return null;

            const preview = list.slice(0, 4);
            const hasMore = list.length > 4;

            const catLabel =
              categories.find((c) => c.id === catId)?.label[lang] ??
              categories.find((c) => c.id === catId)?.label.bh ??
              (catId as string);

            return (
              <div key={catId} className={styles.categoryBlock}>
                <div className={styles.categoryBlockTitle}>{catLabel as string}</div>

                <div className={styles.cards}>
                  {preview.map((p: Suggestion) => (
                    <div key={p.id} className={styles.card}>
                      <div className={styles.cardImageWrap}>
                        <img className={styles.cardImage} src={p.imageUrl} alt="" />
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardTitle}>{p.title}</div>
                        <div className={styles.cardText}>{p.description}</div>
                      </div>
                    </div>
                  ))}

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
        </>
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