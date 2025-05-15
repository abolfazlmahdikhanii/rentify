import React from "react";
import styles from "./ModalMap.module.css";
const ModalMap = ({ children, onClose, onConfirm }) => {
  return (
    <>
      <div className={styles.backDrop}></div>

      <div className={`${styles.container}`} dir="rtl">
        {/* Header with close button */}
        <div className={styles.header}>
          <h2 className={styles.title}>ثبت موقعیت</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
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
        <div className={styles.actionButtons}>
          <button className={`btn ${styles.secondaryButton}`} onClick={onClose} type="button">
            لغو
          </button>
          <button
            className={`btn btn-primary ${styles.btnPrimary}`}
            onClick={onConfirm} type="button"
          >
            ثبت
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalMap;
