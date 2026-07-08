"use client";

import { type ChangeEvent, type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import type { Dayjs } from "dayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import styles from "./LeftPane.module.css";
import { useTranslation } from "../i18n/useTranslation";
import {
  AssistantFeedback,
  type FeedbackStatus,
} from "../AssistantFeedback/AssistantFeedback";
import { buildDemoSuggestionsFromAssistantText } from "@/data/demoSuggestions";
import {
  getExperienceFilterLabel,
  type ExperienceFilterId,
} from "@/data/experienceFilters";
import {
  createEmptySuggestions,
  useAppUi,
} from "@/state/AppUiContext";

const CHAT_API_BASE_URL = process.env.NEXT_PUBLIC_CHAT_URL || "http://localhost:8000";

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
const RECORDING_BAR_COUNT = 5;
const WELCOME_MESSAGE_ID = "welcome-message";

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isFinal: boolean;
};

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

const transliterateSerbianCyrillicToLatin = (text: string) => {
  const map: Record<string, string> = {
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Ђ: "Đ",
    Е: "E",
    Ж: "Ž",
    З: "Z",
    И: "I",
    Ј: "J",
    К: "K",
    Л: "L",
    Љ: "Lj",
    М: "M",
    Н: "N",
    Њ: "Nj",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    Ћ: "Ć",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Č",
    Џ: "Dž",
    Ш: "Š",

    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    ђ: "đ",
    е: "e",
    ж: "ž",
    з: "z",
    и: "i",
    ј: "j",
    к: "k",
    л: "l",
    љ: "lj",
    м: "m",
    н: "n",
    њ: "nj",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    ћ: "ć",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "č",
    џ: "dž",
    ш: "š",
  };

  return text.replace(/[А-ШЂЈЉЊЋЏа-шђјљњћџ]/g, (char) => map[char] ?? char);
};

const normalizePlanText = (text: string) =>
  transliterateSerbianCyrillicToLatin(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getTravelPlanDayCount = (text: string) => {
  const normalizedText = normalizePlanText(text);
  const uniqueDays = new Set<number>();

  for (const match of normalizedText.matchAll(/\b(?:dan|day)\s*(\d{1,2})\b/g)) {
    uniqueDays.add(Number(match[1]));
  }

  return uniqueDays.size;
};

const looksLikeCompleteTravelPlan = (text: string) => {
  const normalizedText = normalizePlanText(text);

  if (
    !normalizedText.trim() ||
    normalizedText.includes(normalizePlanText(CHAT_ERROR_MESSAGE))
  ) {
    return false;
  }

  const dayCount = getTravelPlanDayCount(text);
  const hasPlanSignal =
    /\b(plan|itinerar|itinerary|program|agenda|schedule)\b/.test(
      normalizedText
    ) &&
    /\b(putovanja|puta|izleta|boravka|dan|dana|trip|travel|excursion|stay|day|days)\b/.test(
      normalizedText
    );
  const hasTravelStructure =
    /\b(lokacija|location|vrijeme|vreme|time|smjestaj|smestaj|accommodation|povratak|return|rucak|lunch|vecera|dinner|pre podne|morning|popodne|afternoon|jutro|arrival|evening|local guide tips)\b/.test(
      normalizedText
    );

  return (
    dayCount >= 3 ||
    (dayCount >= 2 && (hasPlanSignal || hasTravelStructure)) ||
    (dayCount >= 1 && hasPlanSignal && hasTravelStructure)
  );
};

const stripPlanMarkdown = (text: string) =>
  text
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 - $2")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .trim();

const cleanPlanLine = (line: string) =>
  removePdfIcons(stripPlanMarkdown(line))
    .replace(/^\s*[-*]\s*/, "")
    .trim();

const removePdfIcons = (text: string) =>
  text
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\uFE0F?/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]+$/gm, "")
    .trim();

