"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import type { Dayjs } from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import styles from "./LeftPane.module.css";
import { useTranslation } from "../i18n/useTranslation";
import { useAppUi, type SuggestionsByCategory } from "@/state/AppUiContext";

const CHAT_API_BASE_URL = "http://localhost:8000";

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

const CHAT_ERROR_MESSAGE = "Doslo je do greske pri komunikaciji sa serverom.";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isFinal: boolean;
};

const createEmptySuggestions = (): SuggestionsByCategory => ({
  pages: [],
  events: [],
  special_offers: [],
  poi: [],
  news: [],
});

const extractStreamContent = (eventBlock: string): string | null => {
  const dataLines = eventBlock
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (dataLines.length === 0) {
    return null;
  }

  const rawData = dataLines.join("\n").trim();

  if (!rawData || rawData === "[DONE]") {
    return null;
  }

  try {
    const payload = JSON.parse(rawData) as { content?: unknown };
    return typeof payload.content === "string" ? payload.content : "";
  } catch (error) {
    console.error("Unable to parse SSE payload:", error);
    return null;
  }
};

const finalizeAssistantText = (text: string) => text.replace(/\u258C$/, "");

const buildMessageContent = (
  text: string,
  dateRange: [Dayjs | null, Dayjs | null]
) => {
  const [startDate, endDate] = dateRange;

  if (!startDate && !endDate) {
    return text;
  }

  const formattedStartDate = startDate?.format("DD.MM.YYYY");
  const formattedEndDate = endDate?.format("DD.MM.YYYY");

  if (formattedStartDate && formattedEndDate) {
    return `${text}\n\nDatum putovanja: od ${formattedStartDate} do ${formattedEndDate}.`;
  }

  if (formattedStartDate) {
    return `${text}\n\nDatum putovanja: od ${formattedStartDate}.`;
  }

  return `${text}\n\nDatum putovanja: do ${formattedEndDate}.`;
};

const getNextUrlStart = (text: string, cursor: number) => {
  const match = /https?:\/\/\S*/.exec(text.slice(cursor));
  return match ? cursor + match.index : -1;
};

const getUrlEnd = (text: string, startIndex: number) => {
  const nextWhitespaceIndex = text.slice(startIndex).search(/\s/);
  return nextWhitespaceIndex === -1
    ? text.length
    : startIndex + nextWhitespaceIndex;
};

const renderInlineFormattedText = (
  text: string,
  options?: { isStreaming?: boolean }
): ReactNode[] => {
  const formattedParts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  const isStreaming = options?.isStreaming ?? false;

  while (cursor < text.length) {
    const boldStart = text.indexOf("**", cursor);
    const linkStart = text.indexOf("[", cursor);
    const urlStart = isStreaming ? getNextUrlStart(text, cursor) : -1;

    const hasBold = boldStart !== -1;
    const hasLink = linkStart !== -1;
    const hasUrl = urlStart !== -1;

    if (!hasBold && !hasLink && !hasUrl) {
      formattedParts.push(text.slice(cursor));
      break;
    }

    const candidateStarts = [boldStart, linkStart, urlStart].filter(
      (value) => value !== -1
    );
    const nextTokenStart = Math.min(...candidateStarts);

    if (nextTokenStart > cursor) {
      formattedParts.push(text.slice(cursor, nextTokenStart));
    }

    if (nextTokenStart === urlStart) {
      cursor = getUrlEnd(text, urlStart);
      continue;
    }

    if (nextTokenStart === boldStart) {
      const boldEnd = text.indexOf("**", boldStart + 2);

      if (boldEnd === -1) {
        formattedParts.push(text.slice(boldStart));
        break;
      }

      formattedParts.push(
        <strong key={`bold-${key}`}>
          {text.slice(boldStart + 2, boldEnd)}
        </strong>
      );

      cursor = boldEnd + 2;
      key += 1;
      continue;
    }

    const linkLabelEnd = text.indexOf("]", linkStart + 1);

    if (linkLabelEnd === -1) {
      formattedParts.push(text.slice(linkStart + 1));
      break;
    }

    const linkLabel = text.slice(linkStart + 1, linkLabelEnd).trim();
    let linkUrlStart = linkLabelEnd + 1;

    while (linkUrlStart < text.length && /\s/.test(text[linkUrlStart])) {
      linkUrlStart += 1;
    }

    const hasOpeningParen = text[linkUrlStart] === "(";
    const linkUrlEnd =
      hasOpeningParen ? text.indexOf(")", linkUrlStart + 1) : -1;

    if (isStreaming && linkLabel) {
      if (!hasOpeningParen || linkUrlEnd === -1) {
        formattedParts.push(
          <span
            key={`link-pending-${key}`}
            className={styles.locationLinkPending}
          >
            <span>{linkLabel}</span>
            <LocationOnIcon className={styles.locationLinkIcon} />
          </span>
        );
        break;
      }
    }

    if (!hasOpeningParen) {
      formattedParts.push(text.slice(linkStart, linkLabelEnd + 1));
      cursor = linkLabelEnd + 1;
      continue;
    }

    if (linkUrlEnd === -1) {
      formattedParts.push(
        <span
          key={`link-pending-${key}`}
          className={styles.locationLinkPending}
        >
          <span>{linkLabel}</span>
          <LocationOnIcon className={styles.locationLinkIcon} />
        </span>
      );
      break;
    }

    const linkUrl = text.slice(linkUrlStart + 1, linkUrlEnd).trim();

    formattedParts.push(
      <a
        key={`link-${key}`}
        className={styles.locationLink}
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{linkLabel}</span>
        <LocationOnIcon className={styles.locationLinkIcon} />
      </a>
    );

    key += 1;
    cursor = linkUrlEnd + 1;
  }

  return formattedParts;
};

