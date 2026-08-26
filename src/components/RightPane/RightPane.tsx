"use client";

import {
  type KeyboardEvent,
  useMemo,
  useState,
} from "react";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import styles from "./RightPane.module.css";
import { useLang, type Lang } from "@/components/i18n/LanguageProvider";
import { useTranslation } from "@/components/i18n/useTranslation";
import { categories } from "@/data/categories";
import {
  experienceFilterColumns,
  getExperienceFilterAncestorIds,
  getExperienceFilterDescendantIds,
  getExperienceFilterById,
  getExperienceFilterLabel,
  type ExperienceFilterId,
  type ExperienceFilterNode,
} from "@/data/experienceFilters";
import {
  REGION_ENTRIES,
  REGION_NAMES,
  REGION_PATHS,
  type RegionSlug,
} from "@/data/regions";
import type { Category } from "@/models/category";
import type {
  CategoryId,
  Suggestion,
  SuggestionsByCategory,
} from "@/state/AppUiContext";
import { useAppUi } from "@/state/AppUiContext";
import { getPublicAssetPath } from "@/utils/getPublicAssetPath";
import DateFilterPill from "../DateFilterPill/DateFilterPill";

type RightPaneProps = {
  title?: string;
};

type RegionState = "active" | "hovered" | "idle";

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
    selectedDestinationSlugs,
    setSelectedDestinationSlugs,
    clearDestinationFilters,
    activeExperienceIds,
    setActiveExperienceIds,
    clearExperienceFilters,
    suggestionsByCategory,
  } = useAppUi();

  const [showFilterPills, setShowFilterPills] = useState(true);
  const [showCategoryPills, setShowCategoryPills] = useState(true);
  const [isExperienceFilterOpen, setIsExperienceFilterOpen] = useState(false);
  const [isDestinationFilterOpen, setIsDestinationFilterOpen] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<RegionSlug | null>(null);
  const [draftExperienceIds, setDraftExperienceIds] = useState<
    ExperienceFilterId[]
  >([]);
  const selectedSlugSet = useMemo(
    () => new Set(selectedDestinationSlugs),
    [selectedDestinationSlugs]
  );

  const hasDateFilter = Boolean(dateRange[0] || dateRange[1]);
  const hasExperienceFilter = activeExperienceIds.length > 0;
  const hasDestinationFilter = selectedDestinationSlugs.length > 0;
  const hasAnyTopFilter =
    hasDateFilter || hasExperienceFilter || hasDestinationFilter;

  const sortedCategories = useMemo(
    () => categories.slice().sort((a, b) => a.order - b.order),
    []
  );

  const filteredSuggestionsByCategory = useMemo<SuggestionsByCategory>(() => {
    if (selectedDestinationSlugs.length === 0) {
      return suggestionsByCategory;
    }

    return Object.fromEntries(
      Object.entries(suggestionsByCategory).map(([categoryId, list]) => [
        categoryId,
        list.filter((destination) =>
          selectedSlugSet.has(destination.municipalitySlug)
        ),
      ])
    ) as SuggestionsByCategory;
  }, [selectedDestinationSlugs.length, selectedSlugSet, suggestionsByCategory]);

  const availableCategories = useMemo(
    () =>
      sortedCategories.filter(
        (category) =>
          (filteredSuggestionsByCategory[category.id as CategoryId] ?? [])
            .length > 0
      ),
    [filteredSuggestionsByCategory, sortedCategories]
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

  const openExperienceFilter = () => {
    setDraftExperienceIds(activeExperienceIds);
    setIsExperienceFilterOpen(true);
  };

  const closeExperienceFilter = () => {
    setActiveExperienceIds(draftExperienceIds);
    setIsExperienceFilterOpen(false);
  };

  const openDestinationFilter = () => {
    setIsDestinationFilterOpen(true);
  };

  const closeDestinationFilter = () => {
    setHoveredSlug(null);
    setIsDestinationFilterOpen(false);
  };

  const toggleSelect = (slug: RegionSlug) => {
    setSelectedDestinationSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((selectedSlug) => selectedSlug !== slug)
        : [...prev, slug]
    );
  };

  const removeDestinationFilter = (slug: RegionSlug) => {
    setSelectedDestinationSlugs((prev) =>
      prev.filter((selectedSlug) => selectedSlug !== slug)
    );
  };

  const getRegionState = (slug: RegionSlug): RegionState => {
    if (selectedSlugSet.has(slug)) return "active";
    if (hoveredSlug === slug) return "hovered";

    return "idle";
  };

  const clearRegionHover = () => {
    setHoveredSlug(null);
  };

  const handleRegionKeyDown = (
    event: KeyboardEvent<SVGPathElement>,
    slug: RegionSlug
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSelect(slug);
    }
  };

  const syncParentExperienceIds = (
    ids: ExperienceFilterId[],
    changedId: ExperienceFilterId
  ) => {
    const nextSet = new Set(ids);

    getExperienceFilterAncestorIds(changedId)
      .map(getExperienceFilterById)
      .filter((ancestor): ancestor is ExperienceFilterNode => Boolean(ancestor))
      .reverse()
      .forEach((ancestor) => {
        const descendantIds = getExperienceFilterDescendantIds(ancestor);
        const hasAllDescendants = descendantIds.every((id) => nextSet.has(id));

        if (hasAllDescendants) {
          nextSet.add(ancestor.id);
        } else {
          nextSet.delete(ancestor.id);
        }
      });

    return Array.from(nextSet);
  };

  const toggleDraftExperience = (item: ExperienceFilterNode) => {
    const groupIds = [item.id, ...getExperienceFilterDescendantIds(item)];

    setDraftExperienceIds((prev) => {
      const shouldRemove = groupIds.every((id) => prev.includes(id));

      if (shouldRemove) {
        return syncParentExperienceIds(
          prev.filter((id) => !groupIds.includes(id)),
          item.id
        );
      }

      return syncParentExperienceIds(
        Array.from(new Set([...prev, ...groupIds])),
        item.id
      );
    });
  };

  const removeExperienceFilter = (id: ExperienceFilterId) => {
    const item = getExperienceFilterById(id);
    const idsToRemove = item
      ? [item.id, ...getExperienceFilterDescendantIds(item)]
      : [id];

    setActiveExperienceIds((prev) =>
      syncParentExperienceIds(
        prev.filter((itemId) => !idsToRemove.includes(itemId)),
        id
      )
    );
  };

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
            <img src={getPublicAssetPath("/BH.png")} alt="BH" width={26} height={26} />
          </button>

          <button
            type="button"
            className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`}
            onClick={() => setLang("en")}
            aria-label="English"
            title="English"
          >
            <img src={getPublicAssetPath("/EN.png")} alt="EN" width={26} height={26} />
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
        <>
          <div className={styles.filters}>
            <FilterPill
              label={t("destination")}
              activeCount={selectedDestinationSlugs.length}
              onClick={openDestinationFilter}
            />

            <DateFilterPill
              label={t("date")}
              value={dateRange}
              onChange={setDateRange}
            />

            <FilterPill
              label={t("interest")}
              activeCount={activeExperienceIds.length}
              onClick={openExperienceFilter}
            />

            {hasAnyTopFilter && (
              <button
                type="button"
                className={`${styles.pill} ${styles.clearTopChip}`}
                onClick={() => {
                  setDateRange([null, null]);
                  clearDestinationFilters();
                  clearExperienceFilters();
                }}
              >
                <span className={styles.clearChipX}>&times;</span>
                {t("clearFilters")}
              </button>
            )}
          </div>

          {(hasDestinationFilter || hasExperienceFilter) && (
            <div className={styles.appliedFilters} aria-label={t("selectedFilters")}>
              {REGION_ENTRIES.filter(([slug]) => selectedSlugSet.has(slug)).map(
                ([slug, name]) => (
                  <button
                    key={slug}
                    type="button"
                    className={styles.appliedFilterChip}
                    onClick={() => removeDestinationFilter(slug)}
                    aria-label={`${t("removeFilter")} ${name}`}
                  >
                    <span>{name}</span>
                    <span className={styles.clearChipX} aria-hidden="true">
                      &times;
                    </span>
                  </button>
                )
              )}

              {activeExperienceIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={styles.appliedFilterChip}
                  onClick={() => removeExperienceFilter(id)}
                  aria-label={`${t("removeFilter")} ${getExperienceFilterLabel(id, lang)}`}
                >
                  <span>{getExperienceFilterLabel(id, lang)}</span>
                  <span className={styles.clearChipX} aria-hidden="true">
                    &times;
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
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
            const list: Suggestion[] =
              filteredSuggestionsByCategory[categoryId] ?? [];
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

      {isDestinationFilterOpen && (
        <DestinationFilterOverlay
          selectedSlugs={selectedSlugSet}
          hoveredSlug={hoveredSlug}
          getRegionState={getRegionState}
          onHover={setHoveredSlug}
          onClearHover={clearRegionHover}
          onToggle={toggleSelect}
          onRegionKeyDown={handleRegionKeyDown}
          onClose={closeDestinationFilter}
        />
      )}

      {isExperienceFilterOpen && (
        <ExperienceFilterOverlay
          draftIds={draftExperienceIds}
          onToggle={toggleDraftExperience}
          onClose={closeExperienceFilter}
        />
      )}
    </div>
  );
}

function DestinationFilterOverlay({
  selectedSlugs,
  hoveredSlug,
  getRegionState,
  onHover,
  onClearHover,
  onToggle,
  onRegionKeyDown,
  onClose,
}: {
  selectedSlugs: Set<RegionSlug>;
  hoveredSlug: RegionSlug | null;
  getRegionState: (slug: RegionSlug) => RegionState;
  onHover: (slug: RegionSlug) => void;
  onClearHover: () => void;
  onToggle: (slug: RegionSlug) => void;
  onRegionKeyDown: (
    event: KeyboardEvent<SVGPathElement>,
    slug: RegionSlug
  ) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  const getRegionPathClassName = (state: RegionState) =>
    `${styles.regionPath} ${
      state === "active"
        ? styles.regionPathActive
        : state === "hovered"
          ? styles.regionPathHovered
          : ""
    }`;

  const getRegionPillClassName = (state: RegionState) =>
    `${styles.regionPill} ${
      state === "active"
        ? styles.regionPillActive
        : state === "hovered"
          ? styles.regionPillHovered
          : ""
    }`;

  return (
    <div
      className={styles.experienceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-filter-title"
    >
      <div className={styles.experiencePanel}>
        <header className={styles.experienceHeader}>
          <h2 id="destination-filter-title" className={styles.experienceTitle}>
            {t("destinationsTitle")}
          </h2>
        </header>

        <div className={styles.destinationGrid}>
          <div className={styles.mapShell}>
            <svg
              id="sh-map-svg"
              className={styles.regionMap}
              viewBox="0 0 380 620"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label={t("destinationsTitle")}
            >
              {REGION_ENTRIES.map(([slug]) => {
                const state = getRegionState(slug);

                return (
                  <path
                    key={slug}
                    id={`path-${slug}`}
                    className={getRegionPathClassName(state)}
                    data-slug={slug}
                    d={REGION_PATHS[slug]}
                    onMouseEnter={() => onHover(slug)}
                    onMouseLeave={onClearHover}
                    onFocus={() => onHover(slug)}
                    onBlur={onClearHover}
                    onClick={() => onToggle(slug)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedSlugs.has(slug)}
                    aria-label={REGION_NAMES[slug]}
                    onKeyDown={(event) => onRegionKeyDown(event, slug)}
                  />
                );
              })}
            </svg>
          </div>

          <div className={styles.regionList}>
            {REGION_ENTRIES.map(([slug, name]) => {
              const state = getRegionState(slug);

              return (
                <button
                  key={slug}
                  type="button"
                  className={getRegionPillClassName(state)}
                  onMouseEnter={() => onHover(slug)}
                  onMouseLeave={onClearHover}
                  onFocus={() => onHover(slug)}
                  onBlur={onClearHover}
                  onClick={() => onToggle(slug)}
                  aria-pressed={selectedSlugs.has(slug)}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.experienceFooter}>
          <button
            type="button"
            className={styles.closeFilterButton}
            onClick={onClose}
          >
            {t("closeFilter")}
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  activeCount,
  onClick,
}: {
  label: string;
  activeCount?: number;
  onClick?: () => void;
}) {
  return (
    <button className={styles.pill} type="button" onClick={onClick}>
      <AddIcon className={styles.pillIcon} />
      <span>{label}</span>
      {Boolean(activeCount) && (
        <span className={styles.pillBadge}>{activeCount}</span>
      )}
    </button>
  );
}

function ExperienceFilterOverlay({
  draftIds,
  onToggle,
  onClose,
}: {
  draftIds: ExperienceFilterId[];
  onToggle: (item: ExperienceFilterNode) => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const { t } = useTranslation();

  return (
    <div
      className={styles.experienceOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="experience-filter-title"
    >
      <div className={styles.experiencePanel}>
        <header className={styles.experienceHeader}>
          <h2 id="experience-filter-title" className={styles.experienceTitle}>
            {t("experiencesTitle")}
          </h2>
        </header>

        <div className={styles.experienceGrid}>
          {experienceFilterColumns.map((column, index) => (
            <div className={styles.experienceColumn} key={`column-${index}`}>
              {column.map((item) => (
                <ExperienceCheckboxGroup
                  key={item.id}
                  item={item}
                  lang={lang}
                  selectedIds={draftIds}
                  onToggle={onToggle}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.experienceFooter}>
          <button
            type="button"
            className={styles.closeFilterButton}
            onClick={onClose}
          >
            {t("closeFilter")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExperienceCheckboxGroup({
  item,
  lang,
  selectedIds,
  onToggle,
  nested = false,
}: {
  item: ExperienceFilterNode;
  lang: Lang;
  selectedIds: ExperienceFilterId[];
  onToggle: (item: ExperienceFilterNode) => void;
  nested?: boolean;
}) {
  const label = item.label[lang] ?? item.label.bh ?? item.id;
  const role = item.role?.[lang] ?? item.role?.bh;
  const isSelected = selectedIds.includes(item.id);

  return (
    <div
      className={`${styles.experienceGroup} ${
        nested ? styles.experienceGroupNested : ""
      }`}
    >
      <label
        className={`${styles.experienceOption} ${
          nested ? styles.experienceOptionNested : styles.experienceOptionRoot
        }`}
      >
        <input
          className={styles.experienceCheckbox}
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(item)}
        />
        <span>{label}</span>
        {role && <span className={styles.experienceRole}>{role}</span>}
      </label>

      {item.children && (
        <div className={styles.experienceChildren}>
          {item.children.map((child) => (
            <ExperienceCheckboxGroup
              key={child.id}
              item={child}
              lang={lang}
              selectedIds={selectedIds}
              onToggle={onToggle}
              nested
            />
          ))}
        </div>
      )}
    </div>
  );
}
