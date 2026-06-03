import PropertyDialog from "@/components/templates/AdminPanel/PropertyDialog/PropertyDialog";
import { PropertyTable } from "@/components/templates/AdminPanel/PropertyTable/PropertyTable";
import TabPanel from "@/components/module/AdminPanel/TabPanel/TabPanel";
import TabPanelItem from "@/components/module/AdminPanel/TabPanel/TabPanelItem";
import DeleteModal from "@/components/module/DeleteModal/DeleteModal";
import EditPropertyModal from "@/components/module/EditProperty/EditPropertyModal";
import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";
import { getDate, toastOption } from "@/helper/helper";
import { getCookie } from "cookies-next";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import Loader from "@/components/module/Loader/Loader";
import { Image } from "@imagekit/next";
import { useRouter } from "next/router";

const fetcher = () =>
  fetch("/api/admin/properties/", {
    method: "GET",
  }).then((res) => res.json());
const MyAdvertisement = () => {
  const { data, isLoading, mutate, error } = useSWR("admin-ad", fetcher);
  const { user } = useContext(AuthContext);
  const [tabActive, setTabActive] = useState("all");
  const [newAd, setNewAd] = useState([]);
  const [adDetail, setAdDetail] = useState(null);
  const [isOpenDiaog, setIsOpenDialog] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [filterAd, setFilterAd] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (data?.data) {
      filterContent("all");
    }
  }, [data]);
  const approveHandler = async (id) => {
    try {
      const res = await fetch(`/api/properties/${id}/approve`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setIsOpenDialog(false);
      setPropertyDetail(null);

      toast.success("ملک با موفقیت ثبت شد", toastOption);
      
      mutate("admin-ad");
    } catch (err) {
      setIsOpenDialog(false);
      toast.error("خطا در ثبت ملک", toastOption);
    }
  };
  const rejectHandler = async (id, reason) => {
    try {
      const res = await fetch(`/api/properties/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setIsOpenDialog(false);
      setPropertyDetail(null);

      mutate("admin-ad");
      toast.success("ملک با موفقیت رد شد", toastOption);
    } catch (err) {
      console.log(err);
      toast.error(err.message, toastOption);
    }
  };
  const deleteHandler = (data) => {
    setPropertyDetail(data);
    setIsOpenDeleteModal(true);
  };
  const deleteProperty = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete property: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      setIsOpenDeleteModal(false);
      setIsOpenDialog(false);
      setPropertyDetail(null);

      mutate("admin-ad");

      toast.success("ملک با موفقیت حذف شد", toastOption);

      return data;
    } catch (err) {
      console.error("Delete property error:", err);

      setIsOpenDeleteModal(false);

      toast.error(
        err.message?.includes("Failed to delete") ||
          err.message?.includes("حذف")
          ? "خطا در حذف ملک. لطفاً دوباره تلاش کنید"
          : "خطا در اتصال به سرور",
        toastOption,
      );

      throw err;
    }
  };

  const filterContent = (filterType) => {
    if (!data?.data) return;

    if (filterType === "all") {
      setFilterAd(data.data);
    } else if (filterType === "me") {
      setFilterAd(
        data.data.filter(
          (item) => item.owner._id.toString() === user?.id.toString(),
        ),
      );
    } else {
      setFilterAd(data.data.filter((item) => item.status === filterType));
    }
  };

  if (error) toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده" role="admin">
      {isLoading && <Loader />}
      <TabPanel>
        <TabPanelItem
          title="همه آگهی ها"
          value="all"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="آگهی‌های من"
          value="me"
          tabActive={tabActive}
          setTabActive={setTabActive}
          action={(val) => filterContent(val)}
        />
        <TabPanelItem
          title="تایید شده"
          value="published"
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
        {filterAd.length ? (
          <PropertyTable
            showData={true}
            cols={["ملک", "آدرس", "ثبت کننده", "تاریخ ثبت", "وضعیت", "عملیات"]}
            data={filterAd}
            setNewData={setNewAd}
          >
            <tbody className="tbody">
              {filterAd.length > 0
                ? newAd.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Image
                          urlEndpoint="https://ik.imagekit.io/wzuqfh7er/"
                          width={50}
                          height={50}
                          src={
                            item.images.length > 0
                              ? item.images[0]?.imageUrl
                              : "/images/empty-image.jpg"
                          }
                          alt="house"
                          className="tbl-img"
                        />
                      </td>

                      <td className="tbl-txt tbl-txt-2">{item.title}</td>
                      <td className="tbl-txt">{item.owner.name}</td>
                      <td className="tbl-txt">{getDate(item.createdAt)}</td>
                      <td className="tbl-txt">
                        <span className={`status status__${[item.status]}-2`}>
                          {item.status === "pending" && "در انتظار ثبت"}
                          {item.status === "published" && "ثبت شده"}
                          {item.status === "rejected" && "رد شده"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-outline-4"
                          onClick={() => {
                            setAdDetail(item);
                            setIsOpenDialog(true);
                          }}
                        >
                          نمایش جزییات
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </PropertyTable>
        ) : (
          <EmptyList
            src={"/images/empty-add-ad.png"}
            title=" هنوز آگهی‌ای ثبت نشده!"
            noBtn={true}
          />
        )}
        {isOpenDiaog && (
          <PropertyDialog
            isOpen={isOpenDiaog}
            onClose={() => setIsOpenDialog(false)}
            property={adDetail}
            approveHandler={approveHandler}
            rejectHandler={rejectHandler}
            deleteHandler={deleteHandler}
            setEditingProperty={setEditingProperty}
          />
        )}

        {isOpenDeleteModal && (
          <DeleteModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            title="حذف ملک"
            question="آیا از حذف این ملک اطمینان دارید؟ این عملیات قابل بازگشت نیست."
            property={propertyDetail}
            onConfirm={() => deleteProperty(propertyDetail._id)}
          />
        )}
      </Content>
      {editingProperty && (
        <EditPropertyModal
          isOpen={editingProperty ? true : false}
          propertyData={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSuccess={mutate}
          onUpdate={(updatedProperty) => {
            // Update your properties list
            setProperties(
              properties.map((p) =>
                p._id === updatedProperty._id ? updatedProperty : p,
              ),
            );
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default MyAdvertisement;
