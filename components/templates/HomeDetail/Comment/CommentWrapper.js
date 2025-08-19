import { useContext, useState } from "react";
import styles from "./comments.module.css";
import {
  MessageCircle,
  MessageSquareMoreIcon,
  PackageOpen,
  Reply,
  Settings,
  Share2,
} from "lucide-react";
import CommentModal from "./CommentModal";
import CommentItem from "./CommentItem";
import Title from "@/components/module/Title/Title";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import EmptyItem from "@/components/module/EmptyItem/EmptyItem";

export default function CommentWrapper({ comments }) {
  const { user } = useContext(AuthContext);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editComment, setEditComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteComment, setDeleteComment] = useState(null);
  const [propertyComment, setPropertyComment] = useState(comments || []);
  const { query } = useRouter();

  const getComments = () => {
    fetch(`https://rentify-project.ir/api/comments/property/${query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPropertyComment(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddComment = (content) => {
    if (!content.trim()) {
      toast.error("متن کامنت خالی میباشد !", toastOption);
      return;
    }
    const newComment = {
      propertyId: query.id,
      content,
    };
    fetch("https://rentify-project.ir/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success("کامنت با موفقیت ثبت شد", toastOption);
          getComments();
        } else if (res.status === 500) {
          toast.error("ثبت کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .catch((err) => {
        toast.error("ثبت کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };

  const handleAddReply = (parentId) => {
    if (!replyContent.trim()) {
      toast.error("متن کامنت خالی میباشد !", toastOption);
      return;
    }
    const newComment = {
      content: replyContent,
    };
    fetch(`https://rentify-project.ir/api/comments/${parentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success("پاسخ کامنت با موفقیت ثبت شد", toastOption);
        } else if (res.status === 500) {
          toast.error("ثبت پاسخ کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        getComments();
        setReplyContent("");
        setReplyingTo(null);
      })
      .catch((err) => {
        toast.error("ثبت پاسخ کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };
  const handleEdit = (parentId) => {
    if (!editContent.trim()) {
      toast.error("متن کامنت خالی میباشد !", toastOption);
      return;
    }
    const updateComment = {
      content: editContent,
    };
    fetch(`https://rentify-project.ir/api/comments/${parentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(updateComment),
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success(" کامنت با موفقیت ویرایش شد", toastOption);
        } else if (res.status === 500) {
          toast.error("ویرایش  کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        getComments();
        setEditContent("");
        setEditComment(null);
      })
      .catch((err) => {
        toast.error("ویرایش کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };
  const handleDelete = (commentId) => {
    fetch(`https://rentify-project.ir/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success(" کامنت با موفقیت حذف شد", toastOption);
        } else if (
          res.status === 500 ||
          res.status === 404 ||
          res.status === 403
        ) {
          toast.error("حذف  کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        setDeleteComment(null);
        getComments();
      })
      .catch((err) => {
        toast.error("حذف کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };

  return (
    <div className={styles.commentsContainer}>
      <div className={styles.commentsHeader}>
        <Title title="نظرات" isComment={true} />
        <div>
          <button
            className={styles.openModalButton}
            onClick={() => (user ? setIsModalOpen(true) : null)}
          >
            ایجاد نظر جدید <MessageSquareMoreIcon size={20} />
          </button>
        </div>
      </div>

      <div className={styles.commentsList}>
        {propertyComment.length ? (
          propertyComment.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleAddReply={handleAddReply}
              editComment={editComment}
              setEditComment={setEditComment}
              editContent={editContent}
              setEditContent={setEditContent}
              handleEdit={handleEdit}
              setDeleteComment={setDeleteComment}
            />
          ))
        ) : (
          <EmptyItem title="هنوز نظری ثبت نشده است" />
        )}
      </div>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddComment}
      />
      {deleteComment && (
        <DeleteModal
          isOpen={deleteComment ? true : false}
          onClose={() => setDeleteComment(null)}
          title="حذف کامنت"
          question="آیا از تغییر نقش این کاربر اطمینان دارید؟ این عملیات قابل بازگشت نیست."
          onConfirm={() => handleDelete(deleteComment)}
        />
      )}
    </div>
  );
}
