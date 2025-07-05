import React from "react";
import styles from "./TabPanel.module.css";
const TabPanelItem = ({
  title,
  value,
  action,
  href,
  tabActive,
  setTabActive,
}) => {
  return (
    <button
      className={`${styles.panelTab__item} ${
        tabActive === value ? styles.panelTab__itemActive : ""
      }`}
      onClick={() => {
        setTabActive(value);
        action(value)
      }}
    >
      {title}
    </button>
  );
};

export default TabPanelItem;
