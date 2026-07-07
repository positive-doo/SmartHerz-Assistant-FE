// AssistantFeedback.tsx

import type { ChangeEvent } from "react";
import { Button, CircularProgress, IconButton, TextField, Tooltip } from "@mui/material";
import {
  DescriptionOutlined as DescriptionOutlinedIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  ThumbDown as ThumbDownIcon,
  ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
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
  likeStatus: FeedbackStatus;
  feedbackVisible: boolean;
  isSubmitting: boolean;
  feedbackSubmitted: boolean;
  feedback: string;
  feedbackEmail: string;
  onLikeClick: () => void;
  onDislikeClick: () => void;
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
  likeStatus,
  feedbackVisible,
  isSubmitting,
  feedbackSubmitted,
  feedback,
  feedbackEmail,
  onLikeClick,
  onDislikeClick,
  onFeedbackChange,
  onFeedbackEmailChange,
  onCancel,
  onFeedbackSubmit,
}: AssistantFeedbackProps) => {
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
            aria-label={`Preuzmi PDF: ${planDownload.title}`}
          >
            {planDownload.isDownloading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            )}
            <span>{planDownload.isDownloading ? "Preuzimam..." : "Preuzmi PDF"}</span>
          </button>
        </div>
      )}

      <div className={styles.feedbackSection}>
        <div className={styles.feedbackButtons}>
          <Tooltip
            title="Odgovor je koristan"
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
                aria-label="Odgovor je koristan"
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
            title="Odgovor nije koristan"
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
                aria-label="Odgovor nije koristan"
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

        {feedbackSubmitted && (
          <div className={styles.feedbackSuccessMessage}>
            <span aria-hidden="true">😊</span>
            <span>Hvala na povratnoj informaciji!</span>
          </div>
        )}

        {feedbackVisible && (
          <div className={styles.feedbackForm}>
            <div className={styles.feedbackFormHeader}>
              {likeStatus === "Bad"
                ? "Reci mi šta nije dobro"
                : "Želiš li da dodaš komentar?"}
            </div>

            <TextField
              label={
                likeStatus === "Bad"
                  ? "Ostavi komentar"
                  : "Ostavi komentar (opciono)"
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
                  ? "Reci nam šta nije bilo dobro kako bismo poboljšali odgovor."
                  : "Komentar nije obavezan, ali nam pomaže da poboljšamo odgovore."
              }
              sx={textFieldSx}
            />

            <TextField
              label="Ostavi svoj email (opciono)"
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
                Odustani
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
                {isSubmitting ? "Šaljem..." : "Pošalji"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
