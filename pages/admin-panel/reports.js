import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";


const fetcher = () =>
  fetch("http://localhost:5000/api/properties/user-ad", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const Reports = () => {
  const { data, isLoading } = useSWR("ad", fetcher);
  
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده">
      <Content>
        {/* <div className="fav-grid">
        {data?.splice(0, 6).map((home) => (
          <Home key={home.id} {...home} isBorder={true} isMyAd={true} />
        ))}
        </div> */}
        <EmptyList
          src={"/images/empty-add-ad.png"}
          title="شما هنوز آگهی‌ای ثبت نکردید!"
          subtitle="روزانه هزاران مشتری در رنتی‌فای در جستجوی ملک مورد نظرشان هستند"
          btnText="ثبت آگهی ‌رایگان"
          type="add"
        />
      </Content>
    </DashboardLayout>
  );
};

export default Reports;
