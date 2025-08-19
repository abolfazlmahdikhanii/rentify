import PropertyDialog from "@/components/templates/AdminPanel/PropertyDialog/PropertyDialog";
import { PropertyTable } from "@/components/templates/AdminPanel/PropertyTable/PropertyTable";
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
import Loader from "@/components/module/Loader/Loader";

const fetcher = () =>
  fetch("https://rentify-project.ir/api/auth/admin/users", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const Users = () => {
  const { data, isLoading, mutate, error } = useSWR("users", fetcher);

  const [newUsers, setNewUsers] = useState([]);

  const [isOpenChangeDialog, setIsOpenChangeDialog] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const deleteUser = (id) => {
    fetch(`https://rentify-project.ir/api/auth/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDeleteModal(false);
        setIsOpenDialog(false);
        setPropertyDetail(null);
        setOpenDropdownId(null);
        mutate("users");
        toast.success("کاربر با موفقیت حذف شد", toastOption);
      })
      .catch((err) => {
        setIsOpenDeleteModal(false);
        toast.error("خطا در حذف کاربر", toastOption);
      });
  };
  const changeUserRoleHandler = (id, role) => {
    const newRole = role === "user" ? "admin" : "user";
    fetch(`https://rentify-project.ir/api/auth/admin/change-role/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({ newRole: newRole }),
    })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("خطا در تغییر کاربر", toastOption);
        } else if (res.ok) {
          toast.success("کاربر با موفقیت تغییر یافت", toastOption);
        }
        return res.json();
      })
      .then((data) => {
        setIsOpenDeleteModal(false);
        setIsOpenDialog(false);
        setOpenDropdownId(null);
        mutate("users");
      })
      .catch((err) => {
        setIsOpenDeleteModal(false);
        setOpenDropdownId(null);
        setIsOpenDialog(false);
        toast.error("خطا در تغییر کاربر", toastOption);
      });
  };
  if (isLoading) return <Loader />;
  if (error) return toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="کاربران" role="admin">
      <Content type="tbl">
        {data?.users?.length ? (
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
                          src={"/images/profile.png"}
                          alt="house"
                          className="tbl-img"
                        />
                      </td>

                      <td className="tbl-txt">
                        {item.name} {item.lastName}
                      </td>
                      <td className="tbl-txt">{item.email}</td>
                      <td className="tbl-txt">{item.job ? item.job : "--"}</td>
                      <td className="tbl-txt">
                        {item.role === "admin" ? "مدیر" : "کاربر عادی"}
                      </td>

                      <td style={{ position: "relative" }}>
                        <button
                          className="btn btn-outline-5"
                          onClick={() => {
                            setOpenDropdownId(item.id);
                            setShowDropdown((prev) => !prev);
                          }}
                        >
                          <EllipsisVertical size={14} />
                        </button>
                        <ul
                          className={`drop-down--tbl shadow-light
              ${openDropdownId === item.id && showDropdown ? "active" : ""}`}
                          // onMouseLeave={() => setShowDropdown(false)}
                        >
                          <li
                            className="drop-down__btn"
                            onClick={() => {
                              setIsOpenChangeDialog(true);
                              setUserRole(item.role);
                              setShowDropdown(false);
                            }}
                          >
                            {item.role === "user"
                              ? "تغییر به مدیر"
                              : "تغییر به کاربر"}
                          </li>
                          <li
                            className="drop-down__btn"
                            onClick={() => {
                              setIsOpenDeleteModal(true);
                              setShowDropdown(false);
                            }}
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
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title=" هنوز کاربری ثبت نشده!"
            noBtn={true}
          />
        )}
        {isOpenDeleteModal && (
          <DeleteModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            title="حذف کاربر"
            question="آیا از حذف این کاربر اطمینان دارید؟ این عملیات قابل بازگشت نیست."
            property={propertyDetail}
            onConfirm={() => deleteUser(openDropdownId)}
          />
        )}
        {isOpenChangeDialog && (
          <DeleteModal
            isOpen={isOpenChangeDialog}
            onClose={() => setIsOpenChangeDialog(false)}
            title="تغییر نقش"
            question="آیا از تغییر نقش این کاربر اطمینان دارید؟ این عملیات قابل بازگشت نیست."
            onConfirm={() => changeUserRoleHandler(openDropdownId, userRole)}
            type="modify"
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Users;
