import React from "react";
import styles from "./VisitBox.module.css"
const VisitBox = ({authorName,onVisitReq}) => {
  return (
    <div className={styles.userProfile}>
      <div className={styles.profileHeader}>
        <img
          src="/images/profile.png"
          alt="Profile Image"
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h6>{authorName}</h6>
          <p>املاک مبین</p>
        </div>
      </div>
      <div className={styles.profileButtons}>
        <button className={`btn ${styles.callBtn}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            fill="none"
            viewBox="0 0 25 24"
          >
            <path
              fill="#0D6EFD"
              fillRule="evenodd"
              d="M7.958 5.047a.16.16 0 0 0-.228 0L6.339 6.438a2.86 2.86 0 0 0-.582 3.21 18.32 18.32 0 0 0 9.095 9.095 2.86 2.86 0 0 0 3.21-.582l1.39-1.39a.16.16 0 0 0 0-.229l-1.87-1.871a.16.16 0 0 0-.187-.03l-1.038.519a3.32 3.32 0 0 1-3.835-.623l-2.56-2.559a3.32 3.32 0 0 1-.622-3.835l.52-1.038a.16.16 0 0 0-.03-.186zM6.316 3.633a2.16 2.16 0 0 1 3.056 0l1.871 1.871c.658.658.821 1.663.405 2.495l-.519 1.039a1.32 1.32 0 0 0 .248 1.526l2.559 2.56a1.32 1.32 0 0 0 1.526.247l1.039-.52a2.16 2.16 0 0 1 2.495.406l1.871 1.871a2.16 2.16 0 0 1 0 3.056l-1.391 1.392a4.86 4.86 0 0 1-5.451.988A20.32 20.32 0 0 1 3.935 10.476a4.86 4.86 0 0 1 .989-5.452z"
              clipRule="evenodd"
            ></path>
          </svg>
          تماس{" "}
        </button>
        <button className={`btn ${styles.messageBtn}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            fill="none"
            viewBox="0 0 25 24"
          >
            <path
              fill="#0D6EFD"
              fillRule="evenodd"
              d="M7.25 10.917h.5v-2h-.5a5 5 0 0 0-5 5v7.167a1 1 0 0 0 1.64.768l2.722-2.268h4.638a5 5 0 0 0 5-5v-.334h-2v.334a3 3 0 0 1-3 3h-5a1 1 0 0 0-.64.231L4.25 18.95v-5.032a3 3 0 0 1 3-3"
              clipRule="evenodd"
            ></path>
            <path
              fill="#0D6EFD"
              fillRule="evenodd"
              d="M8.75 6.917a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v7.167a1 1 0 0 1-1.64.768l-2.722-2.268H13.75a5 5 0 0 1-5-5zm5-3a3 3 0 0 0-3 3v.667a3 3 0 0 0 3 3h5a1 1 0 0 1 .64.231l1.36 1.134V6.917a3 3 0 0 0-3-3z"
              clipRule="evenodd"
            ></path>
          </svg>
          پیام
        </button>
      </div>
      <div className={styles.requestContainer}>
        <button className={`btn ${styles.requestBtn}`} onClick={onVisitReq}>درخواست بازدید</button>
      </div>
    </div>
  );
};

export default VisitBox;
