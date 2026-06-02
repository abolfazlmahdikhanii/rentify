import React from "react";
import Select from "@/components/module/Form/Select";
import Input from "@/components/module/Form/Input";
import MapSelect from "@/components/module/Map/MapSelect";
import ModalMap from "@/components/templates/RegisterStep/ModalMap";
import styles from "../../../styles/RegisterStep.module.css";

const StepLocation = ({
  cities,
  watch,
  setValue,
  errors,
  isShowModal,
  setIsShowModal,
  position,
  setPosition,
}) => {
  return (
    <>
      <div className={`${styles.formRow} ${styles.mb4}`}>
        <Select
          label="شهر"
          placeHolder="شهر خود را انتخاب کنید"
          size="lg"
          val={watch("city")}
          error={errors.city}
          options={cities?.states?.map((item) => ({
            value: item._id,
            label: item.title,
          }))}
          onChange={(val) => {
            setValue("city", val);
            setValue(
              "cityName",
              cities?.states?.find((item) => item._id === val)?.title,
            );
          }}
        />
        <Input
          label="خیابان فرعی یا کوچه"
          type="text"
          placeholder="آدرس خود را وارد کنید"
          size="lg"
          val={watch("street")}
          error={errors.street}
          onChange={(val) => setValue("street", val)}
        />
      </div>

      <div className={`${styles.formRow}`}>
        <Input
          label="خیابان یا محله‌ی اصلی"
          type="text"
          placeholder="آدرس خود را وارد کنید"
          size="lg"
          val={watch("mainArea")}
          error={errors.mainArea}
          onChange={(val) => setValue("mainArea", val)}
        />
        <Input
          label="آدرس دقیق و پلاک"
          type="text"
          placeholder="آدرس خود را وارد کنید"
          size="lg"
          val={watch("exactAddress")}
          error={errors.exactAddress}
          onChange={(val) => setValue("exactAddress", val)}
        />
      </div>

      <div className={`${styles.formRow} ${styles.mapContainer}`}>
        <MapSelect isEnable={false} />
        <div className={styles.showMap} onClick={() => setIsShowModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              fill="#353739"
              d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14M12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2"
            ></path>
          </svg>
          ثبت روی نقشه
        </div>
      </div>

      {isShowModal && (
        <ModalMap
          onClose={() => setIsShowModal(false)}
          onConfirm={() => {
            setValue("position", position);
            setIsShowModal(false);
          }}
        >
          <MapSelect
            isEnable={true}
            position={position}
            setPosition={setPosition}
          />
        </ModalMap>
      )}
    </>
  );
};

export default StepLocation;
