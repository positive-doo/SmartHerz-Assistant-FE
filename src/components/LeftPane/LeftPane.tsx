"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./LeftPane.module.css";
import Tooltip from "@mui/material/Tooltip";

const MIC_ICON =
  "https://cybercompany.ai/wp-content/uploads/2026/05/MicIconfill2.svg";
const SEND_ICON =
  "https://cybercompany.ai/wp-content/uploads/2026/05/ArrowRightSquareFill.svg";
const USER_ICON =
  "https://cybercompany.ai/wp-content/uploads/2026/05/user_purple.svg";

type ChatMessage = {
  id: string;
  role: "user";
  text: string;
};

export default function LeftPane() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const hasText = message.trim().length > 0;
  const sendButtonTooltip = hasText
    ? "Pošalji poruku"
    : "Klikni da započneš snimanje";

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);

    setMessage("");
  };

  return (
    <div className={styles.root}>
      {/* Header gore levo */}
      <div className={styles.header}>
        <Image
          src="https://cybercompany.ai/wp-content/uploads/2026/05/smart-herz-logo-final.svg"
          alt="SmartHerz"
          width={180}
          height={60}
          priority
        />
      </div>

      {/* Pozadina (watermark) */}
      <div className={styles.background} aria-hidden="true" />

      {/* Donja zona */}
      <div className={styles.bottom}>
        <div className={styles.avatarWrap}>
          <Image
            src="https://cybercompany.ai/wp-content/uploads/2026/05/vodic-zena-herz.webp"
            alt="Assistant"
            width={240}
            height={280}
            priority
          />
        </div>
        <div className={styles.bottomContent}>
          {/* Bubble + mala ikonica */}
          <div className={styles.assistantBubbleWrap}>
            <div className={styles.assistantBubble}>
              <p className={styles.bubbleText}>
                Zdravo, <br />
                Ja sam tvoj virtuelni savetnik za istraživanje{" "}
                <b>Istočne Hercegovine</b>.
                <br />
                <br />
                Reci mi više o aktivnostima koje te zanimaju, koju destinaciju želiš
                da posetiš i kada planiraš putovanje.
                <br />
                Daću ti savete i preporuke koje će se prikazati na desnoj strani tvog
                ekrana.
              </p>
            </div>

            <div className={styles.bubbleAvatar}>
              <Image
                src="https://cybercompany.ai/wp-content/uploads/2026/05/herz-zenski-avatar-p.webp"
                alt="AI"
                width={30}
                height={30}
                priority
              />
            </div>
          </div>

          {/* ✅ User poruke */}
          {messages.map((m) => (
            <div key={m.id} className={styles.userRow}>
              <div className={styles.userBubbleWrap}> 
              <div className={styles.userBubble}>{m.text}</div>

              <div className={styles.userIcon}>
                <img src={USER_ICON} alt="User" width={26} height={26} />
              </div>
              </div>
            </div>
          ))}

          {/* Input */}
          <div className={styles.inputBlock}>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="Kako mogu da vam pomognem?"
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
                  className={`${styles.sendButton} ${hasText ? styles.sendButtonSend : styles.sendButtonMic}`}
                  aria-label={sendButtonTooltip}
                  type="button"
                  onClick={() => {
                    if (hasText) handleSend();
                    // else: ovde kasnije mic start
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
              Molimo vas da ne unosite lične podatke (ime, prezime, email, broj
              telefona itd.) u prozor za ćaskanje.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
