"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./SaveTheDate.module.css";

interface Props {
  settings: Record<string, string>;
}

export default function SaveTheDate({ settings }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const heroVideo = settings.heroVideoUrl || null;
  const heroImage = settings.heroImageUrl || null;

  return (
    <section id="save-the-date" className={styles.hero}>
      {/* Background: video takes priority, then image, then CSS fallback */}
      {heroVideo ? (
        <video
          className={styles.heroBg}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage || undefined}
        />
      ) : heroImage ? (
        <Image src={heroImage} alt="Wedding hero" fill className={styles.heroBg} priority />
      ) : (
        <div className={styles.heroBgFallback} />
      )}
      <div className={styles.overlay} />

      {/* Floating hearts */}
      {[...Array(8)].map((_, i) => (
        <span key={i} className={styles.heart} style={{ "--i": i } as React.CSSProperties}>♥</span>
      ))}

      {/* Content */}
      <div className={`${styles.content} ${visible ? styles.visible : ""}`}>
        <p className={styles.saveLabel}>Save the Date</p>
        <div className={styles.dividerOrnament}>
          <span>✦</span>
        </div>
        <h1 className={styles.names}>
          <span className={styles.name}>{settings.groomName || "Minh Đông"}</span>
          <span className={styles.amp}>&</span>
          <span className={styles.name}>{settings.brideName || "Diệu Linh"}</span>
        </h1>
        <div className={styles.dividerOrnament}>
          <span>✦</span>
        </div>
        <p className={styles.dateText}>{settings.saveTheDate || "20.09.2026"}</p>
        <p className={styles.location}>Phú Thọ, Việt Nam</p>
        <button
          className={styles.scrollBtn}
          onClick={() => document.getElementById("invitation")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span>Xem thiệp cưới</span>
          <span className={styles.scrollArrow}>↓</span>
        </button>
      </div>
    </section>
  );
}
