import Link from "next/link";
import styles from "./dashboard.module.css";

const CARDS = [
  { href: "/admin/settings",   icon: "⚙️",  title: "Cài đặt chung",    desc: "Chỉnh tên, ngày giờ, lời cảm ơn, QR thanh toán" },
  { href: "/admin/milestones", icon: "🗓",  title: "Hành trình",        desc: "Thêm / sửa / xóa các mốc hành trình của đôi bạn" },
  { href: "/admin/gallery",    icon: "🖼",  title: "Thư viện ảnh",      desc: "Upload ảnh kỷ niệm cho mục Our Memories" },
  { href: "/admin/wishes",     icon: "💌",  title: "Lời chúc",          desc: "Xem và xóa lời chúc từ khách mời" },
  { href: "/admin/venues",     icon: "📍",  title: "Địa điểm & Maps",   desc: "Cập nhật địa chỉ và link Google Maps 2 nhà" },
];

export default function AdminDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Quản lý thiệp cưới online Minh Đông & Diệu Linh 💍</p>
      </div>

      <div className={styles.grid}>
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className={styles.card}>
            <span className={styles.cardIcon}>{c.icon}</span>
            <h2 className={styles.cardTitle}>{c.title}</h2>
            <p className={styles.cardDesc}>{c.desc}</p>
            <span className={styles.cardArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
