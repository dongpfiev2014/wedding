"use client";
import { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WEDDING_DATE = new Date("2026-09-20T11:35:00+07:00").getTime();

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}


function FlipUnit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setPrev(value); setFlip(false); }, 400);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  const display = String(value).padStart(2, "0");

  return (
    <div className={styles.unit}>
      <div className={`${styles.flip} ${flip ? styles.flipping : ""}`}>
        <span className={styles.number} suppressHydrationWarning>{display}</span>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=Đám+Cưới+Minh+Đông+%26+Diệu+Linh" +
  "&dates=20260920T030000Z/20260920T070000Z" +
  "&details=Lễ+Thành+Hôn+của+Minh+Đông+%26+Diệu+Linh" +
  "&location=Thôn+Hồng+Thái,+Xã+Lập+Thạch,+Tỉnh+Phú+Thọ";

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTime(calcTimeLeft());
    setMounted(true);
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const isPast = mounted && Object.values(time).every((v) => v === 0);

  return (
    <section id="countdown" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.quote}>
          We&apos;ll be sharing a home and a life together in
        </p>

        {isPast ? (
          <p className={styles.happyDay}>🎉 Ngày hạnh phúc đã đến! 🎉</p>
        ) : (
          <div className={styles.clock} suppressHydrationWarning>
            <FlipUnit value={time.days}    label="Ngày" />
            <span className={styles.colon}>:</span>
            <FlipUnit value={time.hours}   label="Giờ" />
            <span className={styles.colon}>:</span>
            <FlipUnit value={time.minutes} label="Phút" />
            <span className={styles.colon}>:</span>
            <FlipUnit value={time.seconds} label="Giây" />
          </div>
        )}

        <div className={styles.actions}>
          <a
            href={GOOGLE_CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.calBtn}
          >
            📅 Thêm vào Google Calendar
          </a>
        </div>
      </div>
    </section>
  );
}
