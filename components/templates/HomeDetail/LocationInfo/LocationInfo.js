import React from "react";
import styles from "./LocationInfo.module.css";
const LocationInfo = ({ info }) => {
  return (
    <section className={styles.sectionLocation}>
      {info?.map((item, i) => (
        <div key={i + 1} className={styles.locationItem}>
          <div>
            <p className={styles.locationItem__text}>{item.name}</p>
          </div>
          <div className={styles.locationRate}>
            <div className={styles.locationRate__progress}>
              <p style={{ width: `${item.rating?.split("/")[0]*10}%` }}></p>
            </div>
            <p className={styles.locationRate__text}>{item.rating}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default LocationInfo;
