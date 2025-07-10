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
      <div className={`inputWrapper inputWrapper_${size}`}>
        <input
          type={type}
          className={`input ${error ? "inputError" : ""}`}
          placeholder={placeholder}
          value={val||""}
          dir="auto"
        
          onChange={(e) => onChange(e.target.value)}
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
