import React, { useRef } from "react";
import styles from "./Slider.module.css";
const Slider = () => {
  const sliderRef = useRef(null);
  const nextSlideHandler = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const scrollAmount = slider.clientWidth * 0.36; // 33.3% of the container's width

      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const prevSlideHandler = () => {
    if (sliderRef.current) {
      const slider = sliderRef.current;
      const scrollAmount = slider.clientWidth * 0.36; // 33.3% of the container's width

      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderGrid} ref={sliderRef}>
        <div className={styles.sliderImg}>
          <img src="/images/h-1.png" alt="" className={styles.sliderImg__img} />
        </div>
        <div className={styles.sliderImg}>
          <img src="/images/h-2.png" alt="" className={styles.sliderImg__img} />
        </div>
        <div className={styles.sliderImg}>
          <img src="/images/h-3.png" alt="" className={styles.sliderImg__img} />
        </div>
        <div className={styles.sliderImg}>
          <img src="/images/h-4.png" alt="" className={styles.sliderImg__img} />
        </div>
      </div>
      <div className={styles.btnContainer}>
        <button className={styles.btnSlider} onClick={prevSlideHandler}>
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
              d="M16.834 13h-9.5v-2h9.5z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#fff"
              fillRule="evenodd"
              d="m15.92 12-2.793-2.793 1.414-1.414 3.5 3.5a1 1 0 0 1 0 1.414l-3.5 3.5-1.415-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <button className={styles.btnSlider} onClick={nextSlideHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M7.5 13H17v-2H7.5z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#fff"
              fillRule="evenodd"
              d="m8.414 12 2.793-2.793-1.414-1.414-3.5 3.5a1 1 0 0 0 0 1.414l3.5 3.5 1.414-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slider;
