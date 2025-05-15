import styles from "./CardSection.module.css";
import Image from "next/image";

const CardSection = () => {
  return (
    <div className={styles.cardSection}>
      <h1 className={styles.heading}>با خدمات <span className="titlePrimary">رنتی‌فای</span> آشنا شوید</h1>

      <div className={styles.cardsContainer}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.cardInfoBox}>
            <img
              src="/images/sr-1.png"
              alt="Tenant with moving boxes"
              className={styles.cardImage}
            />
            <h2 className={styles.cardTitle}>
              خانه مورد علاقه تان را اجاره کنید!
            </h2>
            <p className={styles.cardText}>
              با چند کلیک ساده، ملک تان را به صورت رایگان در رنتی‌فای آگهی و در
              سریع ترین زمان ممکن در یک فضای امن معامله کنید.
            </p>
          </div>
          <button className={styles.blueButton}>اجاره خانه</button>
        </div>

        {/* Card 2 */}
        <div className={styles.card}>
        <div className={styles.cardInfoBox}>
          <img
              src="/images/sr-2.png"
              alt="Property owner in front of house"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>مالک هستید؟</h2>
          <p className={styles.cardText}>
            با چند کلیک ساده، ملک تان را به صورت رایگان در رنتی‌فای آگهی و در
            سریع ترین زمان ممکن در یک فضای امن معامله کنید.
          </p>
          </div>
          <button className={styles.blueButton}>ثبت رایگان آگهی</button>
        </div>

        {/* Card 3 */}
        <div className={styles.card}>
        <div className={styles.cardInfoBox}>
          <img
              src="/images/sr-3.png"
              alt="Real estate agent with clients"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>مشاور املاک هستید؟</h2>
          <p className={styles.cardText}>
            رنتی‌فای باعث توسعه کسب و کار و رشد درآمد مشاور املاک متخصص شده
            اشتمل نوین را در دسترس شما این مجموعه از توسعه کسب و کار تان فعالیت
            کنید.
          </p>
          </div>
          <button className={styles.blueButton}>مشاهده خدمات</button>
        </div>
      </div>
    </div>
  );
};

export default CardSection;
