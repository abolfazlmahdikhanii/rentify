import React from "react";
import Select from "@/components/module/Form/Select";
import Input from "@/components/module/Form/Input";
import styles from "../../../styles/RegisterStep.module.css";

const UNITS_PER_FLOOR_OPTIONS = [
  ...Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} واحد`,
  })),
  { value: "more_than_10", label: "بیش از ۱۰ واحد" },
];

const StepDetails = ({ watch, setValue, errors }) => {
  return (
    <>
      <div className={`${styles.formRow} ${styles.mb4}`}>
        <Select
          label="تعداد اتاق خواب"
          placeHolder="تعداد اتاق خواب را انتخاب کنید"
          size="lg"
          val={watch("bedrooms")}
          defaultValue={watch("bedrooms")}
          onChange={(val) => setValue("bedrooms", val)}
          error={errors.bedrooms}
          options={Array(10)
            .fill(0)
            .map((item, i) => ({
              value: i + 1,
              label: `${i + 1} خوابه`,
            }))}
        />
        <Select
          label="سن بنا"
          placeHolder="سن بنا را انتخاب کنید"
          size="lg"
          val={watch("buildingAge")}
          defaultValue={watch("buildingAge")}
          onChange={(val) => setValue("buildingAge", val)}
          error={errors.buildingAge}
          options={Array(50)
            .fill(0)
            .map((item, i) => ({
              value: i + 1,
              label: `${i + 1} سال ساخت`,
            }))}
        />
      </div>

      <div className={`${styles.formRow} ${styles.mb4}`}>
        <Select
          label="نوع واحد"
          placeHolder="نوع واحد را انتخاب کنید"
          size="lg"
          val={watch("unitType")}
          defaultValue={watch("unitType")}
          onChange={(val) => setValue("unitType", val)}
          error={errors.unitType}
          options={[
            { value: "maskoni", label: "واحد مسکونی" },
            { value: "tejari", label: "واحد تجاری" },
            { value: "tejari", label: "واحد صنعتی" },
          ]}
        />
        <Input
          label="زیر بنا (متر)"
          type="number"
          placeholder="متراژ زیر بنا را وارد کنید"
          size="lg"
          val={watch("areaSize")}
          onChange={(val) => setValue("areaSize", val)}
          error={errors.areaSize}
        />
      </div>

      <div className={`${styles.formRow} ${styles.mb4}`}>
        <Select
          label="موقعیت"
          placeHolder="موقعیت جغرافیایی ملک را انتخاب کنید"
          size="lg"
          val={watch("location")}
          defaultValue={watch("location")}
          onChange={(val) => setValue("location", val)}
          error={errors.location}
          options={[
            { value: "north", label: "شمال" },
            { value: "south", label: "جنوب" },
            { value: "east", label: "شرق" },
            { value: "west", label: "غرب" },
            { value: "center", label: "مرکز شهر" },
          ]}
        />
        <Select
          label="طبقه"
          placeHolder="طبقه ملک را انتخاب کنید"
          size="lg"
          val={watch("floor")}
          defaultValue={watch("floor")}
          onChange={(val) => setValue("floor", val)}
          error={errors.floor}
          options={[
            { value:-1, label: "زیرزمین" },
            { value: 0, label: "همکف" },
            ...Array.from({ length: 20 }, (_, i) => ({
              value: i + 1,
              label: `${i + 1}${i === 0 ? "م" : "م"}`,
            })),
            { value: "penthouse", label: "پنت هاوس" },
            { value: "rooftop", label: "پشت بام" },
          ]}
        />
      </div>

      <div className={`${styles.formRow} ${styles.mb1}`}>
        <Select
          label="تعداد طبقات"
          placeHolder="تعداد طبقات ساختمان را انتخاب کنید"
          size="lg"
          val={watch("totalFloors")}
          defaultValue={watch("totalFloors")}
          onChange={(val) => setValue("totalFloors", val)}
          error={errors.totalFloors}
          options={[
            ...Array.from({ length: 20 }, (_, i) => ({
              value: String(i + 1),
              label: `${i + 1} طبقه`,
            })),
            { value: "more_than_20", label: "بیش از ۲۰ طبقه" },
          ]}
        />
        <Select
          label="تعداد واحد هر طبقه"
          placeHolder="تعداد واحد هر طبقه را انتخاب کنید"
          size="lg"
          val={watch("unitsPerFloor")}
          onChange={(val) => setValue("unitsPerFloor", val)}
          error={errors.unitsPerFloor}
          options={UNITS_PER_FLOOR_OPTIONS}
        />
      </div>
    </>
  );
};

export default StepDetails;
