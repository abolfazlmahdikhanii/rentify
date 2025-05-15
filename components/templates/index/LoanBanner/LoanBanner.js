import styles from "./LoanBanner.module.css";

const LoanBanner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.textSection}>
          <div className={styles.info}>
            <div>
              <h2 className={styles.mainHeading}>
                برای دریافت وام رهن خانه کلیک کنید{" "}
              </h2>
              <p className={styles.subHeading}>
                دریافت وام با کم‌ترین بهره و سریع ترین زمان ممکن{" "}
              </p>
            </div>
            <button className={styles.ctaButton}>اطلاعات بیشتر...</button>
          </div>
        </div>
        <div className={styles.imageSection}>
          <img
            src="/images/ad.png"
            alt="Person stacking coins with house models"
            className={styles.bannerImage}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanBanner;
