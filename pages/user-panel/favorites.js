import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/favorites", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => {
    if (res.ok) return res.json();
  });
const Favorites = () => {
  const { data=[], isLoading, mutate } = useSWR("favorites", fetcher);

  return (
    <DashboardLayout title="آگهی‌های ذخیره شده">
      <Content>
        {data?.length > 0 ? (
          <div className="fav-grid">
            {data&&data?.map((home) => (
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
