import ColumnChart from "@/components/AdminPanel/ColumnChart/ColumnChart";
import { InfoCards } from "@/components/AdminPanel/InfoCard/InfoCard";
import LineChart from "@/components/AdminPanel/LineChart/LineChart";
import { PropertyTable } from "@/components/AdminPanel/PropertyTable/PropertyTable";
import PrivateRoute from "@/components/module/PrivateRoute/PrivateRoute";
import Content from "@/components/module/UserPanel/Content/Content";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
const fetcher = () =>
  fetch("http://localhost:5000/api/auth/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => res.json());
const Dashboard = () => {
  const { data, isLoading } = useSWR("info", fetcher);
  const series = [
    {
      name: "Client Acquisition",
      data: [65, 45, 35, 75, 85, 25, 55],
    },
  ];
  const seriesLine = [
    {
      name: "Property Sales",
      data: [45, 65, 35, 55, 40, 30, 20],
    },
  ];
  return (
    <DashboardLayout title="ویرایش اطلاعات" role="admin">
      <Content>
        <InfoCards />
        <div className="panel-main">
          {" "}
          {/* <PropertyTable showData={true} /> */}
          <div className="panel-charts">
            <ColumnChart
              categories={["Jan", "Feb", "Mar", "Apr", "May"]}
              series={series}
            />
            <LineChart
              categories={["Jan", "Feb", "Mar", "Apr", "May"]}
              series={seriesLine}
            />
          </div>
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Dashboard;
