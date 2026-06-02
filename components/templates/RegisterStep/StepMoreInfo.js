import React from "react";
import CheckBox from "@/components/module/Form/CheckBox";
import Input from "@/components/module/Form/Input";
import styles from "../../../styles/RegisterStep.module.css";

const StepMoreInfo = ({ watch, setValue, errors, fillTitle }) => {
  return (
    <>
      <Input
        label="عنوان را وارد کنید"
        type="text"
        placeholder="عنوان خود را وارد کنید"
        size="lg"
        val={watch("title") || fillTitle()}
        error={errors.title}
        onChange={(val) => setValue("title", val)}
      />
      <textarea
        className="text-area"
        placeholder="توضیحات خود را اینجا بنویسید..."
        onChange={(e) => setValue("description", e.target.value)}
        value={watch("description")}
      />
      {errors.description && (
        <p role="alert" className="errorMessage">
          {errors.description.message}
        </p>
      )}
      <div className={styles.chkContainer}>
        <CheckBox
          title="ملک در اجاره است."
          checked={watch("isRented")}
          onChange={(val) => setValue("isRented", val)}
        />
        <CheckBox
          title="ملک تخلیه و مناسب بازدید است."
          checked={watch("isReadyForVisit")}
          onChange={(val) => setValue("isReadyForVisit", val)}
        />
      </div>
    </>
  );
};

export default StepMoreInfo;
