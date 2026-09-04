"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./Journey.module.css";

interface Milestone {
  _id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
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

  // Continuous scroll animation:
  // As item enters viewport center (diff→0): image slides INWARD toward center axis,
  // stopping so its inner edge is exactly `gap` (36px) from center.
  // As item leaves center (diff→±1.2): image returns to its natural column position.
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

            // How far the image has "arrived": 1 = fully centered, 0 = at boundary
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
        <p className={styles.subtitle}>HÀNH TRÌNH CỦA CHÚNG MÌNH</p>
        <h2 className={styles.title}>Những Khoảnh Khắc Đáng Nhớ</h2>
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

                  {/* Image */}
                  <div className={styles.imageBox}>
                    {m.imageUrl ? (
                      <Image
                        src={m.imageUrl}
                        alt={m.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 820px) 100vw, 420px"
                      />
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
