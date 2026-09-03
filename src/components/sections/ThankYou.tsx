import styles from "./ThankYou.module.css";

interface Props {
  settings: Record<string, string>;
}

export default function ThankYou({ settings }: Props) {
  return (
    <footer id="thankyou" className={styles.footer}>
      <div className={styles.container}>
        {/* Decorative double happiness */}
        <div className={styles.symbol}>囍</div>

        <p className={styles.subtitle}>LỜI CẢM ƠN</p>

        <h2 className={styles.title}>Thank You!</h2>

        <div className={styles.divider} />

        <p className={styles.message}>
          {settings.thankYouMessage ||
            "Cảm ơn bạn đã dành thời gian đến chung vui với chúng mình. Sự hiện diện của bạn là món quà ý nghĩa nhất!"}
        </p>

        <div className={styles.hearts}>
          {["♥", "♡", "♥", "♡", "♥"].map((h, i) => (
            <span key={i} className={styles.heart} style={{ animationDelay: `${i * 0.3}s` }}>
              {h}
            </span>
          ))}
        </div>

        <p className={styles.date}>{settings.saveTheDate || "20.09.2026"}</p>

        <div className={styles.signatures}>
          <span className={styles.sig}>{settings.groomName || "Minh Đông"}</span>
          <span className={styles.sigAmp}>&</span>
          <span className={styles.sig}>{settings.brideName || "Diệu Linh"}</span>
        </div>

        <div className={styles.copyright}>
          <p>Made with ♥ for our special day</p>
        </div>
      </div>
    </footer>
  );
}
