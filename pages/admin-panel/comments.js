import PropertyDialog from "@/components/templates/AdminPanel/PropertyDialog/PropertyDialog";
import { PropertyTable } from "@/components/templates/AdminPanel/PropertyTable/PropertyTable";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getDate, getStatusText, toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import {
  EllipsisVertical,
  Eye,
  MessageCircle,
  MessageSquareMoreIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
import styles from "../../styles/comment.module.css";
import CommentDetail from "@/components/templates/AdminPanel/CommentDetail/CommentDetail";
import CommentModal from "@/components/templates/HomeDetail/Comment/CommentModal";
import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import TabPanel from "@/components/module/AdminPanel/TabPanel/TabPanel";
import TabPanelItem from "@/components/module/AdminPanel/TabPanel/TabPanelItem";
const fetcher = () =>
  fetch("http://localhost:5000/api/comments/admin", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const Comments = () => {
  const { data, isLoading, mutate } = useSWR("comments", fetcher);
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isOpenDetailDialog, setIsOpenDetailDialog] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [filterComment, setFilterComment] = useState([]);
  const [tabActive, setTabActive] = useState("all");

  useEffect(() => {
    if (data) {
      filterContent("all");
    }
  }, [data]);
  const filterContent = (filterType) => {
    if (!data) return;

    if (filterType === "all") {
      setFilterComment(data);
    } else {
      setFilterComment(data.filter((item) => item.status === filterType));
    }
  };
  const updateSelectedComment = (id, status) => {
    if (!selectedComment) return;
    const newSelected = { ...selectedComment };
    const newArr = newSelected;

    const findItem = newArr.replies?.find((item) => item.id === id);

    findItem.status = status;
    setSelectedComment(newArr);
  };

  const handleAddReply = (replyContent) => {
    if (!replyContent.trim()) {
      toast.error("متن کامنت خالی میباشد !", toastOption);
      return;
    }
    const newComment = {
      content: replyContent,
    };
    fetch(`http://localhost:5000/api/comments/${commentId}`, {
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
        setIsReply(false);
        setCommentId(null);
        mutate();
      })
      .catch((err) => {
        toast.error("ثبت پاسخ کامنت با مشکل مواجه شد", toastOption);
      });
  };

  const approveCommentHandler = (id) => {
    fetch(`http://localhost:5000/api/comments/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("کامنت با موفقیت تایید شد", toastOption);
        } else if (!res.ok) {
          toast.error("تایید کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        mutate();
        updateSelectedComment(id, "approved");
      })
      .catch((err) => {
        toast.error("تایید کامنت با مشکل مواجه شد", toastOption);
      });
  };
  const rejectCommentHandler = (id) => {
    fetch(`http://localhost:5000/api/comments/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("کامنت با موفقیت رد شد", toastOption);
        } else if (!res.ok) {
          toast.error("رد کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        mutate();
        updateSelectedComment(id, "rejected");
      })
      .catch((err) => {
        toast.error("رد کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };
  const handleDelete = (commentId) => {
    fetch(`http://localhost:5000/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success(" کامنت با موفقیت حذف شد", toastOption);
        } else if (!res.ok) {
          toast.error("حذف  کامنت با مشکل مواجه شد", toastOption);
        }
      })
      .then((data) => {
        mutate();
        setIsOpenDeleteModal(false);
        // updateSelectedComment(commentId);
      })
      .catch((err) => {
        toast.error("حذف کامنت با مشکل مواجه شد", toastOption);
        console.log(err);
      });
  };
  return (
    <DashboardLayout title="نظرات" role="admin">
      <TabPanel>
        <TabPanelItem
          title="همه نظرات"
          value="all"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="تایید شده"
          value="approved"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="در حال بررسی"
          value="pending"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="رد شده"
          value="rejected"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
      </TabPanel>
      <Content type="tbl">
        {filterComment.length ? (
          <PropertyTable
            showData={true}
            cols={[" نویسنده", "ملک", "وضعیت", "پاسخ ها", "عملیات"]}
            data={filterComment}
            setNewData={setNewComment}
          >
            <tbody className="tbody">
              {filterComment.length > 0
                ? newComment.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.name} {item.last_name}
                      </td>

                      <td className="tbl-txt">{item.property_title}</td>
                      <td className="tbl-txt">
                        <p className={`status status__${item.status}-2`}>
                          {getStatusText(item.status)}
                        </p>
                      </td>
                      <td className="tbl-txt">
                        {item.replies?.length > 0 ? (
                          <button
                            className={styles.replyCountButton}
                            onClick={() => {
                              setIsOpenDetailDialog(true);
                              setSelectedComment(item);
                            }}
                            type="button"
                          >
                            <div className={styles.replyCount}>
                              <span>{item.replies?.length}</span>
                              <MessageSquareMoreIcon size={16} />
                            </div>
                          </button>
                        ) : (
                          <span className={styles.noReplies}>—</span>
                        )}
                      </td>

                      <td style={{ position: "relative" }}>
                        <button
                          className="btn-outline-5"
                          style={{ marginLeft: "6px" }}
                          onClick={() => {
                            setIsOpenDetailDialog(true);
                            setSelectedComment(item);
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-outline-5"
                          onClick={() => {
                            setOpenDropdownId(item.id);
                            setShowDropdown((prev) => !prev);
                          }}
                        >
                          <EllipsisVertical size={14} />
                        </button>
                        <ul
                          className={`drop-down--tbl shadow-light
              ${openDropdownId === item.id && showDropdown ? "active" : ""}`}
                          onMouseLeave={() => setShowDropdown(false)}
                        >
                          {item.status !== "approved" && (
                            <li
                              className="drop-down__btn"
                              onClick={() => {
                                approveCommentHandler(item.id);
                                setShowDropdown(false);
                              }}
                            >
                              تایید کردن
                            </li>
                          )}
                          {item.status !== "rejected" && (
                            <li
                              className="drop-down__btn"
                              onClick={() => {
                                rejectCommentHandler(item.id);
                                setShowDropdown(false);
                              }}
                            >
                              رد کردن
                            </li>
                          )}
                          <li
                            className="drop-down__btn"
                            onClick={() => {
                              setIsReply(true);
                              setShowDropdown(false);
                              setCommentId(item.id);
                            }}
                          >
                            پاسخ دادن
                          </li>
                          <li
                            className="drop-down__btn"
                            onClick={() => {
                              setIsOpenDeleteModal(true);
                              setShowDropdown(false);
                              setCommentId(item.id);
                            }}
                          >
                            حذف
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </PropertyTable>
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title=" هنوز کامنتی ثبت نشده!"
            noBtn={true}
          />
        )}
        {isOpenDeleteModal && (
          <DeleteModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            title="حذف کامنت"
            question="آیا از حذف این کامنت اطمینان دارید؟ این عملیات قابل بازگشت نیست."
            onConfirm={() => handleDelete(commentId)}
          />
        )}
        {isOpenDetailDialog && (
          <CommentDetail
            isOpen={isOpenDetailDialog}
            onClose={() => setIsOpenDetailDialog(false)}
            comment={selectedComment}
            setIsReply={setIsReply}
            setCommentId={setCommentId}
            setIsOpenDeleteModal={setIsOpenDeleteModal}
            onApprove={approveCommentHandler}
            onReject={rejectCommentHandler}
            onUpdate={updateSelectedComment}
          />
        )}
        {isReply && (
          <CommentModal
            isOpen={isReply}
            onClose={() => setIsReply(false)}
            title="پاسخ"
            onSubmit={handleAddReply}
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Comments;
