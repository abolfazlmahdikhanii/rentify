import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";
import SideBar from "@/components/module/SideBar/SideBar";
import { AuthContext } from "@/context/AuthContext";
import { PanelContext } from "@/context/PanelContext";
import React, { useContext } from "react";

const DashboardLayout = ({ children, title, subTitle, role = "user" }) => {
  const { isShowModal, closeModalLogout } = useContext(PanelContext);
  const { logoutHandler } = useContext(AuthContext);
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
      {isShowModal && (
        <DeleteModal
          isOpen={isShowModal}
          onClose={closeModalLogout}
          title="خروج کاربر"
          question="آیا میخواهید از حساب کاربری خود خارج شوید؟ این عملیات قابل بازگشت نیست."
          onConfirm={() => {
            logoutHandler();
            closeModalLogout();
          }}
          btnText={"خروج"}
        />
      )}
    </PrivateRoute>
  );
};

export default DashboardLayout;
