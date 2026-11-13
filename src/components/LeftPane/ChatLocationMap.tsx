import styles from "./LeftPane.module.css";

export type ChatMapLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export function parseChatMapLocation(value: unknown): ChatMapLocation | undefined {
  if (value === null || typeof value !== "object") {
    return undefined;
  }

  const { id, name, latitude, longitude } = value as Partial<ChatMapLocation>;
  if (
    typeof id !== "string" ||
    !id.trim() ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    Math.abs(latitude) > 90 ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    Math.abs(longitude) > 180
  ) {
    return undefined;
  }

  return { id, name, latitude, longitude };
}

export function ChatLocationMap({
  location,
  title,
  linkLabel,
}: {
  location: ChatMapLocation;
  title: string;
  linkLabel: string;
}) {
  const { latitude, longitude } = location;
  const bounds = [
    Math.max(-180, longitude - 0.012),
    Math.max(-90, latitude - 0.007),
    Math.min(180, longitude + 0.012),
    Math.min(90, latitude + 0.007),
  ];
  const embedParams = new URLSearchParams({
    bbox: bounds.join(","),
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });
  const linkParams = new URLSearchParams({ mlat: String(latitude), mlon: String(longitude) });

  return (
    <div className={styles.chatLocationMap}>
      <iframe
        className={styles.chatLocationMapFrame}
        loading="lazy"
        title={title}
        src={`https://www.openstreetmap.org/export/embed.html?${embedParams}`}
      />
      <a
        className={styles.locationLink}
        href={`https://www.openstreetmap.org/?${linkParams}#map=15/${latitude}/${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkLabel}
      </a>
    </div>
  );
}
