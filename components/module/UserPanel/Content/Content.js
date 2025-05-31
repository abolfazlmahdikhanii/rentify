import React from "react";

const Content = ({ children, type }) => {
  return (
    <>
      <div className={`form-card ${type === "tbl" ? "form-card__tbl" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default Content;
