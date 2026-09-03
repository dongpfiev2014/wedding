"use client";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin-page.module.css";

const VENUE_FIELDS = [
  { section: "🏠 Nhà Trai", fields: [
    { key: "groomVenueTitle",   label: "Tên địa điểm" },
    { key: "groomVenueAddress", label: "Địa chỉ đầy đủ" },
    { key: "groomMapEmbed",     label: "Google Maps Embed URL (iframe src)" },
    { key: "groomMapUrl",       label: "Google Maps URL (nút chỉ đường)" },
  ]},
  { section: "🏡 Nhà Gái", fields: [
    { key: "brideVenueTitle",   label: "Tên địa điểm" },
    { key: "brideVenueAddress", label: "Địa chỉ đầy đủ" },
    { key: "brideMapEmbed",     label: "Google Maps Embed URL (iframe src)" },
    { key: "brideMapUrl",       label: "Google Maps URL (nút chỉ đường)" },
  ]},
];

export default function VenuesPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setSettings(d.settings || {}));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>📍 Địa điểm & Google Maps</h1>
        <button className={styles.saveBtn} onClick={save} disabled={saving}>
          {saving ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "💾 Lưu"}
        </button>
      </div>

      <div style={{ marginBottom: 12, padding: "12px 16px", background: "#FFF8EC", borderRadius: 8, border: "1px solid #E8D8C4" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: "#8C7260", lineHeight: 1.6 }}>
          💡 <strong>Cách lấy Google Maps Embed URL:</strong> Mở Google Maps → Chia sẻ → Nhúng bản đồ → Copy phần <code>src="..."</code> trong iframe.<br />
          💡 <strong>Google Maps URL:</strong> Copy link trực tiếp từ thanh địa chỉ của Google Maps.
        </p>
      </div>

      {VENUE_FIELDS.map(({ section, fields }) => (
        <div key={section} className={styles.group}>
          <h2 className={styles.groupTitle}>{section}</h2>
          <div className={styles.fields}>
            {fields.map((f) => (
              <div key={f.key} className={styles.field} style={{ gridColumn: f.key.includes("Map") ? "1 / -1" : undefined }}>
                <label className={styles.label}>{f.label}</label>
                <input
                  type="text"
                  className={styles.input}
                  value={settings[f.key] || ""}
                  onChange={(e) => setSettings((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.key.includes("Embed") ? "https://maps.google.com/maps?q=...&output=embed" : "https://maps.google.com/?q=..."}
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          {settings[section === "🏠 Nhà Trai" ? "groomMapEmbed" : "brideMapEmbed"] && (
            <div style={{ marginTop: 16, borderRadius: 10, overflow: "hidden", height: 200, border: "1px solid #E8D8C4" }}>
              <iframe
                src={settings[section === "🏠 Nhà Trai" ? "groomMapEmbed" : "brideMapEmbed"]}
                width="100%"
                height="200"
                style={{ border: "none" }}
                loading="lazy"
                title={`Preview ${section}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
