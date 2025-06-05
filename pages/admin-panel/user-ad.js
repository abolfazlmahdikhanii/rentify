import PropertyDialog from "@/components/AdminPanel/PropertyDialog/PropertyDialog";
import { PropertyTable } from "@/components/AdminPanel/PropertyTable/PropertyTable";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getDate, toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/properties/admin-ads", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const MyAdvertisement = () => {
  const { data, isLoading, mutate } = useSWR("admin-ad", fetcher);

  const [newAd, setNewAd] = useState([]);
  const [adDetail, setAdDetail] = useState(null);
  const [isOpenDiaog, setIsOpenDialog] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);


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
          cols={["ملک", "آدرس", "ثبت کننده", "تاریخ ثبت", "وضعیت", "عملیات"]}
          data={[...data?.data]}
          setNewData={setNewAd}
        >
          <tbody className="tbody">
            {data?.data?.length > 0
              ? newAd.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={
                          item.images.length > 0
                            ? item.images[0]?.url
                            : "/images/empty-image.jpg"
                        }
                        alt="house"
                        className="tbl-img"
                      />
                    </td>

                    <td className="tbl-txt tbl-txt-2">{item.title}</td>
                    <td className="tbl-txt">{item.author}</td>
                    <td className="tbl-txt">{getDate(item.created_at)}</td>
                    <td className="tbl-txt">
                      <span className={`status status__${[item.status]}-2`}>
                        {item.status === "pending" && "در انتظار ثبت"}
                        {item.status === "approved" && "ثبت شده"}
                        {item.status === "rejected" && "رد شده"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-outline-4"
                        onClick={() => {
                          setAdDetail(item);
                          setIsOpenDialog(true);
                        }}
                      >
                        نمایش جزییات
                      </button>
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

export default MyAdvertisement;
