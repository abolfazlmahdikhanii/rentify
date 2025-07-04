import React, { Children } from "react";
import styles from "./TabPanel.module.css"
const TabPanel = ({children}) => {
  return (
    <div className={styles.panelTab}>
      {children}
      
    </div>
  );
};

export default TabPanel;
