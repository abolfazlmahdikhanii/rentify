import Image from "next/image";
import React, { useContext } from "react";
import styles from "./SideBar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";


const SideBar = () => {
  const routes = useRouter();


  const isActiveHandler = (route) => {
    const splidtedRoute = routes.pathname.split("/");
    if (splidtedRoute[splidtedRoute.length - 1] === route) return true;
    else false;
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <Image
            src="/images/profile.png"
            alt="امیرحسین صفری"
            width={64}
            height={64}
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>امیرحسین صفری</h3>
          <p className={styles.profilePhone}>۰۹۱۲۳۴۵۶۷۸۹</p>
        </div>
      </div>

      <nav className={styles.navigation}>
        <Link
          href="/user-panel"
          className={`${styles.navItem} ${
            isActiveHandler("user-panel") ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0M12 16.5a6 6 0 0 0-5.198 3l-1.731-1a8 8 0 0 1 6.929-4 8 8 0 0 1 6.93 4l-1.732 1a6 6 0 0 0-5.198-3"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>ویرایش اطلاعات</span>
        </Link>
        <Link
          href="/user-panel/favorites"
          className={`${styles.navItem} ${
            isActiveHandler("favorites") ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="20"
            fill="none"
            viewBox="0 0 22 20"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M18.532 3.437c-1.882-1.825-4.89-1.913-6.88-.257a1 1 0 0 1-.652.232 1 1 0 0 1-.652-.232c-1.99-1.656-4.998-1.568-6.88.257a4.74 4.74 0 0 0-.264 6.588q.037.042.07.087L11 17.607l7.727-7.495q.03-.045.069-.087a4.74 4.74 0 0 0-.264-6.588m1.891 7.763A6.74 6.74 0 0 0 19.924 2C17.493-.357 13.738-.629 11 1.177 8.262-.63 4.508-.357 2.076 2.001a6.74 6.74 0 0 0-.5 9.199 1 1 0 0 0 .17.218l8.558 8.3a1 1 0 0 0 1.392 0l8.557-8.3a1 1 0 0 0 .17-.218"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M17 7a2 2 0 0 0-2-2V3a4 4 0 0 1 4 4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>آگهی‌های ذخیره شده</span>
        </Link>
        <Link
          href="/user-panel/my-ad"
          className={`${styles.navItem} ${
            isActiveHandler("my-ad") ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M19.55 3.165A1 1 0 0 1 20 4v14a1 1 0 0 1-1.275.962l-14-4A1 1 0 0 1 4 14v-4a1 1 0 0 1 .606-.92l14-6a1 1 0 0 1 .944.085M6 10.66v2.587l12 3.428V5.517z"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M1 10.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0zm2.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-.5-.5M18 3.5a2.5 2.5 0 0 1 5 0v15a2.5 2.5 0 0 1-5 0zm2.5-.5a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 1 0v-15a.5.5 0 0 0-.5-.5M7.5 18v-3h2v3a1 1 0 0 0 1 1H12a1 1 0 0 0 1-1v-1.5h2V18a3 3 0 0 1-3 3h-1.5a3 3 0 0 1-3-3"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>آگهی‌های من</span>
        </Link>
        <Link
          href="/user-panel/compare"
   
          className={`${styles.navItem} ${
            isActiveHandler("compare") ? styles.active : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m8 14.61-6.717 6.718 1.414 1.414 6.717-6.717z"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M8.06 15.964v3.95h2v-4.95a1 1 0 0 0-1-1H4.112v2zM16.025 9.414l6.718-6.718-1.415-1.414L14.611 8z"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M15.964 8.06V4.11h-2v4.95a1 1 0 0 0 1 1h4.95v-2z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>مقایسه املاک</span>
        </Link>
        <a href="#" className={`${styles.navItem} ${styles.logout}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#ED2E2E"
              fillRule="evenodd"
              d="M5 19V5h2v14zM18 13H8.5v-2H18z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#ED2E2E"
              fillRule="evenodd"
              d="m17.086 12-2.793-2.793 1.414-1.414 3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5-1.414-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>خروج از حساب کاربری</span>
        </a>
      </nav>
    </div>
  );
};

export default SideBar;
