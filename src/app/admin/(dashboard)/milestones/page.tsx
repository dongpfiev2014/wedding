"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/admin/admin-page.module.css";
import { compressImage } from "@/lib/compressImage";

interface Milestone {
  _id: string;
  date: string;
  title: string;
  description: string;
  imageUrls: string[];
  imagePublicIds: string[];
  order: number;
}

const EMPTY: Omit<Milestone, "_id"> = {
  date: "",
  title: "",
  description: "",
  imageUrls: [],
  imagePublicIds: [],
  order: 0,
};

export default function MilestonesPage() {
  const [items, setItems] = useState<Milestone[]>([]);
  const [modal, setModal] = useState<Partial<Milestone> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch("/api/milestones")
      .then((r) => r.json())
      .then((d) => setItems(d.milestones || []));

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!modal) return;
    setSaving(true);
    const method = modal._id ? "PUT" : "POST";
    await fetch("/api/milestones", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modal),
    });
    setSaving(false);
    setModal(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Xóa mốc này?")) return;
    await fetch("/api/milestones", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const uploadImg = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("folder", "wedding/milestones");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setModal((p) => ({
          ...p,
          imageUrls: [...(p?.imageUrls || []), data.url],
          imagePublicIds: [...(p?.imagePublicIds || []), data.publicId || ""],
        }));
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImg = (idx: number) => {
    setModal((p) => ({
      ...p,
      imageUrls: (p?.imageUrls || []).filter((_, i) => i !== idx),
      imagePublicIds: (p?.imagePublicIds || []).filter((_, i) => i !== idx),
    }));
  };

  // Normalize old data that might have single imageUrl string
  const openModal = (item: Milestone | Omit<Milestone, "_id">) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = item as any;
    const normalized = {
      ...raw,
      imageUrls: raw.imageUrls?.length
        ? raw.imageUrls
        : raw.imageUrl
        ? [raw.imageUrl]
        : [],
      imagePublicIds: raw.imagePublicIds?.length
        ? raw.imagePublicIds
        : raw.imagePublicId
        ? [raw.imagePublicId]
        : [],
    };
    setModal(normalized);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>🗓 Hành trình của chúng mình</h1>
        <button className={styles.addBtn} onClick={() => openModal(EMPTY)}>
          + Thêm mốc
        </button>
      </div>

      <div className={styles.itemList}>
        {items.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw = item as any;
          const firstImg = item.imageUrls?.[0] || raw.imageUrl || null;
          const imgCount = item.imageUrls?.length || (raw.imageUrl ? 1 : 0);
          return (
            <div key={item._id} className={styles.item}>
              {firstImg ? (
                <div style={{ position: "relative" }}>
                  <Image
                    src={firstImg}
                    alt={item.title}
                    width={80}
                    height={60}
                    className={styles.itemImg}
                  />
                  {imgCount > 1 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        fontSize: "0.65rem",
                        padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      +{imgCount - 1}
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.itemImgPlaceholder}>📷</div>
              )}
              <div className={styles.itemContent}>
                <p className={styles.itemDate}>{item.date}</p>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
              <div className={styles.itemActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => openModal(item)}
                >
                  Sửa
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => del(item._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div
          className={styles.modal}
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>
              {modal._id ? "Chỉnh sửa mốc" : "Thêm mốc mới"}
            </h2>
            <div className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Ngày</label>
                <input
                  className={styles.input}
                  value={modal.date || ""}
                  onChange={(e) =>
                    setModal((p) => ({ ...p, date: e.target.value }))
                  }
                  placeholder="vd: 31/01/2025"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Tiêu đề</label>
                <input
                  className={styles.input}
                  value={modal.title || ""}
                  onChange={(e) =>
                    setModal((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nội dung</label>
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={modal.description || ""}
                  onChange={(e) =>
                    setModal((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Thứ tự (order)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={modal.order || 0}
                  onChange={(e) =>
                    setModal((p) => ({ ...p, order: +e.target.value }))
                  }
                />
              </div>

              {/* Multi-image section */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Ảnh ({modal.imageUrls?.length || 0} ảnh)
                </label>

                {/* Existing images grid */}
                {(modal.imageUrls || []).length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {(modal.imageUrls || []).map((url, idx) => (
                      <div
                        key={idx}
                        style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}
                      >
                        <Image
                          src={url}
                          alt={`Ảnh ${idx + 1}`}
                          width={100}
                          height={80}
                          style={{ objectFit: "cover", width: "100%", height: 80, display: "block" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImg(idx)}
                          style={{
                            position: "absolute",
                            top: 3,
                            right: 3,
                            background: "rgba(0,0,0,0.65)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 22,
                            height: 22,
                            cursor: "pointer",
                            fontSize: 13,
                            lineHeight: "22px",
                            textAlign: "center",
                            padding: 0,
                          }}
                          title="Xóa ảnh này"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <label className={styles.uploadLabel}>
                  {uploading ? "Đang upload..." : "📤 Thêm ảnh"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.fileInput}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((f) => uploadImg(f));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setModal(null)}
                >
                  Hủy
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
