"use client";
import { useState, useRef } from "react";
import styles from "./EnvelopeOpener.module.css";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeOpener({ onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const handleOpen = () => {
    if (opening || opened) return;
    window.dispatchEvent(new CustomEvent("play-wedding-music"));
    setOpening(true);
    setTimeout(() => {
      setOpened(true);
      setTimeout(onOpen, 600);
    }, 1200);
  };

  // Mobile swipe up to open
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy > 60) handleOpen();
    touchStartY.current = null;
  };

  if (opened) return null;

  return (
    <div
      className={`${styles.overlay} ${opening ? styles.opening : ""}`}
      onClick={handleOpen}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating petals */}
      {[...Array(12)].map((_, i) => (
        <span key={i} className={styles.petal} style={{ "--i": i } as React.CSSProperties} />
      ))}

      <div className={`${styles.envelope} ${opening ? styles.envelopeOpen : ""}`}>
        {/* Envelope flap */}
        <div className={`${styles.flap} ${opening ? styles.flapOpen : ""}`}>
          <div className={styles.flapInner}>
            <span className={styles.seal}>囍</span>
          </div>
        </div>

        {/* Envelope body */}
        <div className={styles.body}>
          <div className={styles.letterPeek}>
            <p className={styles.peekScript}>Minh Đông</p>
            <p className={styles.peekAmp}>&</p>
            <p className={styles.peekScript}>Diệu Linh</p>
          </div>
        </div>

        {/* Bottom flaps */}
        <div className={styles.flapLeft} />
        <div className={styles.flapRight} />
        <div className={styles.flapBottom} />
      </div>

      <div className={styles.cta}>
        <span className={styles.ctaIcon}>👆</span>
        <p className={styles.ctaText}>Nhấn để mở thiệp</p>
        <p className={styles.ctaMobile}>Vuốt lên để mở thiệp</p>
      </div>
    </div>
  );
}
