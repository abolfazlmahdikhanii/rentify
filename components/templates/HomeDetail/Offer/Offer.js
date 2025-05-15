import React from "react";
import styles from "./Offer.module.css";
const Offer = () => {
  return (
    <div className={styles.offer}>
      <div className={styles.offerTitle}>
        <p>کد تخفیف ۲۰۰‌هزار تومانی در اولین خرید</p>
      </div>
      <div className={styles.offerCopy}>
        rentify
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="#0A58CA"
            fillRule="evenodd"
            d="M21 8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zm-2 1v12H9V9z"
            clipRule="evenodd"
          ></path>
          <path
            fill="#0A58CA"
            fillRule="evenodd"
            d="M17 2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4v-2H5V3h10v5h2z"
            clipRule="evenodd"
          ></path>
        </svg>{" "}
      </div>
    </div>
  );
};

export default Offer;
