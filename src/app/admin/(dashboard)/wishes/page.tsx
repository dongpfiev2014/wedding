"use client";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin-page.module.css";
import wishStyles from "./wishes.module.css";

interface Wish { _id: string; name: string; message: string; createdAt: string; }

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);

  const load = () => fetch("/api/wishes").then((r) => r.json()).then((d) => setWishes(d.wishes || []));
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Xóa lời chúc này?")) return;
    await fetch("/api/wishes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("vi-VN");

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>💌 Lời chúc từ khách mời</h1>
        <span className={wishStyles.count}>{wishes.length} lời chúc</span>
      </div>

      {wishes.length === 0 ? (
        <div className={wishStyles.empty}>
          <span>💬</span><p>Chưa có lời chúc nào.</p>
        </div>
      ) : (
        <div className={wishStyles.list}>
          {wishes.map((w) => (
            <div key={w._id} className={wishStyles.card}>
              <div className={wishStyles.cardHeader}>
                <div className={wishStyles.avatar}>{w.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className={wishStyles.name}>{w.name}</p>
                  <p className={wishStyles.date}>{formatDate(w.createdAt)}</p>
                </div>
                <button className={styles.deleteBtn} onClick={() => del(w._id)}>Xóa</button>
              </div>
              <p className={wishStyles.message}>&ldquo;{w.message}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
