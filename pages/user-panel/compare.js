import Home from "@/components/module/Home/Home";
import Content from "@/components/module/UserPanel/Content/Content";
import CompareContent from "@/components/templates/UserPanel/CompareContent";
import DashboardLayout from "@/components/templates/UserPanel/DashboardLayout";
import { CompareContext } from "@/context/CompareContext";
import styles from "../../styles/Compare.module.css";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import ModalProperty from "@/components/templates/UserPanel/ModalProperty";
import { useRouter } from "next/router";
const fetcher = () =>
  fetch("http://localhost:4000/houses").then((res) => res.json());
const compare = () => {
  const { data, isLoading } = useSWR("compare", fetcher);
  const {
    isCompare,
    toggleCompare,
    addToCompare,
    compare,
    isShowCompare,
    showCompare,
  } = useContext(CompareContext);
  const router = useRouter();
  useEffect(() => {
    toggleCompare();
  }, []);
  const displayedHomes = data?.slice(0, 6) || [];
  return (
    <>
      {!isShowCompare ? (
        <DashboardLayout
          title="مقایسه املاک"
          subTitle="(حداقل ۲ کارت و حداکثر ۳ کارت را برای مقایسه انتخاب کنید)"
        >
          <Content>
            <div className="fav-grid">
              {displayedHomes.map((home) => (
                <Home
                  key={home.id}
                  {...home}
                  isBorder={true}
                  isCompare={isCompare}
                  checked={compare.some((item) => item.id === home.id)}
                  onChecked={(e) => addToCompare(home)}
                />
              ))}
            </div>

            <div className="compare-footer">
              <button
                className={`btn ${styles.secondaryButton}`}
                type="button"
                onClick={() => router.push("/homes?from=compare")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#0D6EFD"
                    fillRule="evenodd"
                    d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#0D6EFD"
                    fillRule="evenodd"
                    d="M11.5 8A3.5 3.5 0 0 0 8 4.5v-2A5.5 5.5 0 0 1 13.5 8zM13.707 12.293l6 6-1.414 1.414-6-6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                جستجو
              </button>
              <button
                className={`btn btn-primary ${styles.btnPrimary}`}
                type="button"
                onClick={showCompare}
                // disabled={compare.length < 2 || compare.length > 3}
              >
                تایید
              </button>
            </div>
          </Content>
        </DashboardLayout>
      ) : (
        <CompareContent homes={compare} items={data} />
      )}
    </>
  );
};

export default compare;
