// components/Modal/Modal.jsx
import { useState } from "react";
import styles from "./commentDetail.module.css";
import { Check, CircleCheckBig, LucideEllipsis, XCircle } from "lucide-react";

const CommentDetail = ({ isOpen, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [isMore, setIsMore] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>جزییات نظر</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Comment Item */}
          <div className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>رضا محمدی</span>

                <span className={styles.timestamp}>۱۴۰۲/۰۲/۱۵</span>
              </div>
              <div className={styles.commentActions}>
                <button className={styles.actionButton}>تائید شده</button>
              </div>
            </div>
            <div className={styles.commentContent}>
              این ملک بسیار زیبا و مناسب است. آیا امکان بازدید حضوری وجود دارد؟
            </div>
            <div className={styles.commentFooter}>
              <span className={styles.location}>ملک: آپارتمان ۱۲۰ متری</span>
            </div>
          </div>

          {/* Replies Section */}
          <div className={styles.repliesSection}>
            <div className={styles.repliesHeader}>
              <span className={styles.repliesCount}>پاسخ‌ها (۲)</span>
            </div>

            <div className={styles.replyItem}>
              <div className={styles.replyHeader}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>مدیر سایت</span>
                  <span className={styles.timestamp}>۱۴۰۲/۰۲/۱۶</span>
                </div>
                <div className={styles.replyActions}>
                  <button className={styles.actionButton}>تائید شده</button>
                  <button
                    className={styles.moreButton}
                    onClick={() => setIsMore((prev) => !prev)}
                  >
                    <LucideEllipsis size={17} />
                  </button>
                  {isMore && (
                    <div
                      className={styles.dropdownMenu}
                      onBlur={() => setIsMore(false)}
                      onMouseLeave={() => setIsMore(false)}
                    >
                      <div className={styles.dropdownMenuItem}>
                        <CircleCheckBig size={14} /> تائید کردن
                      </div>
                      <div className={styles.dropdownMenuItem}>
                        <XCircle size={14} /> رد کردن
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.replyContent}>
                بله، حتماً لطفاً با شماره تماس موجود در آگهی تماس بگیرید.
              </div>
            </div>
          </div>

        
        </div>
          <div className={styles.footer}>
            <button className={`${styles.addReplyButton}`}> پاسخ دادن</button>
          </div>
      </div>
    </div>
  );
};

export default CommentDetail;
