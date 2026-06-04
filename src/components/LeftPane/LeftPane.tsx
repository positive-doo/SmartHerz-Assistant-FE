"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./LeftPane.module.css";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "../i18n/useTranslation";
import { useAppUi } from "@/state/AppUiContext";

const LOGO =
  "https://cybercompany.ai/wp-content/uploads/2026/05/smart-herz-logo-final.svg";

const ASSISTANT_AVATAR_BIG =
  "https://cybercompany.ai/wp-content/uploads/2026/05/vodic-zena-herz.webp";

const ASSISTANT_AVATAR_SMALL =
  "https://cybercompany.ai/wp-content/uploads/2026/05/herz-zenski-avatar-p.webp";

const USER_AVATAR =
  "https://cybercompany.ai/wp-content/uploads/2026/05/user_purple.svg";

const MIC_ICON =
  "https://cybercompany.ai/wp-content/uploads/2026/05/MicIconfill2.svg";

const SEND_ICON =
  "https://cybercompany.ai/wp-content/uploads/2026/05/ArrowRightSquareFill.svg";

type UserMessage = {
  id: string;
  text: string;
};

export default function LeftPane() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const { t } = useTranslation();
  const hasText = message.trim().length > 0;
  const {
    hasUserStarted,
    setHasUserStarted,
    setSuggestionsByCategory,
  } = useAppUi();

  const sendButtonTooltip = hasText
    ? t("sendButton")
    : t("recordButton");

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    setMessage("");

    if (!hasUserStarted) setHasUserStarted(true);

    // ✅ MOCK rezultat (kasnije zamenjuješ backendom)
    setSuggestionsByCategory({
      pages: [
        { id: "trebinje", categoryId: "pages", title: "Trebinje", description: "Kratak opis…", imageUrl: "/placeholders/trebinje.jpg" },
        { id: "bileca", categoryId: "pages", title: "Bileća", description: "Kratak opis…", imageUrl: "/placeholders/bileca.jpg" },
        { id: "gacko", categoryId: "pages", title: "Gacko", description: "Kratak opis…", imageUrl: "/placeholders/gacko.jpg" },
        { id: "nevesinje", categoryId: "pages", title: "Nevesinje", description: "Kratak opis…", imageUrl: "/placeholders/nevesinje.jpg" },
        { id: "pages_more", categoryId: "pages", title: "Još", description: "…", imageUrl: "/placeholders/trebinje.jpg" },
      ],
      events: [
        { id: "event1", categoryId: "events", title: "Događaj 1", description: "Kratak opis…", imageUrl: "/placeholders/event.jpg" },
        { id: "event2", categoryId: "events", title: "Događaj 2", description: "Kratak opis…", imageUrl: "/placeholders/event.jpg" },
      ],
      special_offers: [
        { id: "offer1", categoryId: "special_offers", title: "Ponuda 1", description: "Kratak opis…", imageUrl: "/placeholders/offer.jpg" },
      ],
      poi: [
        { id: "poi1", categoryId: "poi", title: "POI 1", description: "Kratak opis…", imageUrl: "/placeholders/poi.jpg" },
      ],
      news: [
        { id: "news1", categoryId: "news", title: "Vijest 1", description: "Kratak opis…", imageUrl: "/placeholders/news.jpg" },
      ],
    });
  };

  return (
    <div className={styles.root}>
      {/* Header gore levo */}
      <div className={styles.header}>
        <Image src={LOGO} alt="SmartHerz" width={180} height={60} priority />
      </div>

      {/* Pozadina */}
      <div className={styles.background} aria-hidden="true" />

      {/* Donja zona */}
      <div className={styles.bottom}>
        <div className={styles.avatarWrap}>
          <Image
            src={ASSISTANT_AVATAR_BIG}
            alt="Assistant"
            width={240}
            height={280}
            priority
          />
        </div>

        <div className={styles.bottomContent}>
          {/* Poruke (assistant + user) */}
          <div className={styles.messages}>
            {/* Assistant bubble */}
            <div className={styles.assistantBubbleWrap}>
              <div className={styles.assistantBubble}>
                <p className={styles.bubbleText}>
                  {t("assistantIntro")}
                </p>
              </div>

              <div className={styles.bubbleAvatar}>
                <Image
                  src={ASSISTANT_AVATAR_SMALL}
                  alt="AI"
                  width={30}
                  height={30}
                  priority
                />
              </div>
            </div>

            {/* User poruke */}
            {messages.map((m) => (
              <div key={m.id} className={styles.userRow}>
                <div className={styles.userBubbleWrap}>
                  <div className={styles.userBubble}>{m.text}</div>

                  <div className={styles.userIcon}>
                    <img src={USER_AVATAR} alt="User" width={26} height={26} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className={styles.inputBlock}>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                type="text"
                placeholder={t("placeholder")}
                aria-label="Message input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Tooltip title={sendButtonTooltip}>
              <button
                className={`${styles.sendButton} ${
                  hasText ? styles.sendButtonSend : styles.sendButtonMic
                }`}
                aria-label={hasText ? "Send" : "Start recording"}
                type="button"
                onClick={() => {
                  if (hasText) handleSend();
                }}
              >
                <img
                  className={hasText ? styles.sendImg : styles.micImg}
                  src={hasText ? SEND_ICON : MIC_ICON}
                  alt=""
                  width={25}
                  height={25}
                />
              </button>
              </Tooltip>
            </div>

            <div className={styles.hint}>
              {t("hint")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}