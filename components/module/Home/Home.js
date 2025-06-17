import React, { use, useEffect, useState } from "react";
import styles from "./HomeCard.module.css";
import Link from "next/link";
import Image from "next/image";
import { getCookie } from "cookies-next";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";

const Home = ({
  type,
  image,
  title,
  location,
  price,
  ejare_price,
  id,
  isBorder,
  isMyAd,
  isCompare,
  onChecked,
  checked = false,
  isMyCompare,
  main_image,
  remove,
  is_favorite,
  getFav,
  status,
}) => {
  const [isFav, setIsFav] = useState(is_favorite);

  let typeColor = null;
  let typeName = null;

  if (type === "Apartment") {
    typeColor = styles.statusSuccess;
    typeName = "آپارتمان";
  } else if (type === "House") {
    typeColor = styles.statusWarning;
    typeName = "خانه ویلایی";
  } else {
    typeColor = styles.statusPrimary;
    typeName = "ویلا";
  }

  const likeHomeHandler = (id) => {
    fetch(`http://localhost:5000/api/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({ propertyId: id }),
    }).then((res) => {
      if (res.ok) {
        setIsFav(true);
        toast.success("با موفقیت به عللاقه مندی ها اضافه شد", toastOption);
      } else if (res.status == 401) {
        toast.error(
          "برای افزودن به موردعلاقه ها  ثبت نام کنید",
          toastOption
        );
      }
    });
  };
  const removeLikeHomeHandler = (id) => {
    fetch(`http://localhost:5000/api/favorites/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      if (!res.ok) {
        toast.error("خطا در حدف ملک از مورد علاقه ها", toastOption);
      }
      setIsFav(false);
      if (getFav) getFav();
    });
  };

  return (
    <div
      className={`${styles.cardParents} ${
        isBorder ? `${styles.cardBorder}` : ""
      }`}
    >
      <div className={styles.cardImg}>
        <Image
          src={main_image || "/images/empty-image.jpg"}
          alt={title || "img"}
          width="200"
          height="200"
          unoptimized
          className={styles.cardImg__img}
          onError={(e) => {
            e.target.src = "/images/empty-image.jpg";
          }}
        />
        {!isMyAd ? (
          <>
            {!isCompare ? (
              <button
                className={styles.likeBtn}
                onClick={() =>
                  !isFav ? likeHomeHandler(id) : removeLikeHomeHandler(id)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    fill={!isFav ? "#C4C4C4" : "#f65"}
                    d="m7.001 12.454-.846-.77C3.151 8.96 1.168 7.158 1.168 4.958A3.174 3.174 0 0 1 4.376 1.75c1.015 0 1.99.473 2.625 1.213A3.5 3.5 0 0 1 9.626 1.75a3.174 3.174 0 0 1 3.209 3.208c0 2.2-1.984 4.002-4.988 6.726z"
                  ></path>
                </svg>
              </button>
            ) : (
              <label className={styles.compareBtn}>
                <input type="checkbox" onChange={onChecked} checked={checked} />
              </label>
            )}
          </>
        ) : (
          <>
            {status === "pending" && <StatusBadge status="pending" />}
            {status === "rejected" && <StatusBadge status="rejected" />}
            {status === "approved" && <StatusBadge status="approved" />}
          </>
        )}
      </div>
      <Link href={`homes/${id}`} className={`${styles.card} `}>
        <div className={styles.cardInfo}>
          <div className={styles.cardInfo__row}>
            <div className={`${styles.cardInfo__type} ${typeColor}`}>
              {typeName}
            </div>
            <div className={styles.cardInfo__location}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  fill="#595C61"
                  fillRule="evenodd"
                  d="M6 1.5a2.75 2.75 0 0 0-2.75 2.75c0 1.374.745 2.96 1.55 4.253A19 19 0 0 0 6 10.212a20 20 0 0 0 1.2-1.71C8.005 7.21 8.75 5.625 8.75 4.25A2.75 2.75 0 0 0 6 1.5M6 11l-.376.33-.001-.002-.002-.002-.008-.01-.138-.162A20.186 20.186 0 0 1 3.95 9.03c-.82-1.32-1.7-3.11-1.7-4.781a3.75 3.75 0 1 1 7.5 0c0 1.671-.88 3.46-1.7 4.78a20 20 0 0 1-1.633 2.252l-.03.034-.008.01-.002.002v.001zm0 0 .376.33a.5.5 0 0 1-.752 0z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#595C61"
                  fillRule="evenodd"
                  d="M6 3.25a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
                  clipRule="evenodd"
                ></path>
              </svg>
              {location}
            </div>
          </div>
          <div>
            <p className={styles.cardInfo__title}>{title}</p>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.cardFooter__info}>
              رهن
              <div className={styles.cardFooter__infoPrice}>
                {price.toLocaleString()}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="9"
                  fill="none"
                  viewBox="0 0 13 7"
                >
                  <path
                    fill="#73767C"
                    d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className={styles.cardFooter__info}>
              اجاره
              <div className={styles.cardFooter__infoPrice}>
                {ejare_price.toLocaleString()}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="9"
                  fill="none"
                  viewBox="0 0 13 7"
                >
                  <path
                    fill="#73767C"
                    d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                  ></path>
                  <path
                    fill="#73767C"
                    d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {(isMyAd || isMyCompare) && (
        <button className={styles.removeBtn} onClick={remove}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <g clipPath="url(#clip0_3930_15314)">
              <path
                fill="#ED2E2E"
                fillRule="evenodd"
                stroke="#fff"
                d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm-1.414 11L7.05 8.464 8.464 7.05 12 10.586l3.536-3.536 1.414 1.414L13.414 12l3.536 3.536-1.414 1.414L12 13.414 8.464 16.95 7.05 15.536z"
                clipRule="evenodd"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_3930_15314">
                <path fill="#fff" d="M0 0h24v24H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </button>
      )}
    </div>
  );
};
const StatusBadge = ({ status }) => {
  // Define status configurations
  const statusConfig = {
    pending: {
      text: "در انتظار تأیید",
      iconColor: "#F4B740",
      bgClass: "status__pending",
    },
    approved: {
      text: "تأیید شده",
      iconColor: "#4CAF50",
      bgClass: "status__approved",
    },
    rejected: {
      text: "رد شده",
      iconColor: "#F44336",
      bgClass: "status__rejected",
    },
  };

  // Get current status config or default to pending
  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`status-home ${currentStatus.bgClass}`}>
      {currentStatus.text}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
      >
        {status === "pending" ? (
          <>
            <path
              fill={currentStatus.iconColor}
              fillRule="evenodd"
              d="M8.575 3.625a.667.667 0 0 0-1.15 0l-4.335 7.37A.667.667 0 0 0 3.665 12h8.67c.516 0 .837-.56.575-1.005zm-2.299-.676c.774-1.315 2.675-1.315 3.448 0l4.335 7.37c.785 1.333-.177 3.014-1.723 3.014H3.665c-1.547 0-2.508-1.68-1.724-3.014z"
              clipRule="evenodd"
            />
            <path
              fill={currentStatus.iconColor}
              fillRule="evenodd"
              d="M7.334 8.666v-4h1.333v4zM7.334 11v-1h1.333v1z"
              clipRule="evenodd"
            />
          </>
        ) : status === "approved" ? (
          <path
            fill="#00BA88"
            fillRule="evenodd"
            d="M14.471 4.471 6.04 12.903 1.51 8.02l.978-.907 3.587 3.868 7.453-7.453z"
            clipRule="evenodd"
          ></path>
        ) : (
          <path
            fill={currentStatus.iconColor}
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
          />
        )}
      </svg>
    </div>
  );
};
export default Home;
