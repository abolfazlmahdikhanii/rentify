import { PropertyTable } from "@/components/templates/AdminPanel/PropertyTable/PropertyTable";
import VisitCard from "@/components/templates/AdminPanel/VisitCard/VisitCard";
import TabPanel from "@/components/module/AdminPanel/TabPanel/TabPanel";
import TabPanelItem from "@/components/module/AdminPanel/TabPanel/TabPanelItem";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { toastOption } from "@/helper/helper";
import Loader from "@/components/module/Loader/Loader";

const fetcher = () =>
  fetch("/api/admin/visits", {
    method: "GET",
  }).then((res) => res.json());
const Visits = () => {
  const { data, isLoading, mutate, error } = useSWR("visits", fetcher);
  const [page, setPage] = useState(1);
  const [newVisits, setNewVisits] = useState([]);
  const [tabActive, setTabActive] = useState("all");
  useEffect(() => {
    if (data && data.visits && tabActive === "all") {
      filterContent("all");
    } else if (data && data.visits && tabActive !== "all") {
      filterContent(tabActive);
    }
  }, [data, tabActive]);
  const filterContent = (filterType) => {
    if (!data || !data.visits) return;

    if (filterType === "all") {
      setNewVisits(data.visits);
    } else {
      setNewVisits(data.visits.filter((item) => item.status === filterType));
    }
  };
  const changeStatusHandler = (id, status) => {
    fetch(`/api/visits/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((data) => {
        mutate();
        // After mutation, re-filter the content based on current tab
        filterContent(tabActive);
        toast.success(
          `ملک با موفقیت ${status === "approved" ? "تایید" : "رد"} شد`,
          toastOption,
        );
      })
      .catch((err) => {
        toast.error(
          `خطا در ${status === "approved" ? "تایید" : "رد"} ملک`,
          toastOption,
        );
      });
  };

  if (error) toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="بازدیدها" role="admin">
      {isLoading && <Loader />}
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
        {newVisits && newVisits?.length ? (
          <>
            {newVisits?.map((visit) => (
              <VisitCard
                key={visit.id}
                {...visit}
                onChangeStatus={changeStatusHandler}
              />
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
