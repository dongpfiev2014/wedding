"use client";
import { useEffect, useState } from "react";
import styles from "./GuestBook.module.css";

interface Wish {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function GuestBook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchWishes = () => {
    fetch("/api/wishes")
      .then((r) => r.json())
      .then((d) => setWishes(d.wishes || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Vui lòng điền đầy đủ tên và lời chúc!");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setMessage("");
        fetchWishes();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <section id="guestbook" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>SỔ LƯU BÚT</p>
        <h2 className={styles.title}>Để Lại Lời Chúc</h2>
        <div className={styles.divider} />

        <div className={styles.grid}>
          {/* Card 1: Form gửi lời chúc */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTag}>VIẾT LỜI CHÚC</span>
              <h3 className={styles.cardTitle}>Gửi lời chúc đến cô dâu chú rể ✨</h3>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="wish-name" className={styles.label}>
                  Tên của bạn
                </label>
                <input
                  id="wish-name"
                  type="text"
                  className={styles.input}
                  placeholder="Nhập tên của bạn..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="wish-message" className={styles.label}>
                    Lời chúc
                  </label>
                  <span className={styles.charCount}>{message.length}/500</span>
                </div>
                <textarea
                  id="wish-message"
                  className={styles.textarea}
                  placeholder="Gửi những lời chúc tốt đẹp và ý nghĩa nhất..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              {success && (
                <p className={styles.successMsg}>
                  💌 Cảm ơn bạn! Lời chúc đã được gửi thành công.
                </p>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? "Đang gửi..." : "💌 Gửi Lời Chúc"}
              </button>
            </form>
          </div>

          {/* Card 2: Danh sách lời chúc */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.headerWithBadge}>
                <div>
                  <span className={styles.cardTag}>SỔ LƯU NIỆM</span>
                  <h3 className={styles.cardTitle}>Lời chúc từ mọi người</h3>
                </div>
                <span className={styles.countBadge}>
                  {wishes.length} lời chúc
                </span>
              </div>
            </div>

            <div className={styles.listContainer}>
              {wishes.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>💌</span>
                  <p className={styles.emptyText}>
                    Chưa có lời chúc nào. Hãy là người đầu tiên gửi trao yêu thương nhé!
                  </p>
                </div>
              ) : (
                <div className={styles.wishCards}>
                  {wishes.map((w) => (
                    <div key={w._id} className={styles.wishCard}>
                      <div className={styles.wishHeader}>
                        <div className={styles.avatar}>
                          {w.name.trim().charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.meta}>
                          <p className={styles.wishName}>{w.name}</p>
                          <p className={styles.wishDate}>
                            {formatDate(w.createdAt)}
                          </p>
                        </div>
                        <span className={styles.wishHeart}>♥</span>
                      </div>
                      <p className={styles.wishMessage}>
                        &ldquo;{w.message}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
