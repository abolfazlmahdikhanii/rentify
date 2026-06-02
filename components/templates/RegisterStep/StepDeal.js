import React from "react";
import Select from "@/components/module/Form/Select";
import Input from "@/components/module/Form/Input";
import styles from "../../../styles/RegisterStep.module.css";

const StepDeal = ({ watch, setValue, errors, nextStep }) => {
  const formatCurrency = (value) =>
    value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const contractType = watch("contractType");

  const handleContractTypeChange = (val) => {
    setValue("contractType", val, { shouldValidate: true });

    if (val === "sale") {
      setValue("ejarePrice", "", { shouldValidate: false });
      setValue("rahnPrice", "", { shouldValidate: false });
    }

    if (val === "rent") {
      setValue("rahnPrice", "", { shouldValidate: false });
      setValue("sale", "", { shouldValidate: false });
    }
  };

  return (
    <>
      <div className={`${styles.formRow} ${styles.mb4}`}>
        <Select
          label="نوع ملک"
          placeHolder="نوع ملک خود را انتخاب کنید"
          size="lg"
          val={watch("houseType")}
          onChange={(val) => setValue("houseType", val)}
          error={errors.houseType}
          options={[
            { value: "villa", label: "ویلا" },
            { value: "apartment", label: "آپارتمان" },
            { value: "house", label: "خانه ویلایی" },
          ]}
        />
        <Select
          label="نوع معامله"
          placeHolder="نوع معامله خود را انتخاب کنید"
          size="lg"
          val={contractType}
          onChange={handleContractTypeChange}
          error={errors.contractType}
          options={[
            { value: "sale", label: "فروش" },
            { value: "mortgage", label: "رهن و اجاره" },
            { value: "rent", label: "اجاره" },
          ]}
        />
      </div>

      <div className={styles.formRow}>
        {contractType === "sale"  ? 
            <Input
              label="قیمت فروش"
              type="text"
              placeholder="مثلا 1,200,000,000 تومان"
              size="lg"
              val={watch("sale")}
              onChange={(val) => setValue("sale", formatCurrency(val))}
              error={errors.sale}
            />
          :null}

        {contractType === "rent"  ? (
            <Input
              label="اجاره"
              type="text"
              placeholder="مثلا 50 میلیون تومان"
              size="lg"
              val={watch("ejarePrice")}
              onChange={(val) => setValue("ejarePrice", formatCurrency(val))}
              error={errors.ejarePrice}
            />
          ):null}

        {contractType === "mortgage"  ? 
            <>
              <Input
                label="رهن"
                type="text"
                placeholder="مثلا 500 میلیون تومان"
                size="lg"
                val={watch("rahnPrice")}
                onChange={(val) => setValue("rahnPrice", formatCurrency(val))}
                error={errors.rahnPrice}
              />
              <Input
                label="اجاره"
                type="text"
                placeholder="مثلا 50 میلیون تومان"
                size="lg"
                val={watch("ejarePrice")}
                onChange={(val) => setValue("ejarePrice", formatCurrency(val))}
                error={errors.ejarePrice}
              />
            </>
          :null}
      </div>
    </>
  );
};

export default StepDeal;
