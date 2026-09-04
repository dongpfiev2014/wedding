"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./Journey.module.css";

interface Milestone {
  _id: string;
  date: string;
  title: string;
  description: string;
  imageUrls: string[];
  // backward compat with old single-image data
  imageUrl?: string;
  order: number;
}

/** Returns the array of image URLs for a milestone, handling old single-imageUrl data */
function getImages(m: Milestone): string[] {
  if (m.imageUrls && m.imageUrls.length > 0) return m.imageUrls;
  if (m.imageUrl) return [m.imageUrl];
  return [];
}

/* ── Mini image carousel inside each milestone card ── */
function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      setActive((idx + images.length) % images.length);
    },
    [images.length]
  );

  // Auto-advance every 3.5 s when more than one image
  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setTimeout(() => goTo(active + 1), 3500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, images.length, goTo]);

  if (images.length === 0) return null;

  return (
    <div className={styles.carousel}>
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={src + i}
          className={`${styles.slide} ${i === active ? styles.slideActive : ""}`}
        >
          <Image
            src={src}
            alt={`${title} – ảnh ${i + 1}`}
            fill
            className={styles.image}
            sizes="(max-width: 820px) 100vw, 420px"
          />
        </div>
      ))}

      {/* Prev / Next arrows – only when > 1 image */}
      {images.length > 1 && (
        <>
          <button
            className={`${styles.carouselArrow} ${styles.arrowPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(active - 1);
            }}
            aria-label="Ảnh trước"
          >
            ‹
          </button>
          <button
            className={`${styles.carouselArrow} ${styles.arrowNext}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(active + 1);
            }}
            aria-label="Ảnh sau"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className={styles.carouselDots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.carouselDot} ${i === active ? styles.dotActive : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(i);
                }}
                aria-label={`Ảnh ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className={styles.carouselCounter}>
            {active + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}

export default function Journey() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/milestones")
      .then((r) => r.json())
      .then((d) => {
        setMilestones(d.milestones || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Continuous scroll animation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const items = document.querySelectorAll<HTMLElement>(`.${styles.item}`);
          const vh = window.innerHeight;
          const screenCenter = vh / 2;

          items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;

            const diff = Math.max(
              -1.2,
              Math.min(1.2, (itemCenter - screenCenter) / (vh * 0.45))
            );

            const progress = 1 - Math.abs(diff) / 1.2;
            const isMobile = window.innerWidth <= 820;

            const maxShift = 24;
            const isLeft = item.classList.contains(styles.itemLeft);

            const imageBox = item.querySelector<HTMLElement>(`.${styles.imageBox}`);
            const content = item.querySelector<HTMLElement>(`.${styles.content}`);

            if (imageBox) {
              if (isMobile) {
                imageBox.style.transform = "";
              } else {
                const imgShift = isLeft
                  ? -progress * maxShift
                  :  progress * maxShift;
                imageBox.style.transform = `translateX(${imgShift.toFixed(1)}px)`;
              }
            }

            if (content) {
              if (isMobile) {
                content.style.transform = "";
              } else {
                const contentShift = isLeft
                  ?  progress * 16
                  : -progress * 16;
                content.style.transform = `translateX(${contentShift.toFixed(1)}px)`;
              }
            }

            if (rect.top < vh * 0.95 && rect.bottom > vh * 0.05) {
              item.classList.add(styles.visible);
            } else {
              item.classList.remove(styles.visible);
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [milestones]);


  return (
    <section id="journey" className={styles.section} ref={sectionRef}>
      <div className={styles.container}>
        {/* <p className={styles.subtitle}>HÀNH TRÌNH CỦA CHÚNG MÌNH</p> */}
        <h2 className={styles.title}>Khoảnh Khắc Đáng Nhớ</h2>
        <div className={styles.divider} />

        {loading ? (
          <div className={styles.loading}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.timeline}>
            {/* Center line */}
            <div className={styles.centerLine} />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              const images = getImages(m);
              return (
                <div
                  key={m._id}
                  className={`${styles.item} ${
                    isLeft ? styles.itemLeft : styles.itemRight
                  }`}
                >
                  {/* Content */}
                  <div className={styles.content}>
                    <span className={styles.date}>{m.date}</span>
                    <h3 className={styles.milestoneTitle}>{m.title}</h3>
                    <p className={styles.description}>{m.description}</p>
                  </div>

                  {/* Center dot */}
                  <div className={styles.dot}>
                    <span className={styles.dotHeart}>♥</span>
                  </div>

                  {/* Images */}
                  <div className={styles.imageBox}>
                    {images.length > 0 ? (
                      <ImageCarousel images={images} title={m.title} />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderIcon}>📷</span>
                        <p className={styles.placeholderTitle}>{m.title}</p>
                        <p className={styles.placeholderDate}>{m.date}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
