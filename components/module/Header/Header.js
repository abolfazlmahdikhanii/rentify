import React, { useContext } from "react";
import styles from "./header.module.css";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
const Header = () => {
  const { pathname } = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <div
        className={`${styles.header} ${
          pathname === "/" ? styles.header__index : styles.header__bg
        }`}
      >
        <Link href="/" className="header__right">
          <img
            src={pathname === "/" ? "/images/logo.svg" : "/images/logo.png"}
            alt="logo"
            className={styles.header__logo}
          />
        </Link>
        <nav className={styles.header__menu}>
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <a href="#" className={styles.menuItem__link}>
                رهن و اجاره‌ی خانه
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="#" className={styles.menuItem__link}>
                مشاورین املاک
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="#" className={styles.menuItem__link}>
                {" "}
                بلاگ رنتی فای
              </a>
            </li>
            <li className={styles.menuItem}>
              <a href="#" className={styles.menuItem__link}>
                درباره‌ رنتی فای
              </a>
            </li>
          </ul>
        </nav>
        {/* account */}
        <div className={styles.header__left}>
          {!user ? (
            <Link className="btn" href="/login">
              ورود | ثبت نام
            </Link>
          ) : (
            <Link className="btn btn-link" href="/user-panel">
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
                  d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0M12 16.5a6 6 0 0 0-5.198 3l-1.732-1a8 8 0 0 1 6.93-4 8 8 0 0 1 6.929 4l-1.732 1a6 6 0 0 0-5.198-3"
                  clipRule="evenodd"
                ></path>
              </svg>
              حساب من
            </Link>
          )}
          <Link
            className="btn btn-primary btn-sm"
            href={!user?"/login":"/register-step"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={24}
              height={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            ثبت آگهی رایگان
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
