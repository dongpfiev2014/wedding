"use client";
import styles from "./Venue.module.css";

interface Props {
  settings: Record<string, string>;
}

export default function Venue({ settings }: Props) {
  return (
    <section id="venue" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>ĐỊA ĐIỂM</p>
        <h2 className={styles.title}>Đường Đến Với Chúng Mình</h2>
        <div className={styles.divider} />

        <div className={styles.grid}>
          {/* Nhà Trai */}
          <div className={styles.venueCard}>
            <div className={styles.venueHeader}>
              <span className={styles.venueIcon}>🏠</span>
              <div>
                <p className={styles.venueSide}>Nhà Trai</p>
                <h3 className={styles.venueTitle}>{settings.groomVenueTitle || "TƯ GIA NHÀ TRAI"}</h3>
              </div>
            </div>
            <p className={styles.venueAddress}>{settings.groomVenueAddress || "Thôn Hồng Thái – Xã Lập Thạch – Tỉnh Phú Thọ"}</p>
            <div className={styles.venueTimes}>
              <div className={styles.venueEvent}>
                <span className={styles.eventLabel}>Tiệc Nhà Trai</span>
                <span className={styles.eventDate}>{settings.groomPartyTime ? `${settings.groomPartyTime} – ` : ""}Thứ Bảy 19/09/2026</span>
              </div>
              <div className={styles.venueEvent}>
                <span className={styles.eventLabel}>Lễ Thành Hôn</span>
                <span className={styles.eventDate}>{settings.groomWeddingTime || "11 Giờ 35"} – Chủ Nhật 20/09/2026</span>
              </div>
            </div>
            <div className={styles.mapBox}>
              <iframe
                src={settings.groomMapEmbed || "https://maps.google.com/maps?q=Lập+Thạch,+Vĩnh+Phúc&output=embed"}
                className={styles.map}
                loading="lazy"
                title="Địa điểm nhà trai"
                allowFullScreen
              />
            </div>
            <a
              href={settings.groomMapUrl || "https://maps.google.com/?q=Lập+Thạch,+Vĩnh+Phúc"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dirBtn}
            >
              📍 Chỉ đường Google Maps
            </a>
          </div>

          {/* Nhà Gái */}
          <div className={styles.venueCard}>
            <div className={styles.venueHeader}>
              <span className={styles.venueIcon}>🏡</span>
              <div>
                <p className={styles.venueSide}>Nhà Gái</p>
                <h3 className={styles.venueTitle}>{settings.brideVenueTitle || "TƯ GIA NHÀ GÁI"}</h3>
              </div>
            </div>
            <p className={styles.venueAddress}>{settings.brideVenueAddress || "Khu 4 – Ngã Ba Đồng Xuân – Thôn Thành Công – Tỉnh Phú Thọ"}</p>
            <div className={styles.venueTimes}>
              <div className={styles.venueEvent}>
                <span className={styles.eventLabel}>Tiệc Nhà Gái</span>
                <span className={styles.eventDate}>{settings.bridePartyTime ? `${settings.bridePartyTime} – ` : ""}Thứ Bảy 19/09/2026</span>
              </div>
              <div className={styles.venueEvent}>
                <span className={styles.eventLabel}>Lễ Vu Quy</span>
                <span className={styles.eventDate}>{settings.brideWeddingTime || "10 Giờ 20"} – Chủ Nhật 20/09/2026</span>
              </div>
            </div>
            <div className={styles.mapBox}>
              <iframe
                src={settings.brideMapEmbed || "https://maps.google.com/maps?q=Thành+Công,+Phú+Thọ&output=embed"}
                className={styles.map}
                loading="lazy"
                title="Địa điểm nhà gái"
                allowFullScreen
              />
            </div>
            <a
              href={settings.brideMapUrl || "https://maps.google.com/?q=Thành+Công,+Phú+Thọ"}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dirBtn}
            >
              📍 Chỉ đường Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
