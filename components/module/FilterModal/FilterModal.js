import { useState } from "react";
import styles from "./FilerModal.module.css";
import FilterSection from "./FilterSection";
import CheckboxItem from "./CheckboxItem";
import ToggleItem from "./ToggleItem";

export default function FilterModal({ close, onFilter,minPrice,setMinPrice,maxPrice ,setMaxPrice,roomCount,setRoomCount,withPhoto,setWithPhoto,houseType,setHouseType,resetFilters}) {
  
  const [agencyOnly, setAgencyOnly] = useState(false);


  return (
    <>
      <div className={styles.backDrop}></div>

      <div className={`${styles.container}`} dir="rtl">
        {/* Header with close button */}
        <div className={styles.header}>
          <h2 className={styles.title}>فیلترها</h2>
          <button className={styles.closeButton} onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              fill="none"
              viewBox="0 0 24 25"
            >
              <path
                fill="#0C0C0C"
                fillRule="evenodd"
                d="m3.293 19.793 16-16 1.414 1.414-16 16z"
                clipRule="evenodd"
              ></path>
              <path
                fill="#0C0C0C"
                fillRule="evenodd"
                d="m20.707 19.793-16-16-1.414 1.414 16 16z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* Filter sections */}

          <FilterSection title="نوع ملک" defaultOpen={true}>
            <div className={styles.checkboxGroup}>
              <CheckboxItem
                label="آپارتمان"
                onCheck={() => setHouseType((prev) => houseType.length?[...prev, "Apartment"]:[ "Apartment"])}
                remove={() =>
                  setHouseType((prev) =>
                    prev.filter((item) => item !== "Apartment")
                  )
                }
                check={houseType.includes("Apartment")}
              />
              <CheckboxItem
                label=" ویلا"
                onCheck={() => setHouseType((prev) => houseType.length?[...prev, "Villa"]:[ "Villa"])}
                remove={() =>
                  setHouseType((prev) =>
                    prev.filter((item) => item !== "Villa")
                  )
                }
                check={houseType.includes("Villa")}
              />
              <CheckboxItem
                label="خانه ویلایی"
                onCheck={() => setHouseType((prev) => houseType.length?[...prev, "House"]:[ "House"])}
                remove={() =>
                  setHouseType((prev) =>
                    prev.filter((item) => item !== "House")
                  )
                }
                check={houseType.includes("House")}
              />
            </div>
          </FilterSection>

          <FilterSection title="شهر">
            {/* City dropdown content would go here */}
          </FilterSection>

          <FilterSection title="زمین">
            {/* Land/area dropdown content would go here */}
          </FilterSection>

          <FilterSection title="اجاره">
            {/* Rent dropdown content would go here */}

            <div className={"inputGroup"}>
              <p className={styles.controlText}>از</p>

              <div>
                <div className={"inputLabel"}>حداقل قیمت</div>
                <div className={"inputWrapper"}>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={"input"}
                    placeholder="0"
                  />
                  <button
                    className={styles.clearButton}
                    onClick={() => setMinPrice("")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={16}
                      height={16}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className={"inputGroup"}>
              <p className={styles.controlText}>تا</p>

              <div>
                <div className={"inputLabel"}>حداکثر قیمت</div>
                <div className={"inputWrapper"}>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={"input"}
                    placeholder="0"
                  />
                  <button
                    className={styles.clearButton}
                    onClick={() => setMaxPrice("")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={16}
                      height={16}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </FilterSection>

          {/* Price range inputs */}

          <FilterSection title="متراژ">
            {/* Area/size dropdown content would go here */}
          </FilterSection>

          <FilterSection title="تعداد اتاق">
            <div className={styles.roomCountWrapper}>
              <div className={styles.roomCounter}>
                <button
                  className={styles.counterButton}
                  onClick={() => setRoomCount(roomCount + 1)}
                >
                  <span className={styles.counterButtonText}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        fill="#595C61"
                        fillRule="evenodd"
                        d="M5.5 11V1h1v10z"
                        clipRule="evenodd"
                      ></path>
                      <path
                        fill="#595C61"
                        fillRule="evenodd"
                        d="M11 6.5H1v-1h10z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
                <div className={styles.roomCount}>{roomCount} اتاق</div>
                <button
                  className={styles.counterButton}
                  onClick={() => setRoomCount(Math.max(0, roomCount - 1))}
                >
                  <span className={styles.counterButtonText}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        fill="#595C61"
                        fillRule="evenodd"
                        d="M11 6.5H1v-1h10z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="امکانات">
            {/* Amenities dropdown content would go here */}
          </FilterSection>

          <FilterSection title="امکانات تصویری آگهی" defaultOpen={true}>
            <div className={styles.toggleGroup}>
             
              <ToggleItem
                label="فقط آگهی های عکس دار"
                checked={withPhoto}
                onChange={() => setWithPhoto(!withPhoto)}
              />
             
            </div>
          </FilterSection>
        </div>

        {/* Action buttons */}
        <div className={styles.actionButtons}>
          <button className={`btn btn-outline-3`} onClick={resetFilters}>حذف همه</button>
          <button
            className={`btn btn-primary btn-center`}
            onClick={() =>
              onFilter({
                houseType,
                withPhoto,
                
                room: roomCount,
                ejareMin: minPrice,
                ejareMax: maxPrice,
              })
            }
          >
            مشاهده نتایج
          </button>
        </div>
      </div>
    </>
  );
}

// Toggle switch component
