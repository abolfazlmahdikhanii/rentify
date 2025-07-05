import React from "react";

const Content = ({ children, type,isDashboard }) => {
  return (
    <>
      <div className={` ${isDashboard?"form-card__admin":"form-card"} ${type === "tbl" ? "form-card__tbl" : ""}` }>
        {children}
      </div>
    </>
  );
};

export default Content;
