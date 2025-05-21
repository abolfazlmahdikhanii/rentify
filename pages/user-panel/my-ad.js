import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/properties/user-ads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => {
    if (res.ok) return res.json();
  });
const MyAdvertisement = () => {
  const { data, isLoading,mutate } = useSWR("user-ad", fetcher);

  const removeAdHandler = (id) => {
    fetch(`http://localhost:5000/api/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        toast.success("ملک با موفقیت حذف شد", toastOption);
        mutate()
      } else {
        toast.error("حذف ملک خطا مواجه شد", toastOption);
      }
    });
  };
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده">
      <Content>
        {data?.data && data?.data.length > 0 ? (
          <div className="fav-grid">
            {data?.data.map((home) => (
              <Home key={home.id} {...home} isBorder={true} isMyAd={true} remove={()=>removeAdHandler(home.id)} />
            ))}
          </div>
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title="شما هنوز آگهی‌ای ثبت نکردید!"
            subtitle="روزانه هزاران مشتری در رنتی‌فای در جستجوی ملک مورد نظرشان هستند"
            btnText="ثبت آگهی ‌رایگان"
            type="add"
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default MyAdvertisement;
