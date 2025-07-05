import React, { useContext, useState } from "react";
import styles from "./comments.module.css";
import { Edit3, Reply, Trash } from "lucide-react";
import { getDate } from "@/helper/helper";
import { AuthContext } from "@/context/AuthContext";

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
        <img
          src={comment.comment_avatar || "/images/profile.png"}
          alt={comment.commenter_name}
          className={styles.avatar}
          onError={(e) => (e.target.src = "/images/profile.png")}
        />
        <div className={styles.commentInfo}>
          <h4 className={styles.authorName}>
            {comment.commenter_name} |{" "}
            {comment.role === "admin" ? "مدیر" : "کاربر"}{" "}
          </h4>
          <span className={styles.timestamp}>
            {getDate(!comment.updated_at?comment.created_at:comment.updated_at)}
          </span>
        </div>
        <div className={styles.commentActions}>
          {comment.userID !== user?.id ? (
            <>
              {!isReply && (
                <button
                  className={styles.actionButton}
                  onClick={() =>
                    user
                      ? setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
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
                className={styles.actionButton}
                onClick={() => {
                  user
                    ? setEditComment(
                        editComment === comment.id ? null : comment.id
                      )
                    : null;
                  user && setEditContent(comment.comment);
                }}
              >
                <Edit3 size={16} />
              </button>
              <button
                className={styles.actionButtonRemove}
                onClick={() => user && setDeleteComment(comment.id)}
              >
                <Trash size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.commentContent}>
        <p>{comment.comment}</p>
      </div>

      {replyingTo === comment.id && (
        <div className={styles.replyForm}>
          <img
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
      {editComment === comment.id && (
        <div className={styles.replyForm}>
          <img
            src="/images/profile.png"
            alt="Your avatar"
            className={styles.replyAvatar}
            onError={(e) => (e.currentTarget.src = "/images/profile.png")}
          />
          <div className={styles.replyInputContainer}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="ویرایش خود را بنویسید..."
              className={styles.replyInput}
            ></textarea>
            <div className={styles.replyActions}>
              <button
                onClick={() => handleEdit(comment.id)}
                className={styles.submitReply}
                disabled={!editContent.trim()}
              >
                ویرایش
              </button>
              <button
                onClick={() => {
                  setEditComment(null);
                  setEditContent("");
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
              key={reply.id}
              comment={reply}
              parentId={comment.id}
              isReply={true}
              setEditContent={setEditContent}
              setEditComment={setEditComment}
              editComment={editComment}
              editContent={editContent}
              handleEdit={() => handleEdit(reply.id)}
              setDeleteComment={() => setDeleteComment(reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
