import React from "react";
import styles from "./Tab.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
const TabItem = ({ title, value, action, href, tabActive, setTabActive }) => {
  const router = useRouter();

  return (
    <>
      {/* <button
        className={`${styles.tabItem} ${
          tabActive === value ? styles.tabItem__active : ""
        }`}
        onClick={() => {
          setTabActive(value);
          href ? router.replace(href) : null;
        }}
      >
        {title}
      </button> */}
      <Link
        className={`${styles.tabItem} ${
          tabActive === value ? styles.tabItem__active : ""
        }`}
        href={`${href}`}
      >
        {title}
      </Link>
    </>
  );
};

export default TabItem;
