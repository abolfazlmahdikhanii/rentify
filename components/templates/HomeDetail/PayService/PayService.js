import React from "react";
import styles from "./PayService.module.css";
const PayService = () => {
  return (
    <div>
      <div className={styles.payRow}>
        <div className={styles.payInfo}>
          <div className={styles.payInfo__Img}>
            <img src="/images/toman.png" alt="" />
          </div>
          <div className={styles.payInfo__text}>
            <p className={styles.payInfo__title}>پرداخت امن با تومن</p>
            <p className={styles.payInfo__subtitle}>ضامن امنیت معامله‌ی شما</p>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="41"
            height="41"
            fill="none"
            viewBox="0 0 41 41"
          >
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="m15.773 20.5 4.655 4.655-2.357 2.357-5.833-5.834a1.667 1.667 0 0 1 0-2.357l5.833-5.833 2.357 2.357z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#989BA0"
              fillRule="evenodd"
              d="m24.107 20.5 4.655 4.655-2.357 2.357-5.834-5.834a1.667 1.667 0 0 1 0-2.357l5.834-5.833 2.357 2.357z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div>
            <button className="btn btn-outline">پرداخت ودیعه</button>
        </div>
      </div>
      <p className={styles.payNotice}>مبلغ پرداختی نزد تومن به امانت باقی می‌ماند و پس از ارسال کالا و تایید کالا، مبلغ به حساب فروشنده واریز می‌شود.</p>
    </div>
  );
};

export default PayService;
