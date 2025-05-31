import Image from "next/image";
import React, { useContext } from "react";
import styles from "./SideBar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import AdminSideBar from "../AdminPanel/AdminSideBar/AdminSideBar";
import UserSideBar from "../UserPanel/UserSideBar/UserSideBar";

const SideBar = () => {
  const routes = useRouter();
  const { user } = useContext(AuthContext);

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
            alt={user.name}
            width={64}
            height={64}
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>
            {user.name} {user.lastName}
          </h3>
          <p className={styles.profilePhone}>{user.email}</p>
        </div>
      </div>
      {user.role === "admin" ? (
        <AdminSideBar isActiveHandler={isActiveHandler} />
      ) : (
        <UserSideBar isActiveHandler={isActiveHandler} />
      )}
    </div>
  );
};

export default SideBar;
