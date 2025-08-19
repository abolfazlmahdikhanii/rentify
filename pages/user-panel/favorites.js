import Home from "@/components/module/Home/Home";
import Loader from "@/components/module/Loader/Loader";
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
  fetch("https://rentify-project.ir/api/favorites", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => {
    if (res.ok) return res.json();
  });
const Favorites = () => {
  const { data = [], isLoading, mutate, error } = useSWR("favorites", fetcher);
  if (isLoading) return <Loader />;
  if (error) return toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده">
      <Content>
        {data?.length > 0 ? (
          <div className="fav-grid">
            {data &&
              data?.map((home) => (
                <Home
                  key={home.id}
                  {...home}
                  isBorder={true}
                  getFav={() => mutate()}
                  is_favorite={true}
                />
              ))}
          </div>
        ) : (
          <EmptyList
            src={"/images/empty-ad.png"}
            title="شما هنوز آگهی‌ای رو ذخیره نکردید!"
            subtitle="از طریق آیکون «نشان‌کردن» می‌تونید آگهی‌های مورد نظرتون رو در این لیست ذخیره کنید."
            btnText="جستجو کنید"
            type="search"
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Favorites;
