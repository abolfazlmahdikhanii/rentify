import PropertyDialog from "@/components/AdminPanel/PropertyDialog/PropertyDialog";
import { PropertyTable } from "@/components/AdminPanel/PropertyTable/PropertyTable";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getDate, toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/auth/admin/users", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const Users = () => {
  const { data, isLoading, mutate } = useSWR("users", fetcher);
  const [page, setPage] = useState(1);
  const [newUsers, setNewUsers] = useState([]);
  const [adDetail, setAdDetail] = useState(null);
  const [isOpenDiaog, setIsOpenDialog] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pageHandler = (page) => {
    setPage(page);
  };

  const approveHandler = (id) => {
    fetch(`http://localhost:5000/api/properties/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDialog(false);
        setPropertyDetail(null);
        toast.success("ملک با موفقیت ثبت شد", toastOption);
        mutate("admin-ad");
      })
      .catch((err) => {
        setIsOpenDialog(false);
        toast.error("خطا در ثبت ملک", toastOption);
      });
  };
  const rejectHandler = (id, reason) => {
    fetch(`http://localhost:5000/api/properties/${id}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDialog(false);
        setPropertyDetail(null);
        mutate("admin-ad");
        toast.success("ملک با موفقیت رد شد", toastOption);
      })
      .catch((err) => {
        setIsOpenDialog(false);
        toast.error("خطا در رد ملک", toastOption);
      });
  };
  const deleteHandler = (data) => {
    setPropertyDetail(data);
    setIsOpenDeleteModal(true);
  };
  const deleteProperty = (id) => {
    fetch(`http://localhost:5000/api/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDeleteModal(false);
        setIsOpenDialog(false);
        setPropertyDetail(null);
        mutate("admin-ad");
        toast.success("ملک با موفقیت حذف شد", toastOption);
      })
      .catch((err) => {
        setIsOpenDeleteModal(false);
        toast.error("خطا در حذف ملک", toastOption);
      });
  };
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده" role="admin">
      <Content type="tbl">
        <PropertyTable
          showData={true}
          cols={[
            "تصویر",
            "نام و نام خانوادگی",
            "ایمیل",
            "شغل",
            "نقش",
            "عملیات",
          ]}
          data={data?.users}
          setNewData={setNewUsers}
        >
          <tbody className="tbody">
            {data?.users?.length > 0
              ? newUsers.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        // src={
                        //   item.images.length > 0
                        //     ? item.images[0]?.url
                        //     : "/images/empty-image.jpg"
                        // }
                        src={"/images/empty-image.jpg"}
                        alt="house"
                        className="tbl-img"
                      />
                    </td>

                    <td className="tbl-txt">
                      {item.name} {item.lastName}
                    </td>
                    <td className="tbl-txt">{item.email}</td>
                    <td className="tbl-txt">{item.job?item.job:"--"}</td>
                    <td className="tbl-txt">
                      {item.role === "admin" ? "مدیر" : "کاربر عادی"}
                    </td>

                    <td style={{position:"relative"}}>
                      <button
                        className="btn btn-outline-5"
                        onClick={() => {
                          setOpenDropdownId(
                            openDropdownId === item.id ? null : item.id
                          );
                          setShowDropdown(prev=>!prev)
                        }}
                      >
                        <EllipsisVertical size={14} />
                      </button>
                      <ul
                        className={`drop-down--tbl shadow-light
              ${openDropdownId === item.id ? "active" : ""}`}
                        onMouseLeave={() => setShowDropdown(false)}
                      >
                        <li className="drop-down__btn">
                  
                          {item.role==="user"?"تغییر به مدیر":"تغییر به کاربر"}
                        </li>
                        <li
                          className="drop-down__btn"
                        //   onClick={() => setIsShowDeleteModal(true)}
                        >
               
                          حذف
                        </li>
                  
                      </ul>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </PropertyTable>

        {isOpenDiaog && (
          <PropertyDialog
            isOpen={isOpenDiaog}
            onClose={() => setIsOpenDialog(false)}
            property={adDetail}
            approveHandler={approveHandler}
            rejectHandler={rejectHandler}
            deleteHandler={deleteHandler}
          />
        )}

        {/* <EmptyList
          src={"/images/empty-add-ad.png"}
          title="شما هنوز آگهی‌ای ثبت نکردید!"
        /> */}
        {isOpenDeleteModal && (
          <DeleteModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            title="حذف ملک"
            question="آیا از حذف این ملک اطمینان دارید؟ این عملیات قابل بازگشت نیست."
            property={propertyDetail}
            onConfirm={() => deleteProperty(propertyDetail.id)}
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Users;
