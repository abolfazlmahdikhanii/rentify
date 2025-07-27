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
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import Loader from "@/components/module/Loader/Loader";

const fetcher = () =>
  fetch("https://rentify-app.liara.run/api/properties/admin-ads", {
    method: "GET",
    headers: { Authorization: `Bearer ${getCookie("token")}` },
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

  useEffect(() => {
    if (data?.data) {
      filterContent("all");
    }
  }, [data]);
  const approveHandler = (id) => {
    fetch(`https://rentify-app.liara.run/api/properties/${id}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getCookie("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDialog(false);
        setPropertyDetail(null);
        toast.success("ملک با موفقیت ثبت شد", toastOption);
        mutate("admin-ad");
      })
      .catch((err) => {
        setIsOpenDialog(false);
        toast.error("خطا در ثبت ملک", toastOption);
      });
  };
  const rejectHandler = (id, reason) => {
    fetch(`https://rentify-app.liara.run/api/properties/${id}/reject`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpenDialog(false);
        setPropertyDetail(null);
        mutate("admin-ad");
        toast.success("ملک با موفقیت رد شد", toastOption);
      })
      .catch((err) => {
        setIsOpenDialog(false);
        toast.error("خطا در رد ملک", toastOption);
      });
  };
  const deleteHandler = (data) => {
    setPropertyDetail(data);
    setIsOpenDeleteModal(true);
  };
  const deleteProperty = async (id) => {
    try {
      const response = await fetch(
        `https://rentify-app.liara.run/api/properties/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete property: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Close modals/dialogs and reset state
      setIsOpenDeleteModal(false);
      setIsOpenDialog(false);
      setPropertyDetail(null);

      // Revalidate data
      mutate("admin-ad");

      // Show success feedback ONLY if we reach here (no errors)
      toast.success("ملک با موفقیت حذف شد", toastOption);

      return data; // Optional: return the response data
    } catch (err) {
      console.error("Delete property error:", err); // Log actual error for debugging

      // Close modal on error but keep other states
      setIsOpenDeleteModal(false);

      // Show user-friendly error message
      toast.error(
        err.message?.includes("Failed to delete") ||
          err.message?.includes("حذف")
          ? "خطا در حذف ملک. لطفاً دوباره تلاش کنید"
          : "خطا در اتصال به سرور",
        toastOption
      );

      throw err; // Re-throw the error if you need to handle it further up the chain
    }
  };

  const filterContent = (filterType) => {
    if (!data?.data) return;

    if (filterType === "all") {
      setFilterAd(data.data);
    } else if (filterType === "me") {
      setFilterAd(data.data.filter((item) => item.user_id === user?.id));
    } else {
      setFilterAd(data.data.filter((item) => item.status === filterType));
    }
  };

  if (isLoading) return <Loader />;
  if (error) return toast.error("خطا در دریافت اطلاعات", toastOption);
  return (
    <DashboardLayout title="آگهی‌های ذخیره شده" role="admin">
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
                      <td className="tbl-txt">{getDate(item.created_at)}</td>
                      <td className="tbl-txt">
                        <span className={`status status__${[item.status]}-2`}>
                          {item.status === "pending" && "در انتظار ثبت"}
                          {item.status === "approved" && "ثبت شده"}
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
            onConfirm={() => deleteProperty(propertyDetail.id)}
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
                p.id === updatedProperty.id ? updatedProperty : p
              )
            );
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default MyAdvertisement;
