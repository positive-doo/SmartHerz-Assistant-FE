"use client";

import React, {
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./PageLayout.module.css";
import { useAppUi } from "@/state/AppUiContext";

const MOBILE_PANEL_HINT_KEY = "smartherz-mobile-panel-hint-seen";
const MOBILE_SWIPE_THRESHOLD = 24;
const MOBILE_RECOMMENDATIONS_PREVIEW_MS = 5000;
const MOBILE_BREAKPOINT_QUERY = "(max-width: 900px)";

type MobilePanelPosition = "closed" | "half" | "open";

type PageLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function PageLayout({ left, right }: PageLayoutProps) {
  const { suggestionsByCategory } = useAppUi();
  const hasRecommendations = Object.values(suggestionsByCategory).some(
    (suggestions) => suggestions.length > 0
  );
  const [mobilePanelPosition, setMobilePanelPosition] =
    useState<MobilePanelPosition>("closed");
  const [showMobilePanelHint, setShowMobilePanelHint] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const mobilePanelPositionRef = useRef<MobilePanelPosition>("closed");
  const recommendationsPreviewTimeoutRef = useRef<number | null>(null);
  const isMobilePanelVisible = mobilePanelPosition !== "closed";
  const isMobilePanelOpen = mobilePanelPosition === "open";

  const updateMobilePanelPosition = useCallback(
    (position: MobilePanelPosition) => {
      mobilePanelPositionRef.current = position;
      setMobilePanelPosition(position);
    },
    []
  );

  const markMobilePanelHintSeen = useCallback(() => {
    setShowMobilePanelHint(false);

    try {
      sessionStorage.setItem(MOBILE_PANEL_HINT_KEY, "true");
    } catch {
      // The local state still dismisses the hint if storage is unavailable.
    }
  }, []);

  const clearRecommendationsPreviewTimer = useCallback(() => {
    if (recommendationsPreviewTimeoutRef.current !== null) {
      window.clearTimeout(recommendationsPreviewTimeoutRef.current);
      recommendationsPreviewTimeoutRef.current = null;
    }
  }, []);

  const openMobilePanel = () => {
    clearRecommendationsPreviewTimer();
    updateMobilePanelPosition("open");
    markMobilePanelHintSeen();
  };

  const closeMobilePanel = () => {
    clearRecommendationsPreviewTimer();
    updateMobilePanelPosition("closed");
    markMobilePanelHintSeen();
  };

  const handlePanelToggle = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }

    if (isMobilePanelOpen) {
      closeMobilePanel();
    } else {
      openMobilePanel();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    touchStartYRef.current = event.changedTouches[0]?.clientY ?? null;
    didSwipeRef.current = false;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY;
    touchStartYRef.current = null;

    if (startY === null || endY === undefined) {
      return;
    }

    const swipeDistance = startY - endY;
    if (Math.abs(swipeDistance) < MOBILE_SWIPE_THRESHOLD) {
      return;
    }

    didSwipeRef.current = true;
    window.setTimeout(() => {
      didSwipeRef.current = false;
    }, 0);

    if (swipeDistance > 0) {
      openMobilePanel();
    } else if (isMobilePanelVisible) {
      closeMobilePanel();
    }
  };

  useEffect(() => {
    try {
      setShowMobilePanelHint(
        sessionStorage.getItem(MOBILE_PANEL_HINT_KEY) !== "true"
      );
    } catch {
      setShowMobilePanelHint(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRecommendations) {
      return;
    }

    markMobilePanelHintSeen();

    if (!window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) {
      return;
    }

    if (mobilePanelPositionRef.current !== "open") {
      updateMobilePanelPosition("half");
      recommendationsPreviewTimeoutRef.current = window.setTimeout(() => {
        if (mobilePanelPositionRef.current === "half") {
          updateMobilePanelPosition("closed");
        }

        recommendationsPreviewTimeoutRef.current = null;
      }, MOBILE_RECOMMENDATIONS_PREVIEW_MS);
    }

  }, [
    hasRecommendations,
    markMobilePanelHintSeen,
    updateMobilePanelPosition,
  ]);

  useEffect(
    () => () => {
      clearRecommendationsPreviewTimer();
    },
    [clearRecommendationsPreviewTimer]
  );

  return (
    <main className={styles.root}>
      <section className={styles.left}>{left}</section>
      <aside
        className={`${styles.right} ${
          mobilePanelPosition === "half" ? styles.rightHalfOpen : ""
        } ${
          isMobilePanelOpen ? styles.rightOpen : ""
        }`}
        data-mobile-panel-state={mobilePanelPosition}
      >
        <button
          type="button"
          className={styles.mobileSectionHandle}
          aria-label={
            isMobilePanelOpen
              ? "Zatvori podešavanja i preporuke"
              : "Otvori podešavanja i preporuke"
          }
          aria-controls="recommendations-section"
          aria-expanded={isMobilePanelVisible}
          onClick={handlePanelToggle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span className={styles.mobileHandleBar} aria-hidden="true" />

          {mobilePanelPosition === "half" && (
            <span
              className={`${styles.mobileHandleCue} ${styles.mobileRecommendationsCue}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 38 44">
                <path d="M24 34V17a2.5 2.5 0 0 0-5 0v13l-2.5-3a2.5 2.5 0 0 0-4 2.5l6.5 10c1 1.6 2.8 2.5 4.7 2.5h4.8a6.5 6.5 0 0 0 6.5-6.5V27a2.5 2.5 0 0 0-5 0v-2.5a2.5 2.5 0 0 0-5 0V23a2.5 2.5 0 0 0-1-2" />
              </svg>
            </span>
          )}

          {showMobilePanelHint &&
            mobilePanelPosition === "closed" && (
              <span className={styles.mobileHandleCue} aria-hidden="true">
                <svg viewBox="0 0 34 42">
                  <path d="M17 32V15a2.5 2.5 0 0 0-5 0v13l-2.5-3a2.5 2.5 0 0 0-4 2.5l6.5 10c1 1.6 2.8 2.5 4.7 2.5h4.8a6.5 6.5 0 0 0 6.5-6.5V25a2.5 2.5 0 0 0-5 0v-2.5a2.5 2.5 0 0 0-5 0V21a2.5 2.5 0 0 0-1-2" />
                </svg>
              </span>
            )}
        </button>

        <div
          id="recommendations-section"
          role="region"
          className={`${styles.rightContent} ${
            isMobilePanelVisible ? styles.rightContentReady : ""
          }`}
          aria-labelledby="recommendations-heading"
        >
          {right}
        </div>
      </aside>
    </main>
  );
}
