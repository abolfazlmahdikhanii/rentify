import React from "react";
import CheckBox from "@/components/module/Form/CheckBox";
import styles from "../../../styles/RegisterStep.module.css";

const StepEquipment = ({ equip, watch, errors, onChange }) => {
  return (
    <>
      {equip?.data ? (
        <div className={styles.gridForm}>
          {equip.data.map((item, index) => {
            const itemId = item.id ?? item._id ?? index;
            const isChecked = watch("facilities")?.includes(itemId) || false;
            return (
              <CheckBox
                key={itemId}
                id={`equipment-${itemId}`}
                title={item.title}
                checked={isChecked}
                onChange={(checked) => onChange(itemId, checked)}
              />
            );
          })}
        </div>
      ) : (
        <div>در حال بارگذاری تجهیزات...</div>
      )}

      {errors.facilities && (
        <p role="alert" className="errorMessage">
          {errors.facilities.message}
        </p>
      )}
    </>
  );
};

export default StepEquipment;