const isFirstDayHeading = (line: string) => {
  const normalizedLine = normalizePlanText(cleanPlanLine(line));

  return /^(dan\s*1|prvi\s+dan|day\s*1|first\s+day)\b/.test(
    normalizedLine
  );
};

const isGuideTipsHeading = (line: string) => {
  const normalizedLine = normalizePlanText(cleanPlanLine(line));

  return (
    (/male\s+cake/.test(normalizedLine) &&
      /(vodica|lokalnog\s+vodica)/.test(normalizedLine)) ||
    /local\s+guide\s+tips/.test(normalizedLine)
  );
};

const isTrailingPlanSuggestion = (line: string) => {
  const normalizedLine = normalizePlanText(cleanPlanLine(line));

  return /^(ako\s+(zelis|zelite)|zelis\s+li|zelite\s+li|mogu\s+|ukoliko\s+(zelis|zelite)|if\s+you\s+(want|would\s+like)|would\s+you\s+like|i\s+can\s+)\b/.test(
    normalizedLine
  );
};

const buildPlanPdfMarkdown = (text: string) => {
  const lines = text.trim().split(/\r?\n/);
  const firstDayIndex = lines.findIndex(isFirstDayHeading);

  if (firstDayIndex === -1) {
    return removePdfIcons(text);
  }

  const guideTipsIndex = lines.findIndex(
    (line, index) => index >= firstDayIndex && isGuideTipsHeading(line)
  );

  if (guideTipsIndex === -1) {
    return removePdfIcons(lines.slice(firstDayIndex).join("\n"));
  }

  let endIndex = lines.length;
  let hasGuideTipListStarted = false;

  for (let index = guideTipsIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    if (/^([-*]|\d+\.)\s+/.test(trimmedLine)) {
      hasGuideTipListStarted = true;
      continue;
    }

    if (hasGuideTipListStarted || isTrailingPlanSuggestion(line)) {
      endIndex = index;
      break;
    }
  }

  return removePdfIcons(lines.slice(firstDayIndex, endIndex).join("\n"));
};

const getPlanHeading = (text: string) => {
  const heading = text
    .split(/\r?\n/)
    .map((line) =>
      stripPlanMarkdown(line)
        .replace(/^\s*[-*]\s*/, "")
        .trim()
    )
    .find((line) => {
      const normalizedLine = normalizePlanText(line);

      return (
        /^(plan|itinerar|program|itinerary|travel\s+plan|trip\s+plan)\b/.test(
          normalizedLine
        ) &&
        /\b(putovanja|puta|izleta|boravka|dan|dana|trip|travel|excursion|stay|day|days)\b/.test(
          normalizedLine
        )
      );
    });

  if (!heading || heading.length > 90) {
    return "";
  }

  const cleanedHeading = heading
    .replace(
      /^(plan|itinerar|program|itinerary|travel\s+plan|trip\s+plan)(\s+(putovanja|trip|travel))?\s*(za|for)?\s*[:\-–—]?\s*/i,
      ""
    )
    .replace(/^(za|for)\s+/i, "")
    .trim();

  const normalizedHeading = normalizePlanText(cleanedHeading);

  return cleanedHeading &&
    normalizedHeading !== "putovanja" &&
    normalizedHeading !== "trip" &&
    normalizedHeading !== "travel"
    ? cleanedHeading
    : "";
};

const buildPlanDownloadTitle = (
  text: string,
  translate: (key: string) => string
) => {
  const heading = getPlanHeading(text);
  const baseTitle = translate("planDownloadTitle");

  if (heading) {
    return `${baseTitle} — ${heading}`;
  }

  const dayCount = getTravelPlanDayCount(text);

  if (dayCount > 0) {
    const dayLabel =
      dayCount === 1
        ? translate("planDownloadDay")
        : translate("planDownloadDays");

    return `${baseTitle} — ${dayCount} ${dayLabel}`;
  }

  return baseTitle;
};

const sanitizeDownloadFilename = (
  filename: string,
  fallbackFilename = "Plan putovanja"
) => {
  const cleanedFilename = filename
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedFilename || fallbackFilename;
};

