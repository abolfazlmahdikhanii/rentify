import React from "react";
import styles from "./ConfirmationModal.module.css";
const ConfirmationModal = ({ date, time, onClose }) => {
  return (
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="#0C0C0C"
            fillRule="evenodd"
            d="m3.293 19.293 16-16 1.414 1.414-16 16z"
            clipRule="evenodd"
          ></path>
          <path
            fill="#0C0C0C"
            fillRule="evenodd"
            d="m20.707 19.293-16-16-1.414 1.414 16 16z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <div className={styles.checkIcon}>
            <svg
              width="55"
              height="55"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        <h2 className={styles.title}>درخواست بازدید شما با موفقیت ثبت شد</h2>

        <div className={styles.infoContainer}>
          <div className={styles.infoRow}>
            <div className={styles.infoWithIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                fill="none"
                viewBox="0 0 25 24"
              >
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M1.5 6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-16a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M1.5 6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1h-20a1 1 0 0 1-1-1zm3-1a1 1 0 0 0-1 1v2h18V6a1 1 0 0 0-1-1z"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M6.5 2v3.5h-2V2zM13.5 2v3.5h-2V2zM20.5 2v3.5h-2V2zM8 14H6v-2h2zM8 18H6v-2h2zM13.5 14h-2v-2h2zM13.5 18h-2v-2h2zM19 14h-2v-2h2zM19 18h-2v-2h2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className={styles.infoCol}>
              <p className={styles.label}>تاریخ</p>
              <p className={styles.value}>{date}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoWithIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                fill="none"
                viewBox="0 0 25 24"
              >
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="M12.5 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11"
                  clipRule="evenodd"
                ></path>
                <path
                  fill="#7E8288"
                  fillRule="evenodd"
                  d="m11.5 12.65-3.906-1.736.812-1.828 4.5 2A1 1 0 0 1 13.5 12v6.5h-2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className={styles.infoCol}>
              <p className={styles.label}>ساعت</p>
              <p className={styles.value}>{time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
