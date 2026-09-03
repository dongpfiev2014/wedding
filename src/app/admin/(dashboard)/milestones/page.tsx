"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/admin/admin-page.module.css";

interface Milestone {
  _id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

const EMPTY: Omit<Milestone, "_id"> = { date: "", title: "", description: "", imageUrl: "", order: 0 };

export default function MilestonesPage() {
  const [items, setItems] = useState<Milestone[]>([]);
  const [modal, setModal] = useState<Partial<Milestone> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch("/api/milestones").then((r) => r.json()).then((d) => setItems(d.milestones || []));

  useEffect(() => { load(); }, []);

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
    await fetch("/api/milestones", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const uploadImg = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "wedding/milestones");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setModal((p) => ({ ...p, imageUrl: data.url }));
    setUploading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>🗓 Hành trình của chúng mình</h1>
        <button className={styles.addBtn} onClick={() => setModal(EMPTY)}>+ Thêm mốc</button>
      </div>

      <div className={styles.itemList}>
        {items.map((item) => (
          <div key={item._id} className={styles.item}>
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.title} width={80} height={60} className={styles.itemImg} />
            ) : (
              <div className={styles.itemImgPlaceholder}>📷</div>
            )}
            <div className={styles.itemContent}>
              <p className={styles.itemDate}>{item.date}</p>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemDesc}>{item.description}</p>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => setModal(item)}>Sửa</button>
              <button className={styles.deleteBtn} onClick={() => del(item._id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className={styles.modal} onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>{modal._id ? "Chỉnh sửa mốc" : "Thêm mốc mới"}</h2>
            <div className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Ngày</label>
                <input className={styles.input} value={modal.date || ""} onChange={(e) => setModal((p) => ({ ...p, date: e.target.value }))} placeholder="vd: 31/01/2025" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Tiêu đề</label>
                <input className={styles.input} value={modal.title || ""} onChange={(e) => setModal((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nội dung</label>
                <textarea className={styles.textarea} rows={4} value={modal.description || ""} onChange={(e) => setModal((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Thứ tự (order)</label>
                <input type="number" className={styles.input} value={modal.order || 0} onChange={(e) => setModal((p) => ({ ...p, order: +e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ảnh</label>
                {modal.imageUrl && <Image src={modal.imageUrl} alt="" width={200} height={120} style={{ objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />}
                <label className={styles.uploadLabel}>
                  {uploading ? "Đang upload..." : "📤 Upload ảnh"}
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f); }} />
                </label>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setModal(null)}>Hủy</button>
                <button className={styles.saveBtn} onClick={save} disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
