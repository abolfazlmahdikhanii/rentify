import PropertyDialog from "@/components/templates/AdminPanel/PropertyDialog/PropertyDialog";
import EditPropertyModal from "@/components/module/EditProperty/EditPropertyModal";
import Home from "@/components/module/Home/Home";
import Pagination from "@/components/module/Pagination/Pagination";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { CompareContext } from "@/context/CompareContext";
import Loader from "@/components/module/Loader/Loader";

const fetcher = () =>
  fetch("https://rentify-project.ir/api/properties/user-ads", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).then((res) => {
    if (res.ok) return res.json();
  });
const MyAdvertisement = () => {
  const { data, isLoading, mutate, error } = useSWR("user-ad", fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const [newData, setNewData] = useState([]);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [adDetail, setAdDetail] = useState(null);
  const [editingProperty, setEditingProperty] = useState(false);

  const removeAdHandler = (id) => {
    fetch(`https://rentify-project.ir/api/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        toast.success("ملک با موفقیت حذف شد", toastOption);
        mutate();
      } else {
        toast.error("حذف ملک خطا مواجه شد", toastOption);
      }
    });
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const paginationData = data?.data
    ? data.data.slice((currentPage - 1) * 9, currentPage * 9)
    : [];

  if (isLoading) return <Loader />;
  if (error) return toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="آگهی‌های من">
      <Content>
        {data?.data && data?.data.length > 0 ? (
          <>
            <div className="fav-grid">
              {paginationData.map((home) => (
                <Home
                  key={home.id}
                  {...home}
                  isBorder={true}
                  isMyAd={true}
                  remove={() => removeAdHandler(home.id)}
                  onDetail={() => {
                    setAdDetail(home);
                    setIsOpenDialog(true);
                  }}
                />
              ))}
            </div>
            <Pagination
              totalPages={Math.ceil(data.data.length / 10)}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </>
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
      {isOpenDialog && (
        <PropertyDialog
          isOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
          property={adDetail}
          setEditingProperty={setEditingProperty}
        />
      )}
      {editingProperty && (
        <EditPropertyModal
          isOpen={editingProperty ? true : false}
          propertyData={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSuccess={mutate}
        />
      )}
    </DashboardLayout>
  );
};

export default MyAdvertisement;
