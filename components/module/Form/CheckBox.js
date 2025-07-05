import React, { useId } from "react";

const CheckBox = ({ title, val, setVal,onChange,checked }) => {
  const id = useId();
  // console.log(val);
  return (
    <div className={"checkboxGroup"}>
      <input
        type="checkbox"
        id={`negotiable-${id}`}
        className={"checkbox"}
        value={val}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={`negotiable-${id}`} className={"checkboxLabel"}>
        {title}
      </label>
    </div>
  );
};

export default CheckBox;
