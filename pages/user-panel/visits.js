import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import Home from "@/components/module/Home/Home";
import Loader from "@/components/module/Loader/Loader";
import MapSelect from "@/components/module/Map/MapSelect";
import Pagination from "@/components/module/Pagination/Pagination";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import UserVisitBox from "@/components/module/UserPanel/UserVisitBox/UserVisitBox";
import PropertyDialog from "@/components/templates/AdminPanel/PropertyDialog/PropertyDialog";
import ModalMap from "@/components/templates/RegisterStep/ModalMap";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { toastOption } from "@/helper/helper";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

const fetcher = () =>
  fetch("/api/visits/my", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) return res.json();
  });
const MyAdvertisement = () => {
  const { data, isLoading, mutate, error } = useSWR("user-visit", fetcher);
  const [currentPage, setCurrentPage] = useState(1);
  const [newData, setNewData] = useState([]);
  const [position, setPosition] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [adDetail, setAdDetail] = useState(null);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
  const [visitId,setVisitId]=useState(null);
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const cancelVisitHandler = (id) => {
    fetch(`/api/visits/cancel/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("خطا در لغو بازدید", toastOption);
        } else if (res.ok) {
          toast.success("بازدید با موفقیت لغو شد", toastOption);
        }
        return res.json();
      })
      .then((data) => {
        setIsOpenCancelModal(false);

        mutate();
      })
      .catch((err) => {
        setIsOpenCancelModal(false);

        toast.error("خطا در لغو بازدید", toastOption);
      });
  };
  const ITEMS_PER_PAGE = 9;
  const ads = data?.data || [];
  const paginationData = ads.slice((currentPage - 1) * 9, currentPage * 9);

  if (error) toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="بازدیدهای من">
      {isLoading && <Loader />}
      <Content>
        {ads && ads?.length > 0 ? (
          <>
            <div className="fav-grid">
              {paginationData.map((home) => (
                <Home
                  key={home._id}
                  {...home.propertyId}
                  visitDate={home.visitDate}
                  visitTime={home.visitTime}
                  visitStatus={home.status}
                  isBorder={true}
                  isMyVisit={true}
                  onShowMap={(pos) => {
                    setIsShowModal(true);
                    setPosition(pos);
                  }}
                  onDetail={() => {
                    setAdDetail(home.propertyId);
                    setIsOpenDialog(true);
                  }}
                  onCancel={() => {
                    setSelectedVisit(home.propertyId);
                    setVisitId(home._id);
                    setIsOpenCancelModal(true);
                  }}
                  // remove={() => removeAdHandler(home.id)}
                />
              ))}
            </div>
            <Pagination
              totalPages={Math.ceil(ads.length / 10)}
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
      {isShowModal && (
        <ModalMap
          onClose={() => setIsShowModal(false)}
          isConfirm={false}
          title="مشاهده موقعیت ملک"
        >
          <MapSelect
            isEnable={false}
            isVisit={true}
            position={position}
            setPosition={setPosition}
          />
        </ModalMap>
      )}
      {isOpenCancelModal && (
        <DeleteModal
          isOpen={isOpenCancelModal}
          onClose={() => setIsOpenCancelModal(false)}
          property={selectedVisit}
          title="لغو بازدید"
          question="آیا از لغو بازدید این ملک اطمینان دارید؟ این عملیات قابل بازگشت نیست."
          onConfirm={() => cancelVisitHandler(visitId)}
          btnText="لغو بازدید"
        />
      )}

      {isOpenDialog && (
        <PropertyDialog
          isOpen={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
          property={adDetail}
        />
      )}
    </DashboardLayout>
  );
};

export default MyAdvertisement;
