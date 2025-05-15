import React from "react";
import styles from "./Tab.module.css";
const Tab = ({ children, size }) => {
  return (
    <div className={`${styles.tab} ${size === "sm" ? styles.tabSm : ""}`}>
      {children}
    </div>
  );
};

export default Tab;
