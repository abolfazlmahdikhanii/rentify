"use client";
import { useState } from "react";
import {
  X,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Check,
} from "lucide-react";
import styles from "./share-modal.module.css";

export default function ShareModal({
  isOpen,
  onClose,
  url = window.location.href,
  title = "این را ببینید!",
  description = "فکر کردم این مطلب برای شما جالب باشد.",
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareOptions = [
    {
      icon: Facebook,
      name: "فیس‌بوک",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      color: "#1877F2",
    },
    {
      icon: Twitter,
      name: "توییتر",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      color: "#1DA1F2",
    },
    {
      icon: Linkedin,
      name: "لینکدین",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      color: "#0A66C2",
    },
    {
      icon: Mail,
      name: "ایمیل",
      url: `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(description + " " + url)}`,
      color: "#EA4335",
    },
  ];

  const handleShareClick = (shareUrl) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
            <h2 className={styles.title}>اشتراک‌گذاری این محتوا</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="بستن پنجره"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.linkSection}>
            <label className={styles.label}>کپی لینک</label>
            <div className={styles.linkContainer}>
              <input
                type="text"
                value={url}
                readOnly
                className={styles.linkInput}
              />
              <button
                className={styles.copyButton}
                onClick={handleCopyLink}
                aria-label="کپی لینک"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {copied && (
              <span className={styles.copiedMessage}>
                لینک در کلیپ‌بورد کپی شد!
              </span>
            )}
          </div>
          <div className={styles.shareSection}>
            <label className={styles.label}>اشتراک‌گذاری از طریق</label>
            <div className={styles.shareGrid}>
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  className={styles.shareButton}
                  onClick={() => handleShareClick(option.url)}
                  style={{ "--share-color": option.color }}
                >
                  <option.icon size={20} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
