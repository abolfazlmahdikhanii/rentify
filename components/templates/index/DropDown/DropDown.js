import React, { useState } from "react";
import styles from "./dropdown.module.css";
const DropDown = ({ datas, title, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectHandler = (data) => {
    setSelected(data);
    setIsOpen(false);
  };
  const englishTypeToPersian = (data) => {
    if (data === "Apartment") return "آپارتمان";
    else if (data === "Villa") return "ویلا";
    else if (data === "House") return "خانه ویلایی";
    else return data;
  };
  return (
    <div className={styles.locationContainer}>
      <div className={styles.locationDropdown} onClick={toggleDropdown}>
        <div className={styles.locationHeader}>
          <span className={styles.locationLabel}>{title}</span>
          <div className={styles.chevronIcon}>
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={16}
                height={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={16}
                height={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </div>
        </div>
        <div className={styles.selectedLocation}>{englishTypeToPersian(selected)}</div>
      </div>

      {isOpen && (
        <div className={styles.locationOptions}>
          {datas && datas.length
            ? datas.map((data) => (
                <div
                  key={data}
                  className={styles.locationOption}
                  onClick={() => selectHandler(data)}
                >
                  {englishTypeToPersian(data)}
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default DropDown;
