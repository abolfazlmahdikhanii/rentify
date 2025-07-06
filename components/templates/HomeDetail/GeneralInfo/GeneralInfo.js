import React, { useEffect, useState } from "react";
import styles from "./GenralInfo.module.css";

import Tab from "@/components/module/Tab/Tab";
import TabItem from "@/components/module/Tab/TabItem";
import Title from "@/components/module/Title/Title";
import { useRouter } from "next/router";
import LocationInfo from "../LocationInfo/LocationInfo";
import MapLocation from "@/components/module/Map/MapLocation";
import { ChevronLeft } from "lucide-react";
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
            مساحت زیر بنا: <span>{data?.building_area}</span>
          </p>
          <p className={styles.sectionText}>
            مساحت زمین: <span>{data?.land_area || 0}</span>
          </p>
          <p className={styles.sectionText}>
            طبقات: <span>{data?.floors}</span>
          </p>
          <p className={styles.sectionText}>
            خواب: <span>{data?.bedrooms}</span>
          </p>
          <p className={styles.sectionText}>
            سرویس بهداشتی: <span>{data?.bathrooms || 0}</span>
          </p>
          <p className={styles.sectionText}>
            طبقه: <span>{data?.floor_number}</span>
          </p>
          <p className={styles.sectionText}>
            هر طبقه: <span>{data?.units_per_floor}</span>
          </p>
        </div>
      </section>
      <section className={styles.section} id="equipment">
        <Title title="تجهیزات و امکانات" />
        <div className={styles.sectionGrid}>
          {equipment &&
            equipment.map((item, i) => (
              <p key={item.id} className={styles.sectionIcon}>
                <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
                {item.title}
              </p>
            ))}
        </div>
      </section>
      <section className={styles.section} id="description">
        <Title title="توضیحات" />
        <div>
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
          <div className={styles.locationHeader}>
            <div className={styles.locationTab}>
              <button
                className={`${styles.locationTab__item} ${
                  locationTabActive === "sports"
                    ? styles.locationTab__itemActive
                    : ""
                }`}
                onClick={() => {
                  setLocationTabActive("sports");
                  setIsMap(false);
                }}
              >
                تفریحی
              </button>
              <button
                className={`${styles.locationTab__item} ${
                  locationTabActive === "transport"
                    ? styles.locationTab__itemActive
                    : ""
                }`}
                onClick={() => {
                  setLocationTabActive("transport");
                  setIsMap(false);
                }}
              >
                حمل و نقل
              </button>
            </div>
            <div>
              <button className="btn-outline-2" onClick={() => setIsMap(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 25"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M7.73 6.029C6.689 6.997 6 8.453 6 10.428c0 1.289.76 2.963 1.91 4.699 1.122 1.692 2.499 3.274 3.495 4.34a.8.8 0 0 0 1.19 0c.996-1.065 2.373-2.648 3.495-4.34 1.15-1.736 1.91-3.41 1.91-4.7 0-1.974-.688-3.43-1.73-4.398C15.215 5.05 13.721 4.5 12 4.5s-3.216.551-4.27 1.529M6.37 4.563C7.85 3.19 9.856 2.5 12 2.5s4.15.69 5.63 2.063C19.121 5.947 20 7.955 20 10.428c0 1.92-1.063 4.022-2.243 5.803-1.209 1.824-2.67 3.499-3.702 4.602a2.8 2.8 0 0 1-4.11 0c-1.033-1.103-2.493-2.777-3.702-4.602C5.063 14.451 4 12.348 4 10.428c0-2.473.879-4.48 2.37-5.865"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0"
                    clipRule="evenodd"
                  ></path>
                </svg>
                مشاهده نقشه
              </button>
            </div>
          </div>
          {/* section sport */}
          {/* {!isMap && locationTabActive === "sports" && (
            <LocationInfo info={data?.nearby_places?.entertainment} />
          )} */}
          {/* section transport */}
          {/* {!isMap && locationTabActive === "transport" && (
            <LocationInfo info={data?.nearby_places?.transport} />
          )} */}
          {isMap && (
            <MapLocation
              lat={locationDetail?.latitude}
              long={locationDetail?.longitude}
            />
          )}
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
