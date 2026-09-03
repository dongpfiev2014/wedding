"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/admin/admin-page.module.css";
import galleryStyles from "./gallery.module.css";

interface Photo { _id: string; imageUrl: string; caption: string; imagePublicId: string; }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => fetch("/api/gallery").then((r) => r.json()).then((d) => setPhotos(d.photos || []));
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "wedding/gallery");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: data.url, imagePublicId: data.publicId, caption: "", order: photos.length }),
        });
      }
    }
    setUploading(false);
    load();
  };

  const del = async (photo: Photo) => {
    if (!confirm("Xóa ảnh này?")) return;
    await fetch("/api/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: photo._id, imagePublicId: photo.imagePublicId }) });
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>🖼 Thư viện ảnh kỷ niệm</h1>
        <label className={styles.addBtn}>
          {uploading ? "Đang upload..." : "+ Thêm ảnh"}
          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) upload(e.target.files); }} disabled={uploading} />
        </label>
      </div>

      {/* Drop zone */}
      <label className={galleryStyles.dropZone}>
        <span>📤 Kéo thả ảnh vào đây hoặc click để chọn (có thể chọn nhiều ảnh)</span>
        <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) upload(e.target.files); }} disabled={uploading} />
      </label>

      {uploading && <p className={galleryStyles.uploadMsg}>⏳ Đang upload lên Cloudinary...</p>}

      <div className={galleryStyles.grid}>
        {photos.map((p) => (
          <div key={p._id} className={galleryStyles.photoCard}>
            <Image src={p.imageUrl} alt={p.caption || "Memory"} width={200} height={150} className={galleryStyles.photo} />
            <button className={galleryStyles.delBtn} onClick={() => del(p)} title="Xóa ảnh">✕</button>
          </div>
        ))}
        {photos.length === 0 && !uploading && (
          <div className={galleryStyles.empty}>
            <span>📷</span>
            <p>Chưa có ảnh nào. Hãy upload ảnh kỷ niệm của bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
