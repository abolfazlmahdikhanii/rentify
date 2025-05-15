import React from "react";
import Image from "next/image";
import styles from "../../../styles/RegisterStep.module.css";
const Layout = ({ children, active }) => {
  return (
    <div className={`${styles.containerStep} container`}>
      {children}

      <div className={styles.progressSection}>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 1 ? styles.active : ""
              }`}
            >
              ۱
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 1 ? styles.stepTextActive : ""
              }`}
            >
              نوع معامله و نوع ملک
            </div>
          </div>

          <div
            className={`${styles.stepConnector} ${
              active >= 1 ? styles.stepConnectorActive : ""
            }`}
          ></div>

          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 2 ? styles.active : ""
              }`}
            >
              ۲
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 2 ? styles.stepTextActive : ""
              }`}
            >
              موقعیت ملک
            </div>
          </div>

          <div
            className={`${styles.stepConnector} ${
              active >= 2 ? styles.stepConnectorActive : ""
            }`}
          ></div>

          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 3 ? styles.active : ""
              }`}
            >
              ۳
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 3 ? styles.stepTextActive : ""
              }`}
            >
              مشخصات ملک
            </div>
          </div>

          <div
            className={`${styles.stepConnector} ${
              active >= 3 ? styles.stepConnectorActive : ""
            }`}
          ></div>

          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 4 ? styles.active : ""
              }`}
            >
              ۴
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 4 ? styles.stepTextActive : ""
              }`}
            >
              تجهیزات و امکانات
            </div>
          </div>

          <div
            className={`${styles.stepConnector} ${
              active >= 4 ? styles.stepConnectorActive : ""
            }`}
          ></div>

          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 5 ? styles.active : ""
              }`}
            >
              ۵
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 5 ? styles.stepTextActive : ""
              }`}
            >
              توضیحات تکمیلی
            </div>
          </div>

          <div
            className={`${styles.stepConnector} ${
              active >= 5 ? styles.stepConnectorActive : ""
            }`}
          ></div>

          <div className={styles.step}>
            <div
              className={`${styles.stepNumber} ${
                active >= 6 ? styles.active : ""
              }`}
            >
              ۶
            </div>
            <div
              className={`${styles.stepText} ${
                active >= 6 ? styles.stepTextActive : ""
              }`}
            >
              عکس‌ها و ویدیوها
            </div>
          </div>
        </div>
      </div>

      <div className={styles.headerSection}>
        <div>
          <h1 className={styles.mainTitle}>ثبت آگهی</h1>
          <p className={styles.subtitle}>
            آگهی ملکت رو اینجا ثبت کن و با راحتی مستاجر پیدا کن!
          </p>
        </div>
        <div className={styles.illustration}>
          <Image
            src="/images/register-ill.png"
            alt="Property illustration"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
