import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoSymbol}>囍</span>
          <p className={styles.logoText}>Admin Panel</p>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem}>🏠 Dashboard</Link>
          <Link href="/admin/settings" className={styles.navItem}>⚙️ Cài đặt chung</Link>
          <Link href="/admin/milestones" className={styles.navItem}>🗓 Hành trình</Link>
          <Link href="/admin/gallery" className={styles.navItem}>🖼 Thư viện ảnh</Link>
          <Link href="/admin/wishes" className={styles.navItem}>💌 Lời chúc</Link>
          <Link href="/admin/venues" className={styles.navItem}>📍 Địa điểm & Maps</Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.viewSite} target="_blank">👁 Xem trang web</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
            <button type="submit" className={styles.logoutBtn}>🚪 Đăng xuất</button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