const buildPdfFilename = (title: string, fallbackFilename = "Plan putovanja") =>
  `${sanitizeDownloadFilename(title, fallbackFilename).replace(/\.pdf$/i, "")}.pdf`;

const getPdfFilenameFromContentDisposition = (
  contentDisposition: string | null,
  fallbackFilename: string
) => {
  if (!contentDisposition) {
    return fallbackFilename;
  }

  const encodedFilenameMatch = /filename\*=UTF-8''([^;]+)/i.exec(
    contentDisposition
  );

  if (encodedFilenameMatch?.[1]) {
    try {
      return decodeURIComponent(encodedFilenameMatch[1]);
    } catch {
      return fallbackFilename;
    }
  }

  const filenameMatch = /filename="?([^";]+)"?/i.exec(contentDisposition);

  return filenameMatch?.[1] ?? fallbackFilename;
};

const buildMessageContent = (
  text: string,
  dateRange: [Dayjs | null, Dayjs | null],
  activeExperienceIds: ExperienceFilterId[]
) => {
  const [startDate, endDate] = dateRange;
  const messageParts = [text];

  if (startDate || endDate) {
    const formattedStartDate = startDate?.format("DD.MM.YYYY");
    const formattedEndDate = endDate?.format("DD.MM.YYYY");

    if (formattedStartDate && formattedEndDate) {
      messageParts.push(
        `Datum putovanja: od ${formattedStartDate} do ${formattedEndDate}.`
      );
    } else if (formattedStartDate) {
      messageParts.push(`Datum putovanja: od ${formattedStartDate}.`);
    } else {
      messageParts.push(`Datum putovanja: do ${formattedEndDate}.`);
    }
  }

  if (activeExperienceIds.length > 0) {
    messageParts.push(
      `Interesovanja: ${activeExperienceIds
        .map((id) => getExperienceFilterLabel(id, "bh"))
        .join(", ")}.`
    );
  }

  return messageParts.join("\n\n");
};

const createDefaultRecordingLevels = () =>
  Array.from({ length: RECORDING_BAR_COUNT }, () => 5);

