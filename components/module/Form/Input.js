import React from "react";

const Input = ({
  type = "text",
  label,
  placeholder,
  size = "md",
  error,
  name,
  register,
  required = false,
  valueAsNumber = false,
  onChange,
  val,
  ...rest
}) => {
  return (
    <div className="inputContainer">
      {label && <div className="inputLabel">{label}</div>}
      <div className={size === "md" ? "inputWrapper" : "inputWrapper2"}>
        <input
          type={type}
          className={`input ${error ? "inputError" : ""}`}
          placeholder={placeholder}
          value={val}
          // {...(register
          //   ? register(name, {
          //       required: required && "لطفا این فیلد را تکمیل کنید",
          //       valueAsNumber: type === "number" || valueAsNumber,
          //       ...rest,
          //     })
          //   : {})}
          onChange={(e => onChange(e.target.value))}
        />
      </div>
      {error && (
        <p className="errorMessage" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;