"use client";

import { useRef, useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DateRangeIcon from '@mui/icons-material/DateRange';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import styles from "./DateFilterPill.module.css";
import { useTranslation } from "../i18n/useTranslation";

type Props = {
    label: string;
    value: [Dayjs | null, Dayjs | null];
    onChange: (range: [Dayjs | null, Dayjs | null]) => void;
};

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay(); // 0=Sun
}

function getMonthNames(t: (k: string) => string) {
    return (t("monthNames") || "").split("|");
}

function getDayNames(t: (k: string) => string) {
    return (t("dayNames") || "").split("|");
}

type CalendarProps = {
    label: string;
    value: Dayjs | null;
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
    hoverDate?: Dayjs | null;
    rangeStart?: Dayjs | null;
    rangeEnd?: Dayjs | null;
    onSelect: (d: Dayjs) => void;
    onHover?: (d: Dayjs | null) => void;
    initialMonth?: { year: number; month: number };
};

function MiniCalendar({
    label, value, minDate, maxDate,
    hoverDate, rangeStart, rangeEnd,
    onSelect, onHover, initialMonth,
}: CalendarProps) {
    const today = dayjs();
    const initialYear = initialMonth?.year ?? today.year();
    const initialMonthIndex = initialMonth?.month ?? today.month();
    const [view, setView] = useState({
        year: initialYear,
        month: initialMonthIndex,
    });
    const { t } = useTranslation();
    const MONTH_NAMES = getMonthNames(t);
    const DAY_NAMES = getDayNames(t);
    const daysInMonth = getDaysInMonth(view.year, view.month);
    const rawFirst = getFirstDayOfMonth(view.year, view.month);
    const firstDay = (rawFirst + 6) % 7;

    useEffect(() => {
        setView({ year: initialYear, month: initialMonthIndex });
    }, [initialYear, initialMonthIndex]);

    const prevMonth = () => {
        setView((v) => {
            const d = dayjs().year(v.year).month(v.month).subtract(1, "month");
            return { year: d.year(), month: d.month() };
        });
    };

    const nextMonth = () => {
        setView((v) => {
            const d = dayjs().year(v.year).month(v.month).add(1, "month");
            return { year: d.year(), month: d.month() };
        });
    };

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className={styles.calendar}>
            <div className={styles.calLabel}>{label}</div>
            <div className={styles.calHeader}>
                <button type="button" className={styles.navBtn} onClick={prevMonth}>‹</button>
                <span className={styles.monthTitle}>
                    {MONTH_NAMES[view.month]} {view.year}
                </span>
                <button type="button" className={styles.navBtn} onClick={nextMonth}>›</button>
            </div>

            <div className={styles.dayGrid}>
                {DAY_NAMES.map((d) => (
                    <div key={d} className={styles.dayName}>{d}</div>
                ))}

                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;

                    const current = dayjs(new Date(view.year, view.month, day));
                    const isToday = current.isSame(today, "day");
                    const isSelected = value?.isSame(current, "day");
                    const isPast = current.isBefore(today, "day");
                    const isBeforeMin = minDate ? current.isBefore(minDate, "day") : false;
                    const isAfterMax = maxDate ? current.isAfter(maxDate, "day") : false;
                    const disabled = isPast || isBeforeMin || isAfterMax;

                    // Range highlight, including a backwards selection preview.
                    const effectiveEnd = rangeEnd ?? hoverDate;
                    const effectiveStart =
                        rangeStart && effectiveEnd && effectiveEnd.isBefore(rangeStart, "day")
                            ? effectiveEnd
                            : rangeStart;
                    const normalizedEnd =
                        rangeStart && effectiveEnd && effectiveEnd.isBefore(rangeStart, "day")
                            ? rangeStart
                            : effectiveEnd;
                    const inRange =
                        effectiveStart && normalizedEnd &&
                        current.isAfter(effectiveStart, "day") &&
                        current.isBefore(normalizedEnd, "day");
                    const isRangeStart = effectiveStart?.isSame(current, "day");
                    const isRangeEnd = normalizedEnd?.isSame(current, "day");

                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={disabled}
                            className={[
                                styles.day,
                                isToday ? styles.today : "",
                                isSelected ? styles.selected : "",
                                disabled ? styles.disabled : "",
                                inRange ? styles.inRange : "",
                                isRangeStart ? styles.rangeStart : "",
                                isRangeEnd ? styles.rangeEnd : "",
                            ].join(" ")}
                            onClick={() => !disabled && onSelect(current)}
                            onMouseEnter={() => !disabled && onHover?.(current)}
                            onMouseLeave={() => onHover?.(null)}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function DateFilterPill({ label, value, onChange }: Props) {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
    const { t } = useTranslation();
    const [start, end] = value;
    const hasRange = start && end;

    const displayLabel = hasRange
        ? `${start.format("DD.MM")} – ${end.format("DD.MM.YYYY")}`
        : label;

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                !anchorRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const closePicker = () => {
        setOpen(false);
        setHoverDate(null);
    };

    const handleStartSelect = (date: Dayjs) => {
        if (end && !date.isAfter(end, "day")) {
            onChange([date, end]);
            closePicker();
            return;
        }

        onChange([date, null]);
        setHoverDate(null);
    };

    const handleEndSelect = (date: Dayjs) => {
        if (!start || date.isBefore(start, "day")) {
            onChange([date, date]);
        } else {
            onChange([start, date]);
        }

        closePicker();
    };

    const today = dayjs();
    const firstVisibleMonth = start ?? today;
    const secondVisibleMonth = end ?? start ?? today;

    return (
        <div className={styles.wrapper}>
            <button
                ref={anchorRef}
                className={`${styles.pill} ${hasRange ? styles.pillActive : ""}`}
                type="button"
                onClick={() => setOpen((v) => !v)}
            >
                {hasRange ? (
                    <DateRangeIcon className={styles.pillIcon} />
                ) : (
                    <AddIcon className={styles.pillIcon} />
                )}
                <span>{displayLabel}</span>
            </button>

            {open && (
                <div ref={popoverRef} className={styles.popover}>
                    <div className={styles.calendars}>
                        <MiniCalendar
                            label={t("dateFrom")}
                            value={start}
                            hoverDate={hoverDate}
                            rangeStart={start}
                            rangeEnd={end}
                            onSelect={handleStartSelect}
                            initialMonth={{
                                year: firstVisibleMonth.year(),
                                month: firstVisibleMonth.month(),
                            }}
                        />
                        <div className={styles.divider} />
                        <MiniCalendar
                            label={t("dateTo")}
                            value={end}
                            minDate={start}
                            hoverDate={hoverDate}
                            rangeStart={start}
                            rangeEnd={end}
                            onSelect={handleEndSelect}
                            onHover={setHoverDate}
                            initialMonth={{
                                year: secondVisibleMonth.year(),
                                month: secondVisibleMonth.month(),
                            }}
                        />
                    </div>

                    {hasRange && (
                        <div className={styles.footer}>
                            <button
                                type="button"
                                className={styles.clearBtn}
                                onClick={() => onChange([null, null])}
                            >
                                {t("clearDates")}
                            </button>
                        </div>
                    )}

                    <div className={styles.mobileFooter}>
                        <button
                            type="button"
                            className={styles.mobileCloseButton}
                            onClick={() => setOpen(false)}
                        >
                            {t("closeFilter")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
