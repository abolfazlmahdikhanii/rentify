import { PropertyTable } from "@/components/templates/AdminPanel/PropertyTable/PropertyTable";
import VisitCard from "@/components/templates/AdminPanel/VisitCard/VisitCard";
import TabPanel from "@/components/module/AdminPanel/TabPanel/TabPanel";
import TabPanelItem from "@/components/module/AdminPanel/TabPanel/TabPanelItem";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
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
  const [tabActive, setTabActive] = useState("all");
  useEffect(() => {
    if (data) {
      filterContent("all");
    }
  }, [data]);
  const filterContent = (filterType) => {
    if (!data) return;

    if (filterType === "all") {
      setNewVisits(data);
    } else {
      setNewVisits(data.filter((item) => item.status === filterType));
    }
  };
  return (
    <DashboardLayout title="بازدیدها" role="admin">
      <TabPanel>
        <TabPanelItem
          title="همه بازدید ها"
          value="all"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="تایید شده"
          value="approved"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="در حال بررسی"
          value="pending"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="رد شده"
          value="rejected"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
      </TabPanel>
      <Content type="tbl">
        {newVisits?.length ? (
          <>
            {newVisits.map((visit) => (
              <VisitCard key={visit.id} {...visit} />
            ))}
          </>
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title=" هنوز بازدیدی ثبت نشده!"
            noBtn={true}
          />
        )}
      </Content>
    </DashboardLayout>
  );
};

export default Visits;
