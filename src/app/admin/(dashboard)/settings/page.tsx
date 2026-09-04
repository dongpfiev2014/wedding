"use client";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin-page.module.css";
import { compressImage } from "@/lib/compressImage";

const FIELDS = [
  { key: "groomName", label: "Tên chú rể", group: "Cặp đôi" },
  { key: "brideName", label: "Tên cô dâu", group: "Cặp đôi" },
  { key: "saveTheDate", label: "Save the Date text (vd: 20.09.2026)", group: "Cặp đôi" },
  { key: "heroImageUrl", label: "URL ảnh nền hero (ảnh)", group: "Hero & Media", uploadType: "image" },
  { key: "heroVideoUrl", label: "URL video nền hero (video sẽ ưu tiên hơn ảnh)", group: "Hero & Media", uploadType: "video" },
  { key: "musicUrl", label: "URL file nhạc nền (.mp3)", group: "Hero & Media", uploadType: "audio" },
  { key: "groomFatherName", label: "Tên bố chú rể", group: "Gia đình" },
  { key: "groomMotherName", label: "Tên mẹ chú rể", group: "Gia đình" },
  { key: "brideFatherName", label: "Tên bố cô dâu", group: "Gia đình" },
  { key: "brideMotherName", label: "Tên mẹ cô dâu", group: "Gia đình" },
  { key: "groomPartyTime", label: "Giờ tiệc nhà trai (19/09)", group: "Thiệp Nhà Trai" },
  { key: "groomWeddingTime", label: "Giờ lễ thành hôn (20/09)", group: "Thiệp Nhà Trai" },
  { key: "bridePartyTime", label: "Giờ tiệc nhà gái (19/09)", group: "Thiệp Nhà Gái" },
  { key: "brideWeddingTime", label: "Giờ lễ vu quy (20/09)", group: "Thiệp Nhà Gái" },
  { key: "groomPhotoUrl", label: "URL ảnh chú rể (ảnh dọc, tỉ lệ 3:4)", group: "QR Mừng Cưới", uploadType: "image" },
  { key: "groomBankOwner", label: "Họ tên chủ TK chú rể", group: "QR Mừng Cưới" },
  { key: "groomBankAccount", label: "Số tài khoản chú rể", group: "QR Mừng Cưới" },
  { key: "groomQrUrl", label: "URL ảnh QR chú rể", group: "QR Mừng Cưới", uploadType: "image" },
  { key: "bridePhotoUrl", label: "URL ảnh cô dâu (ảnh dọc, tỉ lệ 3:4)", group: "QR Mừng Cưới", uploadType: "image" },
  { key: "brideBankOwner", label: "Họ tên chủ TK cô dâu", group: "QR Mừng Cưới" },
  { key: "brideBankAccount", label: "Số tài khoản cô dâu", group: "QR Mừng Cưới" },
  { key: "brideQrUrl", label: "URL ảnh QR cô dâu", group: "QR Mừng Cưới", uploadType: "image" },
  { key: "thankYouMessage", label: "Lời cảm ơn", group: "Lời Cảm Ơn", textarea: true },
  { key: "ogImageUrl", label: "URL ảnh OG (thumbnail khi share link)", group: "SEO", uploadType: "image" },
];

const GROUPS = [...new Set(FIELDS.map((f) => f.group))];

const UPLOAD_LABELS: Record<string, string> = {
  image: "📷 Upload ảnh",
  video: "🎬 Upload video",
  audio: "🎵 Upload nhạc (.mp3)",
};

const ACCEPT_MAP: Record<string, string> = {
  image: "image/*",
  video: "video/*",
  audio: "audio/mpeg,audio/*",
};

const FOLDER_MAP: Record<string, string> = {
  image: "wedding/images",
  video: "wedding/videos",
  audio: "wedding/music",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}));
  }, []);

  const handleSave = async () => {
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

  const uploadFile = async (key: string, file: File, uploadType: string) => {
    setUploading(key);
    try {
      // Only compress images; leave video/audio as-is
      const fileToUpload = uploadType === "image"
        ? await compressImage(file)
        : file;
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", FOLDER_MAP[uploadType] || "wedding");
      formData.append("resourceType", uploadType === "image" ? "image" : "video");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setSettings((prev) => ({ ...prev, [key]: data.url }));
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>⚙️ Cài đặt chung</h1>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "💾 Lưu tất cả"}
        </button>
      </div>

      {GROUPS.map((group) => (
        <div key={group} className={styles.group}>
          <h2 className={styles.groupTitle}>{group}</h2>
          <div className={styles.fields}>
            {FIELDS.filter((f) => f.group === group).map((f) => (
              <div key={f.key} className={styles.field}>
                <label className={styles.label}>{f.label}</label>
                {f.textarea ? (
                  <textarea
                    className={styles.textarea}
                    value={settings[f.key] || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, [f.key]: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    className={styles.input}
                    value={settings[f.key] || ""}
                    onChange={(e) => setSettings((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.uploadType === "video" ? "https://res.cloudinary.com/..." : ""}
                  />
                )}

                {/* Media upload shortcut */}
                {f.uploadType && (
                  <div className={styles.uploadRow}>
                    <label className={styles.uploadLabel}>
                      {uploading === f.key ? "⏳ Đang upload..." : UPLOAD_LABELS[f.uploadType]}
                      <input
                        type="file"
                        accept={ACCEPT_MAP[f.uploadType]}
                        className={styles.fileInput}
                        disabled={uploading !== null}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && f.uploadType) uploadFile(f.key, file, f.uploadType);
                        }}
                      />
                    </label>
                    {/* Inline preview */}
                    {settings[f.key] && f.uploadType === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings[f.key]}
                        alt="preview"
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, marginLeft: 12 }}
                      />
                    )}
                    {settings[f.key] && f.uploadType === "video" && (
                      <video
                        src={settings[f.key]}
                        style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 8, marginLeft: 12 }}
                        muted
                      />
                    )}
                    {settings[f.key] && f.uploadType === "audio" && (
                      <audio
                        src={settings[f.key]}
                        controls
                        style={{ height: 32, marginLeft: 12, verticalAlign: "middle" }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
