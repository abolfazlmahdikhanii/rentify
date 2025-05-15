import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";
import SideBar from "@/components/module/UserPanel/SideBar/SideBar";
import React from "react";

const DashboardLayout = ({ children, title, subTitle,role="user" }) => {
  return (
    <PrivateRoute role={role}>
      <div className="container-panel container">
      <SideBar />

      <div className="content">
        <div className="titleContent">
          <h1 className="title">{title}</h1>
          {subTitle && <p className="sub-title">{subTitle}</p>}
        </div>

        {children}
      </div>
    </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
