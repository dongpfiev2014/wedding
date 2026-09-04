"use client";
import { useState } from "react";
import styles from "./InvitationCard.module.css";

interface Props {
  settings: Record<string, string>;
}

const CALENDAR_DAYS = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, null],
  [28, 29, 30, null, null, null, null],
];

function MiniCalendar({ highlight1, highlight2 }: { highlight1: number; highlight2: number }) {
  return (
    <div className={styles.calendar}>
      <div className={styles.calMonth}>THÁNG 09</div>
      <div className={styles.calGrid}>
        {["T2","T3","T4","T5","T6","T7","CN"].map(d => (
          <div key={d} className={styles.calHeader}>{d}</div>
        ))}
        {CALENDAR_DAYS.flat().map((day, i) => (
          <div
            key={i}
            className={`${styles.calDay} ${day === highlight1 ? styles.heart1 : ""} ${day === highlight2 ? styles.heart2 : ""}`}
          >
            {day || ""}
            {day === highlight1 && <span className={styles.heartIcon}>♡</span>}
            {day === highlight2 && <span className={styles.heartIconFilled}>♥</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InvitationCard({ settings }: Props) {
  const [activeCard, setActiveCard] = useState<"groom" | "bride">("groom");

  return (
    <section id="invitation" className={styles.section}>
      <div className={styles.container}>
        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeCard === "groom" ? styles.tabActive : ""}`}
            onClick={() => setActiveCard("groom")}
          >
            🏠 Nhà Trai
          </button>
          <button
            className={`${styles.tab} ${activeCard === "bride" ? styles.tabActive : ""}`}
            onClick={() => setActiveCard("bride")}
          >
            🏡 Nhà Gái
          </button>
        </div>

        {/* THIỆP NHÀ TRAI */}
        <div className={`${styles.cardWrapper} ${activeCard === "groom" ? styles.cardVisible : styles.cardHidden}`}>
          <div className={styles.card}>
            {/* LEFT — Tiệc 19/09 */}
            <div className={styles.cardLeft}>
              <p className={styles.kinhMoi}>TRÂN TRỌNG KÍNH MỜI</p>
              <div className={styles.dotLine} />
              <p className={styles.denDu}>
                ĐẾN DỰ BỮA CƠM THÂN MẬT<br />CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
              </p>
              <div className={styles.namesBlock}>
                <p className={styles.scriptName}>{settings.groomName || "Minh Đông"}</p>
                <p className={styles.ampersand}>&</p>
                <p className={styles.scriptName}>{settings.brideName || "Diệu Linh"}</p>
              </div>
              <p className={styles.venueLabel}>TẠI: {settings.groomVenueTitle || "TƯ GIA NHÀ TRAI"}</p>
              <p className={styles.venueAddress}>{settings.groomVenueAddress || "Thôn Hồng Thái – Xã Lập Thạch – Tỉnh Phú Thọ"}</p>
              <a
                href="https://www.google.com/maps?q=21.4265580,105.4578040"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                📍 Chỉ đường Google Maps
              </a>
              <p className={styles.timeLabel}>
                VÀO LÚC: {settings.groomPartyTime || "...... Giờ ......"} – {settings.groomPartyDay || "THỨ BẢY"}
              </p>
              <p className={styles.bigDate}>{settings.groomPartyDate || "19 | 09 | 2026"}</p>
              <p className={styles.lunarDate}>({settings.groomLunarParty || "Tức ngày 09 tháng 08 năm Bính Ngọ"})</p>
              <p className={styles.hanHanh}>Rất hân hạnh được đón tiếp!</p>
              <div className={styles.families}>
                <div className={styles.familySide}>
                  <p className={styles.familyTitle}>Nhà Trai</p>
                  <p className={styles.familyName}>Ông: {settings.groomFatherName || "KHỔNG CAO ĐĂNG"}</p>
                  <p className={styles.familyName}>Bà: {settings.groomMotherName || "NGUYỄN THỊ HỒNG"}</p>
                  <p className={styles.familyGroom}>Chú rể: {settings.groomName || "Minh Đông"}</p>
                </div>
                <div className={styles.familySide}>
                  <p className={styles.familyTitle}>Nhà Gái</p>
                  <p className={styles.familyName}>Ông: {settings.brideFatherName || "NGUYỄN QUỐC CƯỜNG"}</p>
                  <p className={styles.familyName}>Bà: {settings.brideMotherName || "NGUYỄN THỊ KIM ANH"}</p>
                  <p className={styles.familyGroom}>Cô dâu: {settings.brideName || "Diệu Linh"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Lễ Thành Hôn 20/09 */}
            <div className={styles.cardRight}>
              <div className={styles.doubleHappiness}>囍</div>
              <MiniCalendar highlight1={19} highlight2={20} />
              <p className={styles.ceremonyScript}>Lễ Thành Hôn</p>
              <p className={styles.venueLabel}>TẠI: {settings.groomVenueTitle || "TƯ GIA NHÀ TRAI"}</p>
              <p className={styles.venueAddress}>{settings.groomVenueAddress || "Thôn Hồng Thái – Xã Lập Thạch – Tỉnh Phú Thọ"}</p>
              <a
                href="https://www.google.com/maps?q=21.4265580,105.4578040"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                📍 Chỉ đường Google Maps
              </a>
              <p className={styles.timeLabel}>
                VÀO LÚC: {settings.groomWeddingTime || "11 GIỜ 35"} – {settings.groomWeddingDay || "CHỦ NHẬT"}
              </p>
              <p className={styles.bigDate}>{settings.groomWeddingDate || "20 | 09 | 2026"}</p>
              <p className={styles.lunarDate}>({settings.groomLunarWedding || "Tức ngày 10 tháng 08 năm Bính Ngọ"})</p>
              <p className={styles.vinh}>
                Sự hiện diện của Quý khách là<br />niềm vinh hạnh cho gia đình chúng tôi!
              </p>
            </div>
          </div>
        </div>

        {/* THIỆP NHÀ GÁI */}
        <div className={`${styles.cardWrapper} ${activeCard === "bride" ? styles.cardVisible : styles.cardHidden}`}>
          <div className={styles.card}>
            {/* LEFT — Tiệc 19/09 nhà gái */}
            <div className={styles.cardLeft}>
              <p className={styles.kinhMoi}>TRÂN TRỌNG KÍNH MỜI</p>
              <div className={styles.dotLine} />
              <p className={styles.denDu}>
                ĐẾN DỰ BỮA CƠM THÂN MẬT<br />CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
              </p>
              <div className={styles.namesBlock}>
                <p className={styles.scriptName}>{settings.brideName || "Diệu Linh"}</p>
                <p className={styles.ampersand}>&</p>
                <p className={styles.scriptName}>{settings.groomName || "Minh Đông"}</p>
              </div>
              <p className={styles.venueLabel}>TẠI: {settings.brideVenueTitle || "TƯ GIA NHÀ GÁI"}</p>
              <p className={styles.venueAddress}>{settings.brideVenueAddress || "Khu 4 – Ngã Ba Đồng Xuân – Thôn Thành Công – Tỉnh Phú Thọ"}</p>
              <a
                href="https://www.google.com/maps?q=21.4440130,105.4731350"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                📍 Chỉ đường Google Maps
              </a>
              <p className={styles.timeLabel}>
                VÀO LÚC: {settings.bridePartyTime || "...... Giờ ......"} – {settings.bridePartyDay || "THỨ BẢY"}
              </p>
              <p className={styles.bigDate}>{settings.bridePartyDate || "19 | 09 | 2026"}</p>
              <p className={styles.lunarDate}>({settings.brideLunarParty || "Tức ngày 09 tháng 08 năm Bính Ngọ"})</p>
              <p className={styles.hanHanh}>Rất hân hạnh được đón tiếp!</p>
              <div className={styles.families}>
                <div className={styles.familySide}>
                  <p className={styles.familyTitle}>Nhà Gái</p>
                  <p className={styles.familyName}>Ông: {settings.brideFatherName || "NGUYỄN QUỐC CƯỜNG"}</p>
                  <p className={styles.familyName}>Bà: {settings.brideMotherName || "NGUYỄN THỊ KIM ANH"}</p>
                  <p className={styles.familyGroom}>Cô dâu: {settings.brideName || "Diệu Linh"}</p>
                </div>
                <div className={styles.familySide}>
                  <p className={styles.familyTitle}>Nhà Trai</p>
                  <p className={styles.familyName}>Ông: {settings.groomFatherName || "KHỔNG CAO ĐĂNG"}</p>
                  <p className={styles.familyName}>Bà: {settings.groomMotherName || "NGUYỄN THỊ HỒNG"}</p>
                  <p className={styles.familyGroom}>Chú rể: {settings.groomName || "Minh Đông"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Lễ Vu Quy 20/09 */}
            <div className={styles.cardRight}>
              <div className={styles.doubleHappiness}>囍</div>
              <MiniCalendar highlight1={19} highlight2={20} />
              <p className={styles.ceremonyScript}>Lễ Vu Quy</p>
              <p className={styles.venueLabel}>TẠI: {settings.brideVenueTitle || "TƯ GIA NHÀ GÁI"}</p>
              <p className={styles.venueAddress}>{settings.brideVenueAddress || "Khu 4 – Ngã Ba Đồng Xuân – Thôn Thành Công – Tỉnh Phú Thọ"}</p>
              <a
                href="https://www.google.com/maps?q=21.4440130,105.4731350"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                📍 Chỉ đường Google Maps
              </a>
              <p className={styles.timeLabel}>
                VÀO LÚC: {settings.brideWeddingTime || "10 GIỜ 20"} – {settings.brideWeddingDay || "CHỦ NHẬT"}
              </p>
              <p className={styles.bigDate}>{settings.brideWeddingDate || "20 | 09 | 2026"}</p>
              <p className={styles.lunarDate}>({settings.brideLunarWedding || "Tức ngày 10 tháng 08 năm Bính Ngọ"})</p>
              <p className={styles.vinh}>
                Sự hiện diện của Quý khách là<br />niềm vinh hạnh cho gia đình chúng tôi!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