const getSupportedAudioMimeType = () => {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return (
    [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? ""
  );
};

const getRecordingFilename = (mimeType: string) => {
  if (mimeType.includes("mp4")) {
    return "recording.mp4";
  }

  if (mimeType.includes("ogg")) {
    return "recording.ogg";
  }

  return "recording.webm";
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
  const [feedbackStatuses, setFeedbackStatuses] = useState<
    Record<string, FeedbackStatus>
  >({});
  const [feedbackTargetMessageId, setFeedbackTargetMessageId] = useState<
    string | null
  >(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [feedbackSubmittedMessageId, setFeedbackSubmittedMessageId] = useState<
    string | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [isPlanDownloading, setIsPlanDownloading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [recordingLevels, setRecordingLevels] = useState<number[]>(
    createDefaultRecordingLevels
  );
  const [readingMessageId, setReadingMessageId] = useState<string | null>(null);
  const [readingLoadingMessageId, setReadingLoadingMessageId] = useState<
    string | null
  >(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const readAloudAbortRef = useRef<AbortController | null>(null);
  const speechLoadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const shouldUploadRecordingRef = useRef(false);
  const { t, lang } = useTranslation();
  const hasText = message.trim().length > 0;
  const {
    hasUserStarted,
    dateRange,
    setHasUserStarted,
    setIsAssistantResponding,
    clearCategories,
    setSuggestionsByCategory,
    activeExperienceIds,
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
      shouldUploadRecordingRef.current = false;

      if (recordingFrameRef.current !== null) {
        cancelAnimationFrame(recordingFrameRef.current);
        recordingFrameRef.current = null;
      }

      const mediaRecorder = mediaRecorderRef.current;
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.onstop = null;
        mediaRecorder.stop();
      }

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      void audioContextRef.current?.close();

      if (speechLoadingTimeoutRef.current) {
        clearTimeout(speechLoadingTimeoutRef.current);
      }

      readAloudAbortRef.current?.abort();

      if (audioRef.current) {
        audioRef.current.pause();

        if (audioRef.current.src.startsWith("blob:")) {
          URL.revokeObjectURL(audioRef.current.src);
        }

        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const isComposerButtonDisabled = hasText
    ? isSending || isRecording || isTranscribing
    : !isRecording && (isSending || isTranscribing);
  const sendButtonTooltip = isRecording
    ? t("stopRecordingButton")
    : isTranscribing
      ? t("transcribingAudio")
      : hasText
        ? t("sendButton")
        : t("recordButton");
  const welcomeMessageText = t("assistantIntro");

  const lastAssistantMessageId =
    [...messages].reverse().find((item) => item.role === "assistant" && item.isFinal)
      ?.id ?? null;

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
          setSuggestionsByCategory(
            buildDemoSuggestionsFromAssistantText(content)
          );
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        const content = extractStreamContent(buffer);
        if (content !== null) {
          latestContent = content;
        }
      }

      const finalText = finalizeAssistantText(latestContent);

      updateMessage(assistantMessageId, finalText, true);
      setSuggestionsByCategory(
        buildDemoSuggestionsFromAssistantText(finalText)
      );
      return finalText;
    } finally {
      reader.releaseLock();

      if (streamAbortRef.current === abortController) {
        streamAbortRef.current = null;
      }
    }
  };

  const getFeedbackContext = (messageId: string) => {
    if (messageId === WELCOME_MESSAGE_ID) {
      return { lastQuestion: "", lastAnswer: welcomeMessageText };
    }

    const assistantIndex = messages.findIndex(
      (item) => item.id === messageId && item.role === "assistant"
    );

    if (assistantIndex === -1) {
      return { lastQuestion: "", lastAnswer: "" };
    }

    const lastQuestion =
      [...messages.slice(0, assistantIndex)]
        .reverse()
        .find((item) => item.role === "user")?.text ?? "";
    const lastAnswer = messages[assistantIndex].text;

    return { lastQuestion, lastAnswer };
  };

  const submitFeedback = async (
    feedbackContext: { lastQuestion: string; lastAnswer: string },
    status: Exclude<FeedbackStatus, null>,
    feedbackText: string,
    email: string
  ) => {
    const { lastQuestion, lastAnswer } = feedbackContext;

    if (!lastAnswer.trim()) {
      return;
    }

    const activeSessionId = ensureSessionId();

    const response = await fetch(`${CHAT_API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": activeSessionId,
      },
      credentials: "include",
      body: JSON.stringify({
        sessionId: activeSessionId,
        status,
        feedback: feedbackText.trim() || t("noFeedbackComment"),
        feedbackEmail: email.trim(),
        lastQuestion,
        lastAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error(`Feedback request failed with status ${response.status}`);
    }
  };

  const handleFeedbackStatusClick = (
    messageId: string,
    status: Exclude<FeedbackStatus, null>
  ) => {
    if (isFeedbackSubmitting) {
      return;
    }

    setFeedbackStatuses((prevStatuses) => ({
      ...prevStatuses,
      [messageId]: status,
    }));
    if (feedbackTargetMessageId !== messageId) {
      setFeedback("");
      setFeedbackEmail("");
    }
    setFeedbackTargetMessageId(messageId);
    setFeedbackVisible(true);
    setFeedbackSubmittedMessageId(null);
  };

  const handleLikeClick = (messageId: string) => {
    handleFeedbackStatusClick(messageId, "Good");
  };

  const handleDislikeClick = (messageId: string) => {
    handleFeedbackStatusClick(messageId, "Bad");
  };

  const handleFeedbackChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedback(event.target.value);
  };

  const handleFeedbackEmailChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedbackEmail(event.target.value);
  };

  const handleCancelFeedback = () => {
    const activeFeedbackMessageId = feedbackTargetMessageId;

    if (activeFeedbackMessageId) {
      setFeedbackStatuses((prevStatuses) => {
        const nextStatuses = { ...prevStatuses };
        delete nextStatuses[activeFeedbackMessageId];
        return nextStatuses;
      });
    }

    setFeedback("");
    setFeedbackEmail("");
    setFeedbackTargetMessageId(null);
    setFeedbackVisible(false);
    setFeedbackSubmittedMessageId(null);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackTargetMessageId) {
      return;
    }

    const activeFeedbackMessageId = feedbackTargetMessageId;
    const activeLikeStatus = feedbackStatuses[activeFeedbackMessageId] ?? null;

    if (!activeLikeStatus || (activeLikeStatus === "Bad" && !feedback.trim())) {
      return;
    }

    try {
      setIsFeedbackSubmitting(true);
      await submitFeedback(
        getFeedbackContext(activeFeedbackMessageId),
        activeLikeStatus,
        feedback,
        feedbackEmail
      );
      setFeedbackVisible(false);
      setFeedback("");
      setFeedbackEmail("");
      setFeedbackTargetMessageId(null);
      setFeedbackSubmittedMessageId(activeFeedbackMessageId);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  const handleDownloadPlan = async (planText: string) => {
    if (isPlanDownloading) {
      return;
    }

    const title = buildPlanDownloadTitle(planText, t);
    const fallbackFilename = buildPdfFilename(title, t("planDownloadTitle"));
    const pdfMarkdown = buildPlanPdfMarkdown(planText);
    const formData = new FormData();

    formData.append("markdownText", pdfMarkdown);
    formData.append("original_filename", fallbackFilename);

    try {
      setIsPlanDownloading(true);

      const response = await fetch(`${CHAT_API_BASE_URL}/save_pdf`, {
        method: "POST",
        headers: {
          "Session-ID": ensureSessionId(),
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`PDF download failed with status ${response.status}`);
      }

      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      const contentDisposition = response.headers.get("Content-Disposition");

      link.href = downloadUrl;
      link.download = getPdfFilenameFromContentDisposition(
        contentDisposition,
        fallbackFilename
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } catch (error) {
      console.error("Failed to download plan PDF:", error);
    } finally {
      setIsPlanDownloading(false);
    }
  };

  const sendMessageText = async (rawText: string) => {
    const text = rawText.trim();

    if (!text || isSending) {
      return;
    }

    const activeSessionId = ensureSessionId();
    const userMessageId = uuidv4();
    const assistantMessageId = uuidv4();
    const messageContent = buildMessageContent(
      text,
      dateRange,
      activeExperienceIds
    );

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
    setFeedbackTargetMessageId(null);
    setFeedbackVisible(false);
    setFeedbackSubmittedMessageId(null);
    setFeedback("");
    setFeedbackEmail("");
    clearCategories();
    setSuggestionsByCategory(createEmptySuggestions());

    if (!hasUserStarted) {
      setHasUserStarted(true);
    }

    setIsSending(true);
    setIsAssistantResponding(true);

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
          language: lang,
          assistant_message_id: assistantMessageId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
      }

      const assistantText = await streamAssistantResponse(
        activeSessionId,
        assistantMessageId
      );

      setSuggestionsByCategory(
        buildDemoSuggestionsFromAssistantText(assistantText)
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Chat request failed:", error);
      updateMessage(assistantMessageId, CHAT_ERROR_MESSAGE, true);
    } finally {
      setIsSending(false);
      setIsAssistantResponding(false);
    }
  };

  const handleSend = () => {
    void sendMessageText(message);
  };

  const clearReadAloudLoading = () => {
    if (speechLoadingTimeoutRef.current) {
      clearTimeout(speechLoadingTimeoutRef.current);
      speechLoadingTimeoutRef.current = null;
    }
  };

  const stopReadAloud = () => {
    clearReadAloudLoading();

    readAloudAbortRef.current?.abort();
    readAloudAbortRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();

      if (audioRef.current.src.startsWith("blob:")) {
        URL.revokeObjectURL(audioRef.current.src);
      }

      audioRef.current = null;
    }

    setReadingLoadingMessageId(null);
    setReadingMessageId(null);
  };

  const handleReadAloudClick = async (messageId: string, text: string) => {
    if (!text.trim()) {
      return;
    }

    if (
      readingMessageId === messageId ||
      readingLoadingMessageId === messageId
    ) {
      stopReadAloud();
      return;
    }

    stopReadAloud();

    const abortController = new AbortController();
    readAloudAbortRef.current = abortController;

    try {
      setVoiceError("");
      setReadingLoadingMessageId(messageId);
      setReadingMessageId(null);

      const response = await fetch(`${CHAT_API_BASE_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-ID": ensureSessionId(),
        },
        credentials: "include",
        signal: abortController.signal,
        body: JSON.stringify({
          message_id: messageId,
          text: messageId === WELCOME_MESSAGE_ID ? text : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      const finishReading = () => {
        if (audioRef.current !== audio) {
          return;
        }

        clearReadAloudLoading();

        if (audio.src.startsWith("blob:")) {
          URL.revokeObjectURL(audio.src);
        }

        audioRef.current = null;
        setReadingLoadingMessageId(null);
        setReadingMessageId(null);
      };

      audio.onplay = () => {
        if (audioRef.current !== audio) {
          return;
        }

        clearReadAloudLoading();
        setReadingLoadingMessageId(null);
        setReadingMessageId(messageId);
      };

      audio.onended = finishReading;
      audio.onerror = finishReading;

      speechLoadingTimeoutRef.current = setTimeout(() => {
        if (audioRef.current !== audio) {
          return;
        }

        setReadingLoadingMessageId(null);
        setReadingMessageId(messageId);
      }, 700);

      await audio.play();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Read aloud failed:", error);
      setVoiceError(t("readAloudUnavailable"));
      clearReadAloudLoading();

      if (audioRef.current) {
        audioRef.current.pause();

        if (audioRef.current.src.startsWith("blob:")) {
          URL.revokeObjectURL(audioRef.current.src);
        }

        audioRef.current = null;
      }

      setReadingLoadingMessageId(null);
      setReadingMessageId(null);
    } finally {
      if (readAloudAbortRef.current === abortController) {
        readAloudAbortRef.current = null;
      }
    }
  };

  const updateRecordingLevels = () => {
    const analyser = analyserRef.current;

    if (!analyser) {
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    const bucketSize = Math.max(
      1,
      Math.floor(data.length / RECORDING_BAR_COUNT)
    );
    const levels = Array.from({ length: RECORDING_BAR_COUNT }, (_, index) => {
      const start = index * bucketSize;
      const end =
        index === RECORDING_BAR_COUNT - 1
          ? data.length
          : Math.min(data.length, start + bucketSize);
      let total = 0;

      for (let i = start; i < end; i += 1) {
        total += data[i];
      }

      const average = end > start ? total / (end - start) : 0;
      return 5 + (average / 255) * 23;
    });

    setRecordingLevels(levels);
    recordingFrameRef.current = requestAnimationFrame(updateRecordingLevels);
  };

  const stopRecordingVisuals = () => {
    if (recordingFrameRef.current !== null) {
      cancelAnimationFrame(recordingFrameRef.current);
      recordingFrameRef.current = null;
    }

    analyserRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }

    audioContextRef.current = null;
    setRecordingLevels(createDefaultRecordingLevels());
  };

  const stopRecordingStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const initializeBackendSession = async (activeSessionId: string) => {
    const response = await fetch(`${CHAT_API_BASE_URL}/initialize_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        session_id: activeSessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Session initialization failed with status ${response.status}`);
    }
  };

  const uploadVoiceRecording = async (blob: Blob) => {
    if (blob.size === 0) {
      setVoiceError(t("emptyRecording"));
      return;
    }

    const activeSessionId = ensureSessionId();
    const mimeType = blob.type || getSupportedAudioMimeType() || "audio/webm";
    const formData = new FormData();
    formData.append("blob", blob, getRecordingFilename(mimeType));

    try {
      setIsTranscribing(true);
      setVoiceError("");
      await initializeBackendSession(activeSessionId);

      const response = await fetch(`${CHAT_API_BASE_URL}/transcribe`, {
        method: "POST",
        headers: {
          "Session-ID": activeSessionId,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          detail?: unknown;
        } | null;
        const detail =
          typeof payload?.detail === "string" ? payload.detail : "";

        throw new Error(detail || t("transcriptionError"));
      }

      const data = (await response.json()) as { transcript?: unknown };
      const transcript =
        typeof data.transcript === "string" ? data.transcript.trim() : "";

      if (!transcript) {
        setVoiceError(t("emptyTranscript"));
        return;
      }

      setMessage(transcript);
    } catch (error) {
      console.error("Voice transcription failed:", error);
      setVoiceError(
        error instanceof Error ? error.message : t("transcriptionError")
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const startVoiceRecording = async () => {
    if (isSending || isTranscribing || isRecording) {
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setVoiceError(t("microphoneUnavailable"));
      return;
    }

    try {
      setMessage("");
      setVoiceError("");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContextConstructor =
        window.AudioContext ||
        (window as WindowWithWebkitAudioContext).webkitAudioContext;

      if (AudioContextConstructor) {
        const audioContext = new AudioContextConstructor();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      }

      const mimeType = getSupportedAudioMimeType();
      const recorderOptions = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);

      recordingChunksRef.current = [];
      shouldUploadRecordingRef.current = true;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const recordingMimeType =
          mediaRecorder.mimeType || mimeType || "audio/webm";
        const recordingBlob = new Blob(recordingChunksRef.current, {
          type: recordingMimeType,
        });
        const shouldUpload = shouldUploadRecordingRef.current;

        recordingChunksRef.current = [];
        shouldUploadRecordingRef.current = false;
        mediaRecorderRef.current = null;

        if (shouldUpload) {
          void uploadVoiceRecording(recordingBlob);
        }
      };
      mediaRecorder.onerror = () => {
        shouldUploadRecordingRef.current = false;
        setIsRecording(false);
        stopRecordingVisuals();
        stopRecordingStream();
        setVoiceError(t("recordingError"));

        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      if (analyserRef.current) {
        recordingFrameRef.current = requestAnimationFrame(updateRecordingLevels);
      }
    } catch (error) {
      console.error("Unable to start voice recording:", error);
      shouldUploadRecordingRef.current = false;
      setIsRecording(false);
      stopRecordingVisuals();
      stopRecordingStream();
      setVoiceError(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? t("microphoneDenied")
          : t("microphoneUnavailable")
      );
    }
  };

  const stopVoiceRecording = () => {
    if (!isRecording && mediaRecorderRef.current?.state !== "recording") {
      return;
    }

    setIsRecording(false);
    stopRecordingVisuals();

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    stopRecordingStream();
  };

  const handleComposerButtonClick = () => {
    if (isComposerButtonDisabled) {
      return;
    }

    if (isRecording) {
      stopVoiceRecording();
      return;
    }

    if (hasText) {
      handleSend();
      return;
    }

    void startVoiceRecording();
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
                <div className={styles.bubbleText}>
                  {welcomeMessageText}
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

            {messages.map((chatMessage) => {
              if (chatMessage.role === "assistant") {
                const isTypingOnly =
                  !chatMessage.isFinal && chatMessage.text.trim().length === 0;

                const isLastAssistantMessage = chatMessage.id === lastAssistantMessageId;
                const planDownload =
                  isLastAssistantMessage &&
                  chatMessage.isFinal &&
                  looksLikeCompleteTravelPlan(chatMessage.text)
                    ? {
                      title: buildPlanDownloadTitle(chatMessage.text, t),
                      subtitle: t("planDownloadSubtitle"),
                      isDownloading: isPlanDownloading,
                      onDownload: () => handleDownloadPlan(chatMessage.text),
                    }
                    : null;

                return (
                  <div
                    key={chatMessage.id}
                    className={styles.assistantBubbleWrap}
                  >
                    <div
                      className={`${styles.assistantBubble} ${!chatMessage.isFinal ? styles.assistantBubbleStreaming : ""
                        } ${isTypingOnly ? styles.assistantBubbleTypingOnly : ""
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

                        {chatMessage.isFinal &&
                          chatMessage.text.trim().length > 0 && (
                            <AssistantFeedback
                              planDownload={planDownload}
                              actionText={chatMessage.text}
                              likeStatus={feedbackStatuses[chatMessage.id] ?? null}
                              isReadAloudActive={
                                readingMessageId === chatMessage.id
                              }
                              isReadAloudLoading={
                                readingLoadingMessageId === chatMessage.id
                              }
                              feedbackVisible={
                                feedbackVisible &&
                                feedbackTargetMessageId === chatMessage.id
                              }
                              isSubmitting={isFeedbackSubmitting}
                              feedbackSubmitted={
                                feedbackSubmittedMessageId === chatMessage.id
                              }
                              feedback={feedback}
                              feedbackEmail={feedbackEmail}
                              onLikeClick={() => handleLikeClick(chatMessage.id)}
                              onDislikeClick={() =>
                                handleDislikeClick(chatMessage.id)
                              }
                              onReadAloudClick={() =>
                                handleReadAloudClick(
                                  chatMessage.id,
                                  chatMessage.text
                                )
                              }
                              onFeedbackChange={handleFeedbackChange}
                              onFeedbackEmailChange={handleFeedbackEmailChange}
                              onCancel={handleCancelFeedback}
                              onFeedbackSubmit={handleFeedbackSubmit}
                            />
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
                placeholder={
                  isRecording
                    ? t("recordingPlaceholder")
                    : isTranscribing
                      ? t("transcribingAudio")
                      : t("placeholder")
                }
                aria-label={t("chatInputAriaLabel")}
                value={message}
                readOnly={isRecording || isTranscribing}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className={styles.voiceControls}>
                <div
                  className={`${styles.waveform} ${
                    isRecording ? styles.waveformVisible : ""
                  }`}
                  aria-hidden="true"
                >
                  {recordingLevels.map((level, index) => (
                    <span
                      key={index}
                      className={styles.waveBar}
                      style={{ height: `${level}px` }}
                    />
                  ))}
                </div>

                <button
                  className={`${styles.sendButton} ${
                    hasText
                      ? styles.sendButtonSend
                      : isRecording
                        ? styles.sendButtonRecording
                        : styles.sendButtonMic
                  }`}
                  aria-label={
                    hasText
                      ? t("sendAriaLabel")
                      : isRecording
                        ? t("stopRecordingAriaLabel")
                        : t("startRecordingAriaLabel")
                  }
                  aria-disabled={isComposerButtonDisabled}
                  disabled={isComposerButtonDisabled}
                  title={sendButtonTooltip}
                  type="button"
                  onClick={handleComposerButtonClick}
                >
                  {isRecording ? (
                    <StopRoundedIcon className={styles.stopIcon} />
                  ) : (
                    <img
                      className={hasText ? styles.sendImg : styles.micImg}
                      src={hasText ? SEND_ICON : MIC_ICON}
                      alt=""
                      width={25}
                      height={25}
                    />
                  )}
                </button>
              </div>
            </div>

            <div
              className={`${styles.hint} ${
                voiceError ? styles.voiceError : ""
              }`}
              role={voiceError ? "status" : undefined}
            >
              {voiceError || t("hint")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
