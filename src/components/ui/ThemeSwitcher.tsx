"use client";
import { useTheme } from "./ThemeProvider";
import styles from "./ThemeSwitcher.module.css";

const themes = [
  { id: "blush" as const, label: "Blush", color: "#C9A96E" },
  { id: "noir" as const, label: "Noir", color: "#D4AF37" },
  { id: "modern" as const, label: "Modern", color: "#2C3E6B" },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.switcher}>
      {themes.map((t) => (
        <button
          key={t.id}
          className={`${styles.btn} ${theme === t.id ? styles.active : ""}`}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={`Switch to ${t.label} theme`}
        >
          <span className={styles.swatch} style={{ background: t.color }} />
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
