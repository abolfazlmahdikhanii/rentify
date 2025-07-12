import React, { useState } from "react";
import styles from "./herobg.module.css";
import DropDown from "../DropDown/DropDown";
import { useRouter } from "next/router";

const HeroBg = ({ children,houses }) => {
  const newLocation = Array.from(new Set(houses.map((item) => item.location)));
  const [selectedLocation, setSelectedLocation] = useState(newLocation[0]);
  const [selectedHomeType, setSelectedHomeType] = useState("Apartment");
  const [selectedContractType, setSelectedContractType] = useState("رهن");
  const router = useRouter();

  const searchHomeHandler = () => {
    router.push({
      pathname: "/homes",
      query: {
        location: selectedLocation,
        type: selectedHomeType,
        cType: selectedContractType,
      },
    });
  };
  return (
    <div className={styles.heroBg}>
      <div className={styles.headerBg__info}>
        <h3 className={styles.header_title}>
          در <span className={styles.header_titlePrimary}>رنتی‌فای</span> دنبال
          چه ملکی هستید؟
        </h3>

        <div className={styles.searchBox}>
          <div className={styles.searchBox__right}>
            <DropDown
              title="موقعیت مکانی"
              datas={newLocation}
              selected={selectedLocation}
              setSelected={setSelectedLocation}
            />
            <DropDown
              title="نوع ملک"
              datas={["Apartment", "Villa", "House"]}
              selected={selectedHomeType}
              setSelected={setSelectedHomeType}
            />
            <DropDown
              title="نوع قرارداد"
              datas={["رهن", "اجاره"]}
              selected={selectedContractType}
              setSelected={setSelectedContractType}
            />
          </div>
          <div className={styles.searchBox__left} onClick={searchHomeHandler}>
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            جستجو
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBg;
