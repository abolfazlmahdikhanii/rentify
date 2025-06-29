import { useContext, useState } from "react";
import styles from "./comment-modal.module.css";
import { X, Send } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function CommentModal({ isOpen, onClose, onSubmit,title="" }) {
  const {user}=useContext(AuthContext)
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{!title?"نظر جدید":"پاسخ نظر"}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.userInfo}>
            <img
              src="/images/profile.png"
              alt="Your avatar"
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name} {user.lastName}</span>
              <span className={styles.userRole}>{user.role==="admin"?"مدیر":"کاربر"}</span>
            </div>
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="نظر خود را اینجا بنویسید... (Ctrl+Enter برای ارسال)"
              className={styles.commentTextarea}
              autoFocus
            />
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.footerLeft}>
              <span className={styles.shortcut}>
                Ctrl+Enter برای ارسال سریع
              </span>
            </div>
            <div className={styles.footerRight}>
              <button className={styles.cancelButton} onClick={onClose}>
                لغو
              </button>
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={!content.trim()}
              >
                <Send size={16} />
                ارسال {!title?"نظر":"پاسخ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
