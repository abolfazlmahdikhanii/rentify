import React from "react";
import styles from "./FilterHome.module.css";
const FilterHome = ({ onSearch, searchVal, setFilter, count }) => {
  return (
    <div className={styles.filterContainer}>
      <div className="container row">
        
        <div className={`${styles.filterBtnContainer} `}>
          <p
            className={`${styles.filterBtn__btn} ${
              count > 0 ? styles.activeBtn : ""
            }`}
            onClick={() => setFilter((prev) => !prev)}
          >
            {count > 0 && <span className={styles.badge}>{count}</span>}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M2 2.5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v3a1 1 0 0 1-.35.76L15 11.96v7.54a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 9 21.516l-.15-9.557-6.51-5.707A1 1 0 0 1 2 5.5zm2 1v1.547l6.503 5.701a1 1 0 0 1 .34.736l.132 8.41L13 18.882V11.5a1 1 0 0 1 .35-.76L20 5.04V3.5z"
                clipRule="evenodd"
              ></path>
            </svg>
            فیلترها
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterHome;
