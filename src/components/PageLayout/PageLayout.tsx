import React from "react";
import styles from "./PageLayout.module.css";

type PageLayoutProps = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export default function PageLayout({ left, right }: PageLayoutProps) {
  return (
    <main className={styles.root}>
      <section className={styles.left}>{left}</section>
      <aside className={styles.right}>{right}</aside>
    </main>
  );
}