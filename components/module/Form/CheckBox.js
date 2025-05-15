import React, { useId } from "react";

const CheckBox = ({ title, val, setVal,onChange }) => {
  const id = useId();
  return (
    <div className={"checkboxGroup"}>
      <input
        type="checkbox"
        id={`negotiable-${id}`}
        className={"checkbox"}
        value={val}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={`negotiable-${id}`} className={"checkboxLabel"}>
        {title}
      </label>
    </div>
  );
};

export default CheckBox;
