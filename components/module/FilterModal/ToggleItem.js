import React from "react";
import styles from "./FilerModal.module.css";
const ToggleItem = ({ label, checked, onChange }) => {
  return (
    <div className={styles.toggleItem}>
      <span className={styles.toggleLabel}>{label}</span>
      <button
        className={`${styles.toggleSwitch} ${
          checked ? styles.toggleSwitchActive : ""
        }`}
        onClick={onChange}
      >
        <span
          className={`${styles.toggleKnob} ${
            checked ? styles.toggleKnobActive : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleItem;
