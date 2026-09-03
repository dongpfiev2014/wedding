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
  // As user scrolls DOWN: photo smoothly pulls closer to the center axis.
  // As user scrolls UP: photo smoothly pushes farther away from the center axis.
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

            // diff:
            // > 0 when item is below center (approaching as user scrolls down)
            // = 0 when item is vertically centered in reading zone
            // < 0 when item moves above center (as user continues scrolling down)
            const diff = Math.max(
              -1.2,
              Math.min(1.2, (itemCenter - screenCenter) / (vh * 0.45))
            );

            item.style.setProperty("--scroll-diff", diff.toFixed(3));

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
