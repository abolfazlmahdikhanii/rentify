import { InfoCards } from "@/components/AdminPanel/InfoCard/InfoCard";
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

  return (
    <DashboardLayout title="ویرایش اطلاعات" role="admin">
      <Content>
        <InfoCards />
        <div >
          {" "}
          <PropertyTable showData={true} />
        </div>
      </Content>
    </DashboardLayout>
  );
};

export default Dashboard;
