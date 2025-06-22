import { PropertyTable } from "@/components/AdminPanel/PropertyTable/PropertyTable";
import VisitCard from "@/components/AdminPanel/VisitCard/VisitCard";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getCookie } from "cookies-next";
import React, { useState } from "react";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/visits/admin", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const Visits = () => {
  const { data, isLoading, mutate } = useSWR("visits", fetcher);
  const [page, setPage] = useState(1);
  const [newVisits, setNewVisits] = useState([]);
  console.log(data);
  return (
    <DashboardLayout title="بازدیدها" role="admin">
      <Content type="tbl">
        {data?.length ? (
          <>
            {data.map((visit) => (
              <VisitCard key={visit.id} {...visit} />
            ))}
          </>
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title="شما هنوز آگهی‌ای ثبت نکردید!"
            noBtn={true}
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Visits;
