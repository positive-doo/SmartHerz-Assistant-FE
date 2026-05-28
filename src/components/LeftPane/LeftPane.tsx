import Image from "next/image";
import styles from "./LeftPane.module.css";

export default function LeftPane() {
  return (
    <div className={styles.root}>
      {/* Header gore levo */}
      <div className={styles.header}>
        <div className={styles.subtitle}>Smart HERZ ai start</div>

        <Image
          src="/logo.svg"
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
            src="/avatar.png"
            alt="Assistant"
            width={240}
            height={280}
            priority
          />
        </div>

        <div className={styles.bottomContent}>
          {/* Bubble + mala ikonica */}
          <div className={styles.bubbleWrap}>
            <div className={styles.bubble}>
              <p className={styles.bubbleText}>
                Zdravo, <br />
                Ja sam tvoj virtuelni savetnik za istraživanje <b>Istočne Hercegovine</b>.
                <br />
                <br />
                Reci mi više o aktivnostima koje te zanimaju, koju destinaciju želiš da
                posetiš i kada planiraš putovanje.
                <br />
                Daću ti savete i preporuke koje će se prikazati na desnoj strani tvog
                ekrana.
              </p>
            </div>

            <div className={styles.bubbleAvatar}>
              <Image
                src="/avatar-icon.png"
                alt="AI"
                width={22}
                height={22}
                priority
              />
            </div>
          </div>

          {/* Input */}
          <div className={styles.inputBlock}>
            <div className={styles.inputRow}>
              <input
                className={styles.input}
                type="text"
                placeholder="Kako mogu da vam pomognem?"
                aria-label="Message input"
              />

              <button className={styles.sendButton} aria-label="Send" type="button">
                <span className={styles.sendIcon}>→</span>
              </button>
            </div>

            <div className={styles.hint}>
              Molimo vas da ne unosite lične podatke (ime, prezime, email, broj telefona itd.)
              u prozor za ćaskanje.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}