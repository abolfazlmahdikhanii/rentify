import React, { useId } from "react";

const CheckBox = ({ title, val, setVal, onChange, checked, id }) => {
  const generatedId = useId();
  const inputId = id || `negotiable-${generatedId}`;
  return (
    <div className={"checkboxGroup"}>
      <input
        type="checkbox"
        id={inputId}
        className={"checkbox"}
        value={val}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={inputId} className={"checkboxLabel"}>
        {title}
      </label>
    </div>
  );
};

export default CheckBox;
