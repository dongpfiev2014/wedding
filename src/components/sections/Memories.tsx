"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Memories.module.css";

interface Photo {
  _id: string;
  imageUrl: string;
  caption: string;
}

// Placeholder images for when no photos uploaded
const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519225438550-4536dd7e7745?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
];

export default function Memories() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setPhotos(d.photos || []))
      .catch(() => {});
  }, []);

  const displayPhotos = photos.length > 0
    ? photos.map((p) => ({ url: p.imageUrl, caption: p.caption }))
    : PLACEHOLDERS.map((url) => ({ url, caption: "Kỷ niệm đẹp" }));

  // Double the array for seamless loop
  const doubled = [...displayPhotos, ...displayPhotos];
  const row1 = doubled;
  const row2 = [...doubled].reverse();

  return (
    <section id="memories" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.subtitle}>KỶ NIỆM CỦA CHÚNG MÌNH</p>
        <h2 className={styles.title}>Our Memories</h2>
        <div className={styles.divider} />
      </div>

      {/* Row 1 — left to right */}
      <div className={styles.rowWrapper}>
        <div className={`${styles.track} ${styles.trackLeft}`}>
          {row1.map((p, i) => (
            <div
              key={i}
              className={styles.photoCard}
              onClick={() => setLightbox(p.url)}
            >
              <Image src={p.url} alt={p.caption} width={320} height={360} className={styles.photo} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className={styles.rowWrapper}>
        <div className={`${styles.track} ${styles.trackRight}`}>
          {row2.map((p, i) => (
            <div
              key={i}
              className={styles.photoCard}
              onClick={() => setLightbox(p.url)}
            >
              <Image src={p.url} alt={p.caption} width={320} height={360} className={styles.photo} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxInner}>
            <Image src={lightbox} alt="Memory" width={900} height={600} className={styles.lightboxImg} />
            <button className={styles.closeBtn} onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </section>
  );
}
