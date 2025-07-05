import React from "react";

const Select = ({
  label,
  placeHolder,
  options = [],
  size = "md",
  error,
  name,
  register,
  required = false,
  defaultValue = "",
  onChange,
  val,
  ...rest
}) => {
  return (
    <div className="inputContainer">
      {label && <div className="inputLabel">{label}</div>}
      <div className={`inputWrapper inputWrapper_${size}`}>
        <select
          className={`selectForm ${error ? "selectError" : ""}`}
          value={val || defaultValue || ""}
          // {...(register
          //   ? register(name, {
          //       required: required && "لطفا این فیلد را انتخاب کنید",
          //       ...rest,
          //     })
          //   : {})}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled hidden>
            {placeHolder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="selectArrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            fill="none"
            viewBox="0 0 17 16"
            className="btnDown"
          >
            <path
              fill="#C4C4C4"
              fillRule="evenodd"
              d="M8.5 8.224 6.638 6.362l-.943.943L8.03 9.638c.26.26.682.26.942 0l2.334-2.333-.943-.943z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
      {error && (
        <p className="errorMessage" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Select;
