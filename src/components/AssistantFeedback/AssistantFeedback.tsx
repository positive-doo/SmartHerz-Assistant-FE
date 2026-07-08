// AssistantFeedback.tsx

import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import {
  Check as CheckIcon,
  ContentCopyOutlined as ContentCopyOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  Pause as PauseIcon,
  ThumbDown as ThumbDownIcon,
  ThumbUp as ThumbUpIcon,
  VolumeUpOutlined as VolumeUpOutlinedIcon,
} from "@mui/icons-material";
import { useTranslation } from "../i18n/useTranslation";
import styles from "./AssistantFeedback.module.css";

export type FeedbackStatus = "Good" | "Bad" | null;

type PlanDownloadConfig = {
  title: string;
  subtitle: string;
  isDownloading?: boolean;
  onDownload: () => void;
};

interface AssistantFeedbackProps {
  planDownload?: PlanDownloadConfig | null;
  actionText: string;
  likeStatus: FeedbackStatus;
  isReadAloudActive?: boolean;
  isReadAloudLoading?: boolean;
  feedbackVisible: boolean;
  isSubmitting: boolean;
  feedbackSubmitted: boolean;
  feedback: string;
  feedbackEmail: string;
  onLikeClick: () => void;
  onDislikeClick: () => void;
  onReadAloudClick?: () => void;
  onFeedbackChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFeedbackEmailChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCancel: () => void;
  onFeedbackSubmit: () => void;
}

