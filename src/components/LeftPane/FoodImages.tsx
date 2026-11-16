"use client";

import { useId, useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import type { FoodCatalogItem } from "@/data/foodCatalog";
import { findFoodImages } from "@/utils/findFoodImages";
import { useTranslation } from "../i18n/useTranslation";
import styles from "./LeftPane.module.css";

export function FoodImages({ text }: { text: string }) {
  const { lang } = useTranslation();
  const foods = useMemo(() => findFoodImages(text), [text]);
  const [failedImageIds, setFailedImageIds] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodCatalogItem | null>(null);
  const photoTitleId = useId();
  const visibleFoods = foods.filter((food) => !failedImageIds.includes(food.id));

  if (visibleFoods.length === 0) return null;

  return (
    <div className={styles.foodGallery}>
      {visibleFoods.map((food) => (
        <figure className={styles.foodFigure} key={food.id}>
          <button
            type="button"
            className={styles.foodImageButton}
            aria-label={`${lang === "en" ? "Enlarge photo" : "Uvećaj fotografiju"}: ${food.title[lang]}`}
            aria-haspopup="dialog"
            onClick={() => setSelectedFood(food)}
          >
            <img
              className={styles.foodImage}
              src={food.imageUrl}
              alt={food.title[lang]}
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
              onError={() => setFailedImageIds((ids) => [...ids, food.id])}
            />
          </button>
          <figcaption className={styles.foodCaption}>
            {food.title[lang]}
          </figcaption>
        </figure>
      ))}
      <Dialog
        open={selectedFood !== null}
        onClose={() => setSelectedFood(null)}
        aria-labelledby={photoTitleId}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            margin: 2,
            width: "calc(100% - 32px)",
            maxHeight: "calc(100% - 32px)",
            borderRadius: 3,
            backgroundColor: "#171219",
            color: "#fff",
          },
          "& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.85)" },
        }}
      >
        {selectedFood && (
          <>
            <div className={styles.foodLightboxToolbar}>
              <span id={photoTitleId}>{selectedFood.title[lang]}</span>
              <button
                type="button"
                className={styles.foodLightboxClose}
                aria-label={lang === "en" ? "Close photo" : "Zatvori fotografiju"}
                onClick={() => setSelectedFood(null)}
                autoFocus
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <img
              className={styles.foodLightboxImage}
              src={selectedFood.imageUrl}
              alt={selectedFood.title[lang]}
            />
          </>
        )}
      </Dialog>
    </div>
  );
}
