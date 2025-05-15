import React from "react";
import styles from "./ModalProperty.module.css";
import { useRouter } from "next/router";
const ModalProperty = ({ children, onClose, onConfirm }) => {
  const router=useRouter()
  return (
    <>
      <div className={styles.backDrop}></div>

      <div className={`${styles.container}`} dir="rtl">
        {/* Header with close button */}
        <div className={styles.modalHeader}>
          <p className={styles.modalHeader__Title}>آگهی‌های ‌ذخیره شده</p>
          <button className={styles.modalHeader__btn} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 25"
            >
              <path
                fill="#0C0C0C"
                fillRule="evenodd"
                d="m3.293 19.793 16-16 1.414 1.414-16 16z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#0C0C0C"
                fillRule="evenodd"
                d="m20.707 19.793-16-16-1.414 1.414 16 16z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className={styles.content}>{children}</div>

        {/* Action buttons */}
        <div className={styles.footerModal}>
          <button className={`btn ${styles.secondaryButton}`} type="button" onClick={()=>router.push("/homes")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="#0D6EFD"
                fillRule="evenodd"
                d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"
                clipRule="evenodd"
              ></path>
              <path
                fill="#0D6EFD"
                fillRule="evenodd"
                d="M11.5 8A3.5 3.5 0 0 0 8 4.5v-2A5.5 5.5 0 0 1 13.5 8zM13.707 12.293l6 6-1.414 1.414-6-6z"
                clipRule="evenodd"
              ></path>
            </svg>
            جستجو
          </button>
          <button
            className={`btn btn-primary ${styles.btnPrimary}`}
            type="button"
            onClick={onConfirm}
          >
            ثبت
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalProperty;
