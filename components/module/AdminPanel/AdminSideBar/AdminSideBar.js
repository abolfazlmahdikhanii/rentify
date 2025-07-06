import React, { useContext } from "react";
import styles from "../../SideBar/SideBar.module.css"
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
const AdminSideBar = ({isActiveHandler}) => {
  const {logoutHandler}=useContext(AuthContext)
  return (
    <nav className={styles.navigation}>
      <Link
        href="/admin-panel"
        className={`${styles.navItem} ${
          isActiveHandler("admin-panel") ? styles.active : ""
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
      d="M1 2.5a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2 1v6h6.5v-6zM1 13.5a1 1 0 0 1 1-1h8.5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm2 1v6h6.5v-6zM12.5 2.5a1 1 0 0 1 1-1H22a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1zm2 1v6H21v-6zM12.5 13.5a1 1 0 0 1 1-1H22a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8.5a1 1 0 0 1-1-1zm2 1v6H21v-6z"
      clipRule="evenodd"
    ></path>
  </svg>
        <span>پیشخوان</span>
      </Link>
      <Link
        href="/admin-panel/user-ad"
        className={`${styles.navItem} ${
          isActiveHandler("user-ad") ? styles.active : ""
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
        <span>آگهی ها</span>
      </Link>
      <Link
        href="/admin-panel/users"
        className={`${styles.navItem} ${
          isActiveHandler("users") ? styles.active : ""
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
      d="M15.161 5.563a2.706 2.706 0 0 1 0 5.411v2a4.706 4.706 0 0 0 0-9.411z"
      clipRule="evenodd"
    ></path>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.162 12.974a5.59 5.59 0 0 1 5.588 5.589h2a7.59 7.59 0 0 0-7.588-7.589zM9.25 5.563a2.938 2.938 0 1 1 0 5.875 2.938 2.938 0 0 1 0-5.876M14.188 8.5a4.938 4.938 0 1 0-9.876 0 4.938 4.938 0 0 0 9.875 0"
      clipRule="evenodd"
    ></path>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M9.25 13.438a6 6 0 0 1 6 6h2a8 8 0 1 0-16 0h2a6 6 0 0 1 6-6"
      clipRule="evenodd"
    ></path>
  </svg>
        <span>کاربران</span>
      </Link>
        <Link
        href="/admin-panel/comments"
        className={`${styles.navItem} ${
          isActiveHandler("comments") ? styles.active : ""
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
      d="M22 3.75a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h5.086l3.207 3.207a1 1 0 0 0 1.414 0l3.207-3.207H21a1 1 0 0 0 1-1zm-2 1v11h-4.5a1 1 0 0 0-.707.293L12 18.836l-2.793-2.793a1 1 0 0 0-.707-.293H4v-11z"
      clipRule="evenodd"
    ></path>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15.5 8.75h-7v-2h7zM15.5 13.25h-7v-2h7z"
      clipRule="evenodd"
    ></path>
  </svg>
        <span>نظرات</span>
      </Link>
      <Link
        href="/admin-panel/visits"
        className={`${styles.navItem} ${
          isActiveHandler("visits") ? styles.active : ""
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
      d="M1 7a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v8a1 1 0 0 1-.293.707l-6 6A1 1 0 0 1 16 22H4a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h11.586L21 14.586V7a1 1 0 0 0-1-1z"
      clipRule="evenodd"
    ></path>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M15 17a3 3 0 0 1 3-3h4a1 1 0 0 1 .707 1.707l-6 6A1 1 0 0 1 15 21zm3-1a1 1 0 0 0-1 1v1.586L19.586 16zM6 3v3.5H4V3zM5.25 9.75h2.5v2h-2.5zM5.25 13.75h2.5v2h-2.5zM11.75 9.75h2.5v2h-2.5zM13 3v3.5h-2V3zM20 3v3.5h-2V3z"
      clipRule="evenodd"
    ></path>
  </svg>
        <span>بازدید ها</span>
      </Link>
    
      <p className={`${styles.navItem} ${styles.logout}`} onClick={logoutHandler}>
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
      </p>
    </nav>
  );
};

export default AdminSideBar;
