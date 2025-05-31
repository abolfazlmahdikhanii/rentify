import { PropertyTable } from "@/components/AdminPanel/PropertyTable/PropertyTable";
import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = () =>
  fetch("http://localhost:5000/api/properties/admin-ads", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
  }).then((res) => res.json());
const MyAdvertisement = () => {
  const { data, isLoading } = useSWR("admin-ad", fetcher);
  const [page, setPage] = useState(1);
  const [newAd, setNewAd] = useState([]);
  useEffect(() => {
    if (!data?.data) return;
    const ads = [...data?.data];
    const endIndex = page * 8;
    const startIndex = (page - 1) * 8;
    setNewAd(ads.slice(startIndex, endIndex));
  }, [page, data]);

  const pageHandler = (page) => {
    setPage(page);
  };

  return (
    <DashboardLayout title="آگهی‌های ذخیره شده" role="admin">
      <Content type="tbl">
        <PropertyTable
          showData={true}
          cols={["ملک", "آدرس", "ثبت کننده", "تاریخ ثبت", "وضعیت", "عملیات"]}
          pageHandler={pageHandler}
          totalPages={Math.ceil(data?.count / 8)}
          currPage={page}
          startIndex={(page - 1) * 8}
          endIndex={page*8}
          total={data.count}
        >
          <tbody className="tbody">
            {data?.data.length > 0
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
                    <td className="tbl-txt">1402/07/15</td>
                    <td className="tbl-txt">
                      <span className={`status status__${[item.status]}-2`}>
                        {item.status === "pending" && "در انتظار ثبت"}
                        {item.status === "approved" && "ثبت شده"}
                        {item.status === "rejected" && "رد شده"}
                      </span>
                    </td>

                    <td>
                      <button className="btn btn-outline-4">
                        نمایش جزییات
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </PropertyTable>
        {/* <EmptyList
          src={"/images/empty-add-ad.png"}
          title="شما هنوز آگهی‌ای ثبت نکردید!"
        /> */}
      </Content>
    </DashboardLayout>
  );
};

export default MyAdvertisement;
