import React from "react";
import styles from "./Title.module.css";
const Title = ({ title,isComment=false }) => {
  return <h4 className={`${styles.title} ${!isComment?styles.titleMb4:""}`}>{title}</h4>;
};

export default Title;
