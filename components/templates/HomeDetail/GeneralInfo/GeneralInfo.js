import React, { useEffect, useState } from "react";
import styles from "./GenralInfo.module.css";

import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import Title from "@/components/module/Title/Title";
import { useRouter } from "next/router";
import LocationInfo from "../LocationInfo/LocationInfo";
import MapLocation from "@/components/module/Map/MapLocation";
import { ChevronLeft } from "lucide-react";
import EmptyItem from "@/components/module/EmptyItem/EmptyItem";
const GeneralInfo = ({ data, locationDetail, equipment }) => {
  const [tabActive, setTabActive] = useState("main");
  const [locationTabActive, setLocationTabActive] = useState("sports");
  const [isMap, setIsMap] = useState(false);
  const [isMoreContent, setIsMoreContent] = useState(false);
  const [sections, setSections] = useState([
    { id: "main" },
    { id: "equipment" },
    { id: "description" },
    { id: "floor-map" },
    { id: "location" },
    { id: "virtual-tour" },
  ]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTabActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6, // Section becomes active when 50% visible
      }
    );

    sections.forEach(({ id }) => {
      const sectionElement = document.getElementById(id);
      if (sectionElement) observer.observe(sectionElement);
    });

    return () => observer.disconnect();
  }, [sections]);
  return (
    <div className={` ${styles.generalInfo}`}>
      {/* tab */}
      <Tab>
        <TabItem
          title="اطلاعات اصلی"
          value="main"
          href="#main"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
        <TabItem
          title="تجهیزات و امکانات"
          value="equipment"
          href="#equipment"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
        <TabItem
          title="توضیحات"
          value="description"
          href="#description"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
        <TabItem
          title="نقشه طبقه"
          value="floor-map"
          href="#floor-map"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
        <TabItem
          title="موقعیت مکانی"
          value="location"
          href="#location"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
        <TabItem
          title="تور مجازی"
          value="virtual-tour"
          href="#virtual-tour"
          tabActive={tabActive}
          setTabActive={setTabActive}
        />
      </Tab>
      <section className={styles.section} id="main">
        <Title title="اطلاعات اصلی" />
        <div className={styles.sectionGrid}>
          <p className={styles.sectionText}>
            مساحت زیر بنا: <span>{data?.building_area||"-"}</span>
          </p>
          <p className={styles.sectionText}>
            مساحت زمین: <span>{data?.land_area || "-"}</span>
          </p>
          <p className={styles.sectionText}>
            طبقات: <span>{data?.floors||1}</span>
          </p>
          <p className={styles.sectionText}>
            خواب: <span>{data?.bedrooms||1}</span>
          </p>
          <p className={styles.sectionText}>
            سرویس بهداشتی: <span>{data?.bathrooms || 1}</span>
          </p>
          <p className={styles.sectionText}>
            طبقه: <span>{data?.floor_number||1}</span>
          </p>
          <p className={styles.sectionText}>
            هر طبقه: <span>{data?.units_per_floor||1}</span>
          </p>
        </div>
      </section>
      <section className={styles.section} id="equipment">
        <Title title="تجهیزات و امکانات" />
        <div className={styles.sectionGrid}>
          {equipment.length?
            equipment.map((item, i) => (
              <p key={item.id} className={styles.sectionIcon}>
                <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                {item.title}
              </p>
            )):<EmptyItem title="هنوز تجهیزاتی ثبت نشده است" />}
        </div>
      </section>
      <section className={styles.section} id="description">
        <Title title="توضیحات" />
        <div>
        {data.description?
          <>
            <p
            className={`${styles.disContent} ${
              isMoreContent ? styles.expend : ""
            }`}
          >
            {data && data?.description}
          </p>
          <p
            className={styles.btnMore}
            onClick={() => setIsMoreContent((prev) => !prev)}
          >
            {!isMoreContent ? "مشاهده بیشتر" : "بستن"} <ChevronLeft size={15} />
          </p>
          </>:<EmptyItem title="توضیحاتی ثبت نشده" />
        }
        </div>
      </section>
      <section className={styles.section} id="floor-map">
        <Title title="نقشه طبقه" />
        <div className={styles.sectionImg}>
          <img src="/images/h-map.png" alt="" />
        </div>
      </section>
      <section className={styles.section} id="location">
        <Title title="موقعیت مکانی" />

        <div className={styles.locationContainer}>
      
        
           {locationDetail?.latitude && locationDetail?.longitude ? (
             <MapLocation
              lat={locationDetail?.latitude}
              long={locationDetail?.longitude}
            />):<EmptyItem title="موقعیتی برای این ملک ثبت نشده" />
           }
        
        </div>
      </section>
      <section className={styles.section} id="virtual-tour">
        <Title title="تور مجازی" />
        <div className={styles.sectionTour}>
          <img src="/images/h-d2.png" alt="" />
          <button className={styles.btnPlay}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 32 32"
            >
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M14.593 8.443a2.62 2.62 0 0 0-2.453-.248c-.727.297-1.474 1.018-1.474 2.103v11.403c0 1.086.747 1.807 1.473 2.103a2.62 2.62 0 0 0 2.454-.247l8.397-5.702C23.612 17.432 24 16.753 24 16s-.388-1.433-1.01-1.855z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default GeneralInfo;
