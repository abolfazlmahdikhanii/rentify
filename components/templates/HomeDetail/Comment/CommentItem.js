import React, { useContext, useState } from "react";
import styles from "./comments.module.css";
import { Edit3, Reply, Trash } from "lucide-react";
import { getDate } from "@/helper/helper";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";

const CommentItem = ({
  comment,
  parentId,
  replyingTo,
  setReplyingTo,
  setReplyContent,
  replyContent,
  handleAddReply,
  isReply = false,
  editComment,
  editContent,
  setEditComment,
  setEditContent,
  handleEdit,
  setDeleteComment,
}) => {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <Image
          width={40}
          height={40}
          src={comment.comment_avatar || "/images/profile.png"}
          alt={comment.commenter_name}
          className={styles.avatar}
          onError={(e) => (e.target.src = "/images/profile.png")}
        />
        <div className={styles.commentInfo}>
          <h4 className={styles.authorName}>
            {comment.userId.name} {comment.userId.lastName} |{" "}
            {comment.role === "admin" ? "مدیر" : "کاربر"}{" "}
          </h4>
          <span className={styles.timestamp}>
            {getDate(
              !comment.updatedAt ? comment.createdAt : comment.updatedAt,
            )}
          </span>
        </div>
        <div className={styles.commentActions}>
          {comment.userId._id.toString() !== user?.id.toString() ? (
            <>
              {!isReply && (
                <button
                  className={styles.actionButton}
                  onClick={() =>
                    user
                      ? setReplyingTo(
                          replyingTo === comment._id ? null : comment._id,
                        )
                      : null
                  }
                >
                  <Reply size={16} />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className={styles.actionButtonRemove}
                onClick={() => user && setDeleteComment(comment._id)}
              >
                <Trash size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.commentContent}>
        <p>{comment.content}</p>
      </div>

      {replyingTo === comment._id && (
        <div className={styles.replyForm}>
          <Image
            width={40}
            height={40}
            src="/images/profile.png"
            alt="Your avatar"
            className={styles.replyAvatar}
            onError={(e) => (e.currentTarget.src = "/images/profile.png")}
          />
          <div className={styles.replyInputContainer}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="پاسخ خود را بنویسید..."
              className={styles.replyInput}
            ></textarea>
            <div className={styles.replyActions}>
              <button
                onClick={() => handleAddReply(comment.id)}
                className={styles.submitReply}
                disabled={!replyContent.trim()}
              >
                ارسال پاسخ
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
                className={styles.cancelReply}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
     

      {comment.replies?.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              parentId={comment._id}
              isReply={true}
        
              handleEdit={() => handleEdit(reply._id)}
              setDeleteComment={() => setDeleteComment(reply._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