const renderFormattedText = (
  text: string,
  options?: { isStreaming?: boolean }
): ReactNode[] =>
  text.split("\n").reduce<ReactNode[]>((nodes, line, index, lines) => {
    if (line.trim() === "---") {
      nodes.push(
        <hr
          key={`rule-${index}`}
          className={styles.messageDivider}
          aria-hidden="true"
        />
      );
      return nodes;
    }

    let className = styles.formattedLine;
    let content = line;
    let isLargeHeading = false;

    if (line.startsWith("###")) {
      className = `${className} ${styles.headingMedium}`;
      content = line.replace(/^###\s*/, "");
    } else if (line.startsWith("##")) {
      className = `${className} ${styles.headingLarge}`;
      content = line.replace(/^##\s*/, "");
      isLargeHeading = true;
    }

    const previousMeaningfulLine = [...lines.slice(0, index)]
      .reverse()
      .find((candidate) => candidate.trim().length > 0) ?? "";
    const shouldRenderDivider =
      isLargeHeading &&
      previousMeaningfulLine.length > 0 &&
      previousMeaningfulLine.trim() !== "---";

    if (shouldRenderDivider) {
      nodes.push(
        <hr
          key={`divider-${index}`}
          className={styles.messageDivider}
          aria-hidden="true"
        />
      );
    }

    nodes.push(
      <span key={`line-${index}`} className={className}>
        {content ? renderInlineFormattedText(content, options) : "\u00A0"}
      </span>
    );

    return nodes;
  }, []);

export default function LeftPane() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const { t } = useTranslation();
  const hasText = message.trim().length > 0;
  const {
    hasUserStarted,
    dateRange,
    setHasUserStarted,
    setSuggestionsByCategory,
  } = useAppUi();

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("sessionId");

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      sessionStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const sendButtonTooltip = hasText ? t("sendButton") : t("recordButton");

  const ensureSessionId = () => {
    if (sessionId) {
      return sessionId;
    }

    const storedSessionId = sessionStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      return storedSessionId;
    }

    const newSessionId = uuidv4();
    sessionStorage.setItem("sessionId", newSessionId);
    setSessionId(newSessionId);
    return newSessionId;
  };

  const updateMessage = (messageId: string, text: string, isFinal: boolean) => {
    setMessages((prevMessages) =>
      prevMessages.map((item) =>
        item.id === messageId ? { ...item, text, isFinal } : item
      )
    );
  };

  const streamAssistantResponse = async (
    activeSessionId: string,
    assistantMessageId: string
  ) => {
    const abortController = new AbortController();
    streamAbortRef.current?.abort();
    streamAbortRef.current = abortController;

    const response = await fetch(`${CHAT_API_BASE_URL}/chat/stream`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        "Session-ID": activeSessionId,
      },
      credentials: "include",
      cache: "no-store",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Chat stream failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Chat stream response body is missing.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let latestContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const eventBlocks = buffer.split(/\r?\n\r?\n/);
        buffer = eventBlocks.pop() ?? "";

        for (const eventBlock of eventBlocks) {
          const content = extractStreamContent(eventBlock);

          if (content === null) {
            continue;
          }

          latestContent = content;
          updateMessage(assistantMessageId, content, false);
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        const content = extractStreamContent(buffer);
        if (content !== null) {
          latestContent = content;
        }
      }

      updateMessage(
        assistantMessageId,
        finalizeAssistantText(latestContent),
        true
      );
    } finally {
      reader.releaseLock();

      if (streamAbortRef.current === abortController) {
        streamAbortRef.current = null;
      }
    }
  };

  const handleSend = async () => {
    const text = message.trim();

    if (!text || isSending) {
      return;
    }

    const activeSessionId = ensureSessionId();
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    const messageContent = buildMessageContent(text, dateRange);

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: userMessageId, role: "user", text, isFinal: true },
      {
        id: assistantMessageId,
        role: "assistant",
        text: "",
        isFinal: false,
      },
    ]);
    setMessage("");
    setSuggestionsByCategory(createEmptySuggestions());

    if (!hasUserStarted) {
      setHasUserStarted(true);
    }

    setIsSending(true);

    try {
      const response = await fetch(`${CHAT_API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-ID": activeSessionId,
        },
        credentials: "include",
        body: JSON.stringify({
          message: {
            role: "user",
            content: messageContent,
          },
          play_audio_response: false,
          language: "sr",
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      await streamAssistantResponse(activeSessionId, assistantMessageId);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Chat request failed:", error);
      updateMessage(assistantMessageId, CHAT_ERROR_MESSAGE, true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Image src={LOGO} alt="SmartHerz" width={180} height={60} priority />
      </div>

      <div className={styles.background} aria-hidden="true" />

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
          <div
            className={styles.messages}
            aria-live="polite"
            aria-busy={isSending}
            ref={messagesRef}
          >
            <div className={styles.assistantBubbleWrap}>
              <div className={styles.assistantBubble}>
                <div className={styles.bubbleText}>{t("assistantIntro")}</div>
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

            {messages.map((chatMessage) => {
              if (chatMessage.role === "assistant") {
                const isTypingOnly =
                  !chatMessage.isFinal && chatMessage.text.trim().length === 0;

                return (
                  <div
                    key={chatMessage.id}
                    className={styles.assistantBubbleWrap}
                  >
                    <div
                      className={`${styles.assistantBubble} ${
                        !chatMessage.isFinal ? styles.assistantBubbleStreaming : ""
                      } ${
                        isTypingOnly ? styles.assistantBubbleTypingOnly : ""
                      }`}
                    >
                      <div className={styles.bubbleText}>
                        {chatMessage.text
                          ? renderFormattedText(chatMessage.text, {
                              isStreaming: !chatMessage.isFinal,
                            })
                          : null}
                        {isTypingOnly && (
                          <span className={styles.typingIndicator} aria-hidden="true">
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                            <span className={styles.typingDot} />
                          </span>
                        )}
                      </div>
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
                );
              }

              return (
                <div key={chatMessage.id} className={styles.userRow}>
                  <div className={styles.userBubbleWrap}>
                    <div className={styles.userBubble}>
                      {renderFormattedText(chatMessage.text)}
                    </div>

                    <div className={styles.userIcon}>
                      <img src={USER_AVATAR} alt="User" width={26} height={26} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
              <button
                className={`${styles.sendButton} ${
                  hasText ? styles.sendButtonSend : styles.sendButtonMic
                }`}
                aria-label={hasText ? "Send" : "Start recording"}
                aria-disabled={isSending}
                title={sendButtonTooltip}
                type="button"
                onClick={() => {
                  if (hasText && !isSending) {
                    handleSend();
                  }
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
            </div>

            <div className={styles.hint}>{t("hint")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
