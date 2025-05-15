import React from "react";
import styles from "./Title.module.css";
const Title = ({ title }) => {
  return <h4 className={styles.title}>{title}</h4>;
};

export default Title;
