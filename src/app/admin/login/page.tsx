"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        username,
        password,
        callbackUrl: "/admin",
        redirect: false,
      });

      if (res?.error) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng!");
        setLoading(false);
      } else if (res?.ok) {
        window.location.href = "/admin";
      } else {
        setError("Không thể đăng nhập, vui lòng thử lại!");
        setLoading(false);
      }
    } catch {
      setError("Có lỗi xảy ra trong quá trình đăng nhập.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>囍</div>
        <h1 className={styles.title}>Admin</h1>
        <p className={styles.subtitle}>Minh Đông & Diệu Linh Wedding</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="admin-username">Tên đăng nhập</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <a href="/" className={styles.back}>← Về trang chủ</a>
      </div>
    </div>
  );
}
