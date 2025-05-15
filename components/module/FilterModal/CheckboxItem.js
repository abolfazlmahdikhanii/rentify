import React, { useState } from "react";
import styles from "./FilerModal.module.css";
const CheckboxItem = ({ label, onCheck, remove, check }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.checkboxItem}>
      {/* <div
        className={`${styles.checkbox} ${
          checked ? styles.checkboxChecked : ""
        }`}
        onClick={() => {
            setChecked(!checked)
            
        }}
      >
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.checkmark}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div> */}
      <input
        className={`${styles.checkbox}`}
        type="checkbox"
        onChange={(e) => (e.target.checked ? onCheck() : remove())}
        checked={check}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </div>
  );
};

export default CheckboxItem;