export const AssistantFeedback = ({
  planDownload,
  actionText,
  likeStatus,
  isReadAloudActive = false,
  isReadAloudLoading = false,
  feedbackVisible,
  isSubmitting,
  feedbackSubmitted,
  feedback,
  feedbackEmail,
  onLikeClick,
  onDislikeClick,
  onReadAloudClick,
  onFeedbackChange,
  onFeedbackEmailChange,
  onCancel,
  onFeedbackSubmit,
}: AssistantFeedbackProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const tooltipSlotProps = {
    popper: {
      disablePortal: true,
    },
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.72)",
      color: "#2F2340",
      fontFamily: "inherit",
      fontSize: "13px",

      "& fieldset": {
        borderColor: "rgba(97, 64, 135, 0.26)",
      },

      "&:hover fieldset": {
        borderColor: "rgba(97, 64, 135, 0.42)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "rgba(97, 64, 135, 0.65)",
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#5F4B76",
      fontFamily: "inherit",
      fontSize: "13px",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#4A2C70",
    },
    "& .MuiFormHelperText-root": {
      color: "#6F5D7F",
      fontFamily: "inherit",
      marginLeft: "2px",
    },
  };

  const handleCopy = async () => {
    const text = actionText.trim();

    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard can be unavailable outside HTTPS/localhost.
    }
  };

  const usefulText = t("feedbackUsefulTooltip");
  const notUsefulText = t("feedbackNotUsefulTooltip");
  const copyText = copied ? t("copiedTooltip") : t("copyTextTooltip");
  const readAloudText = isReadAloudActive
    ? t("stopReadAloudTooltip")
    : t("readAloudTooltip");
  const downloadPdfText = planDownload?.isDownloading
    ? t("downloadPdfLoading")
    : t("downloadPdfButton");

  return (
    <div className={styles.feedbackWrap}>
      {planDownload && (
        <div className={styles.downloadCard}>
          <div className={styles.downloadInfo}>
            <div className={styles.downloadIcon} aria-hidden="true">
              <DescriptionOutlinedIcon sx={{ fontSize: 19 }} />
            </div>

            <div className={styles.downloadText}>
              <span className={styles.downloadTitle}>{planDownload.title}</span>
              <span className={styles.downloadSubtitle}>
                {planDownload.subtitle}
              </span>
            </div>
          </div>

          <button
            type="button"
            className={styles.downloadButton}
            onClick={planDownload.onDownload}
            disabled={planDownload.isDownloading}
            aria-label={`${t("downloadPdfAriaLabel")}: ${planDownload.title}`}
            title={`${t("downloadPdfAriaLabel")}: ${planDownload.title}`}
          >
            {planDownload.isDownloading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            )}
            <span>{downloadPdfText}</span>
          </button>
        </div>
      )}

      <div className={styles.feedbackSection}>
        <div className={styles.feedbackToolbar}>
          <div className={styles.feedbackButtons}>
            <Tooltip
              title={usefulText}
              arrow
              placement="top"
              disableInteractive
              slotProps={tooltipSlotProps}
            >
              <span>
                <IconButton
                  className={styles.feedbackIconButton}
                  onClick={onLikeClick}
                  disabled={isSubmitting}
                  aria-label={usefulText}
                  size="small"
                >
                  <ThumbUpIcon
                    sx={{
                      fontSize: 20,
                      color: likeStatus === "Good" ? "#3F9D4A" : "inherit",
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={notUsefulText}
              arrow
              placement="top"
              disableInteractive
              slotProps={tooltipSlotProps}
            >
              <span>
                <IconButton
                  className={styles.feedbackIconButton}
                  onClick={onDislikeClick}
                  disabled={isSubmitting}
                  aria-label={notUsefulText}
                  size="small"
                >
                  <ThumbDownIcon
                    sx={{
                      fontSize: 20,
                      color: likeStatus === "Bad" ? "#D33A2C" : "inherit",
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          <div className={styles.feedbackActionButtons}>
            <Tooltip
              title={copyText}
              arrow
              placement="top"
              disableInteractive
              slotProps={tooltipSlotProps}
            >
              <span>
                <IconButton
                  className={styles.feedbackIconButton}
                  onClick={handleCopy}
                  aria-label={copyText}
                  size="small"
                >
                  {copied ? (
                    <CheckIcon sx={{ fontSize: 19, color: "#3F9D4A" }} />
                  ) : (
                    <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={readAloudText}
              arrow
              placement="top"
              disableInteractive
              slotProps={tooltipSlotProps}
            >
              <span>
                <IconButton
                  className={styles.feedbackIconButton}
                  onClick={onReadAloudClick}
                  aria-label={readAloudText}
                  size="small"
                >
                  {isReadAloudLoading ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : isReadAloudActive ? (
                    <PauseIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <VolumeUpOutlinedIcon sx={{ fontSize: 19 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>

            {isReadAloudActive && (
              <span className={styles.listenWaveform} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </div>
        </div>

        {feedbackSubmitted && (
          <div className={styles.feedbackSuccessMessage}>
            <span aria-hidden="true">😊</span>
            <span>{t("feedbackSuccessMessage")}</span>
          </div>
        )}

        {feedbackVisible && (
          <div className={styles.feedbackForm}>
            <div className={styles.feedbackFormHeader}>
              {likeStatus === "Bad"
                ? t("feedbackBadHeader")
                : t("feedbackGoodHeader")}
            </div>

            <TextField
              label={
                likeStatus === "Bad"
                  ? t("feedbackCommentLabelBad")
                  : t("feedbackCommentLabelGood")
              }
              variant="outlined"
              value={feedback}
              onChange={onFeedbackChange}
              multiline
              rows={3}
              fullWidth
              disabled={isSubmitting}
              helperText={
                likeStatus === "Bad"
                  ? t("feedbackBadHelperText")
                  : t("feedbackGoodHelperText")
              }
              sx={textFieldSx}
            />

            <TextField
              label={t("feedbackEmailLabel")}
              variant="outlined"
              value={feedbackEmail}
              onChange={onFeedbackEmailChange}
              fullWidth
              disabled={isSubmitting}
              sx={textFieldSx}
            />

            <div className={styles.feedbackActions}>
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
                className={styles.feedbackCancelButton}
              >
                {t("feedbackCancelButton")}
              </Button>

              <Button
                onClick={onFeedbackSubmit}
                disabled={isSubmitting || (likeStatus === "Bad" && !feedback.trim())}
                className={styles.feedbackSubmitButton}
                variant="contained"
                startIcon={
                  isSubmitting ? <CircularProgress size={15} color="inherit" /> : null
                }
              >
                {isSubmitting
                  ? t("feedbackSubmittingButton")
                  : t("feedbackSubmitButton")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};