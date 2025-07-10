import Image from "next/image";
import React from "react";
import styles from "./emptyList.module.css";
import { useRouter } from "next/router";

const EmptyList = ({ title, subtitle, src, type, btnText, href, noBtn=false,isAction=false,action }) => {
  const router = useRouter();
  let icon = null;
  if (type === "add") {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="none"
        viewBox="0 0 25 25"
      >
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M11.5 22.5v-20h2v20z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M22.5 13.5h-20v-2h20z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  } else {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="24"
        fill="none"
        viewBox="0 0 25 24"
      >
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M10.5 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-8 6a8 8 0 1 1 16 0 8 8 0 0 1-16 0"
          clipRule="evenodd"
        ></path>
        <path
          fill="#fff"
          fillRule="evenodd"
          d="M14 10a3.5 3.5 0 0 0-3.5-3.5v-2A5.5 5.5 0 0 1 16 10zM16.207 14.293l6 6-1.414 1.414-6-6z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  }
  return (
    <div className={styles.emptyContent}>
      <Image
        src={src}
        width={type !== "add" ? 200 : 226}
        height={type !== "add" ? 200 : 180}
        alt="icon "
      />
      <div className={styles.emptyInfo}>
        <h5 className={styles.emptyTitle}>{title}</h5>
        <p className={styles.emptyDesc}>{subtitle}</p>
        {!noBtn && (
          <button
            className={`submit-btn ${styles.emptyBtn}`}
            onClick={() => {
              if (!isAction&&type === "add") {
                router.push("/register-step");
              } else if (!isAction&&type === "search") {
                router.push("/homes");
              }
              else if(isAction){
                action()
                router.push("/homes?from=compare");
              }
            }}
          >
            {icon}
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyList;
