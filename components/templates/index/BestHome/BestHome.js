import React from "react";
import styles from "./BestHome.module.css";
import { useRouter } from "next/router";
const BestHome = ({ src, title, count, type }) => {
  const router = useRouter();
  const goTo = () => {
    router.push({
      pathname: "/homes",
      query: {
        type,
      },
    });
  };
  return (
    <div className={styles.bestHouse}>
      <div className={styles.bestHouseImg}>
        <img
          src={src}
          alt="best house image"
          className={styles.bestHouseImg__img}
        />
      </div>
      <div className={styles.bestHouseBox}>
        <div className={styles.bestHouseBoxInfo}>
          <p className={styles.bestHouseBoxInfo__title}>{title}</p>
          <p className={styles.bestHouseBoxInfo__subtitle}>+{count}ملک</p>
        </div>
        <div>
          <button className="btn btn-primary btn-circle" onClick={goTo}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="10"
              fill="none"
              viewBox="0 0 11 10"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M1.5 6H11V4H1.5z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#fff"
                fillRule="evenodd"
                d="m2.414 5 2.793-2.793L3.793.793l-3.5 3.5a1 1 0 0 0 0 1.414l3.5 3.5 1.414-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestHome;
