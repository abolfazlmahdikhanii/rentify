import { useEffect, useState } from "react";
import styles from "./commentDetail.module.css";
import {
  Check,
  CircleCheckBig,
  LucideEllipsis,
  Trash,
  XCircle,
} from "lucide-react";
import { getDate, getStatusText } from "@/helper/helper";

const CommentDetail = ({
  isOpen,
  onClose,
  comment,
  setIsReply,
  setCommentId,
  setIsOpenDeleteModal,
  onApprove,
  onReject,
  onUpdate,
}) => {
  const [newComment, setNewComment] = useState(comment || {});
  // Track which reply's menu is open using its ID
  const [openMenuId, setOpenMenuId] = useState(null);
  
  if (!isOpen) return null;

  const handleMenuToggle = (replyId) => {
    setOpenMenuId(openMenuId === replyId ? null : replyId);
  };

  const handleAction = (action, replyId) => {
    // Close the menu after action
    setOpenMenuId(null);
    // Execute the action (approve/reject
     action(replyId);
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
                <span className={styles.userName}>
                  {newComment.name} {newComment.last_name}
                </span>
                <span className={styles.timestamp}>
                  {getDate(
                    newComment.updated_at
                      ? newComment.updated_at
                      : newComment.created_at
                  )}
                </span>
              </div>
              <div className={styles.commentActions}>
                <p className={`status status__${newComment.status}`}>
                  {getStatusText(newComment.status)}
                </p>
              </div>
            </div>
            <div className={styles.commentContent}>{newComment.content}</div>
            <div className={styles.commentFooter}>
              <span className={styles.location}>
                ملک: {newComment.property_title}
              </span>
            </div>
          </div>

          {/* Replies Section */}
          <div className={styles.repliesSection}>
            <div className={styles.repliesHeader}>
              <span className={styles.repliesCount}>
                پاسخ‌ها ({newComment.replies?.length || 0})
              </span>
            </div>

            {newComment.replies?.map((item) => (
              <div className={styles.replyItem} key={item.id}>
                <div className={styles.replyHeader}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>
                      {item.name} {item.last_name}
                    </span>
                    <span className={styles.timestamp}>
                      {getDate(
                        item.updated_at ? item.updated_at : item.created_at
                      )}
                    </span>
                  </div>
                  <div className={styles.replyActions}>
                    <p className={`status status__${item.status}`}>
                      {getStatusText(item.status)}
                    </p>
                    <div className={styles.menuContainer}>
                      <button
                        className={styles.moreButton}
                        onClick={() => handleMenuToggle(item.id)}
                      >
                        <LucideEllipsis size={17} />
                      </button>
                      {openMenuId === item.id && (
                        <div
                          className={styles.dropdownMenu}
                          onMouseLeave={() => setOpenMenuId(null)}
                        >
                          {item.status !== "approved" && (
                            <div
                              className={styles.dropdownMenuItem}
                              onClick={() => handleAction(onApprove, item.id)}
                            >
                              <CircleCheckBig size={14} /> تائید کردن
                            </div>
                          )}
                          {item.status !== "rejected" && (
                            <div
                              className={styles.dropdownMenuItem}
                              onClick={() => handleAction(onReject, item.id)}
                            >
                              <XCircle size={14} /> رد کردن
                            </div>
                          )}
                          <div
                            className={styles.dropdownMenuItem}
                            onClick={() => {
                              setOpenMenuId(null);

                              setIsOpenDeleteModal(true);
                              setCommentId(item.id);
                              onClose();
                            }}
                          >
                            <Trash size={14} /> حذف
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.replyContent}>{item.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={`${styles.addReplyButton}`}
            onClick={() => {
              setIsReply(true);
              setCommentId(comment.id);
              onClose();
            }}
          >
            پاسخ دادن
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDetail;
