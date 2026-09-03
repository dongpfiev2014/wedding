"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "Thiệp Cưới", href: "#invitation" },
  { label: "Địa Điểm", href: "#venue" },
  { label: "Hành Trình", href: "#journey" },
  { label: "Kỷ Niệm", href: "#memories" },
  { label: "Lời Chúc", href: "#guestbook" },
  { label: "Mừng Cưới", href: "#gift" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoScript}>M</span>
          <span className={styles.logoAmp}>&</span>
          <span className={styles.logoScript}>D</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className={styles.navItem}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Theme + Hamburger */}
        <div className={styles.right}>
          <ThemeSwitcher />
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileOpen ? styles.barOpen : ""}></span>
            <span className={mobileOpen ? styles.barOpen : ""}></span>
            <span className={mobileOpen ? styles.barOpen : ""}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu} ref={menuRef}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className={styles.mobileItem}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
          <div className={styles.mobileDivider} />
          <ThemeSwitcher />
        </div>
      )}
    </header>
  );
}
