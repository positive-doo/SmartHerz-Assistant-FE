"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import styles from "./RightPane.module.css";
import { useLang } from "@/components/i18n/LanguageProvider";
import { useTranslation } from "@/components/i18n/useTranslation";

type RightPaneProps = {
  title?: string;
};

export default function RightPane({ title }: RightPaneProps) {
  const { t } = useTranslation();
  const { lang, setLang } = useLang();

  const [showFilters, setShowFilters] = useState(true);

  const filterLabels = [t("destination"), t("date"), t("interest")];

  return (
    <div className={styles.root}>
      {/* Title row + language switch */}
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

      {/* Filters header + eye toggle */}
      <div className={styles.filterHeader}>
        <p className={styles.filterLabel}>{t("activeFilters")}</p>

        <button
          type="button"
          className={styles.eyeButton}
          aria-label="Toggle filters"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? (
            <VisibilityOffOutlinedIcon className={styles.eyeIcon} />
          ) : (
            <VisibilityOutlinedIcon className={styles.eyeIcon} />
          )}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filters}>
          {filterLabels.map((label) => (
            <FilterPill key={label} label={label} />
          ))}
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