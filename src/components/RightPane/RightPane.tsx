"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./RightPane.module.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

type RightPaneProps = {
  title?: string;
};

const filterLabels = ["Unesi odredište", "Unesi datum", "Unesi interesovanje"];

export default function RightPane({
  title = "AI asistent vam preporučuje",
}: RightPaneProps) {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.divider} />

      <div className={styles.filterHeader}>
        <p className={styles.filterLabel}>Aktivni filteri</p>

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