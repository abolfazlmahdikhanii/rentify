import Link from "next/link";
import React from "react";
import styles from "./LastVisited.module.css";
import Home from "@/components/module/Home/Home";

const LastVisted = ({ houses }) => {
  return (
    <div className="container">
      <div className={styles.headerTitle}>
        <h5 className={styles.headerTitle__title}>
          پر بازدید ترین‌های هفته‌ی گذشته
        </h5>
        <Link href="/homes?page=1" className={styles.headerTitle__allBtn}>
          مشاهده همه
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="12"
            fill="none"
            viewBox="0 0 11 9"
          >
            <path
              fill="#0D6EFD"
              fillRule="evenodd"
              d="M1.5 5.5H11v-2H1.5z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#0D6EFD"
              fillRule="evenodd"
              d="m2.414 4.5 2.793-2.793L3.793.293l-3.5 3.5a1 1 0 0 0 0 1.414l3.5 3.5 1.414-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="homes-grid">
        {houses?.slice(0, 8).map((home, i) => (
          <Home key={home.id} {...home} />
        ))}
      </div>
    </div>
  );
};

export default LastVisted;
