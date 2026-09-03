"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./WeddingGift.module.css";

interface Props {
  settings: Record<string, string>;
}

function PhotoQRCard({
  name,
  account,
  owner,
  photoUrl,
  qrUrl,
  icon,
}: {
  name: string;
  account: string;
  owner: string;
  photoUrl: string;
  qrUrl: string;
  icon: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    if (!account) return;
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const saveQR = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${name.replace(/\s/g, "-")}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.card}>
      {/* ── Photo with centred QR overlay ── */}
      <div className={styles.photoWrap}>
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className={styles.personPhoto}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className={styles.photoFallback}>
            <span>{icon}</span>
          </div>
        )}

        <div className={styles.photoOverlay} />

        {/* QR centred */}
        <div className={styles.qrOverlay}>
          {qrUrl ? (
            <div className={styles.qrFrame}>
              <Image
                src={qrUrl}
                alt={`QR ${name}`}
                width={140}
                height={140}
                className={styles.qrImg}
              />
            </div>
          ) : (
            <div className={styles.qrPlaceholder}>
              <span>📲</span>
              <p>Upload QR tại /admin</p>
            </div>
          )}
        </div>

        {/* Name badge at bottom of photo */}
        <div className={styles.nameBadge}>
          <span className={styles.nameIcon}>{icon}</span>
          <span className={styles.personName}>{name}</span>
        </div>
      </div>

      {/* ── Info panel below photo ── */}
      <div className={styles.infoPanel}>
        {/* Owner name */}
        <p className={styles.ownerName}>{owner || name}</p>

        {/* Account row */}
        <div className={styles.accountRow}>
          <span className={styles.accountNum}>{account || "—"}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
            onClick={copyAccount}
            disabled={!account}
            id={`copy-btn-${name}`}
            title="Sao chép số tài khoản"
          >
            {copied ? (
              "✓ Đã sao chép"
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                SAO CHÉP
              </>
            )}
          </button>
        </div>

        {/* Download QR */}
        <button
          className={styles.downloadBtn}
          onClick={saveQR}
          disabled={!qrUrl}
          id={`download-qr-${name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          LƯU ẢNH QR
        </button>
      </div>
    </div>
  );
}

export default function WeddingGift({ settings }: Props) {
  return (
    <section id="gift" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.subtitle}>GỬI MỪNG CƯỚI</p>
        <h2 className={styles.title}>Trao Gửi Yêu Thương</h2>
        <div className={styles.divider} />
        <p className={styles.desc}>
          Nếu bạn muốn gửi quà mừng đến cô dâu và chú rể,<br />
          chúng mình trân trọng đón nhận mọi tình cảm ✨
        </p>

        <div className={styles.grid}>
          <PhotoQRCard
            name={settings.groomName || "Minh Đông"}
            account={settings.groomBankAccount || ""}
            owner={settings.groomBankOwner || "Khổng Minh Đông"}
            photoUrl={settings.groomPhotoUrl || ""}
            qrUrl={settings.groomQrUrl || ""}
            icon="💍"
          />
          <PhotoQRCard
            name={settings.brideName || "Diệu Linh"}
            account={settings.brideBankAccount || ""}
            owner={settings.brideBankOwner || "Lê Diệu Linh"}
            photoUrl={settings.bridePhotoUrl || ""}
            qrUrl={settings.brideQrUrl || ""}
            icon="💐"
          />
        </div>
      </div>
    </section>
  );
}
