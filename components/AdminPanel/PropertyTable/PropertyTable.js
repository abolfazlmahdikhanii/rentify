"use client";

import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import styles from "./propertyTable.module.css";
import Pagination from "@/components/module/Pagination/Pagination";
import { useCallback, useEffect, useState } from "react";

// Sample data

export function PropertyTable({
  showData = false,
  cols = [],
  children,
  data = [],
  setNewData,
}) {
  const [currPage, setCurrPage] = useState(1);
  const endIndex = currPage * 8;
  const startIndex = (currPage - 1) * 8;
  const total = data?.length;
  const totalPages = Math.ceil(total / 8);
  const updateData = useCallback(() => {
    const currentPageData = data.slice(startIndex, endIndex);
    setNewData(currentPageData);
  }, [data, startIndex, endIndex,setNewData]);
  useEffect(() => {
    updateData();
  }, [updateData, currPage]);
  if (!showData) {
    return (
      <EmptyList
        title="شما هنوز آگهی‌ای ثبت نکردید!"
        description="روزانه هزاران مشتری در رنتی‌فای در جستجوی ملک مورد نظرشان هستند"
        actionLabel="ثبت آگهی رایگان"
        onAction={() => console.log("Add new property")}
      />
    );
  }

  return (
    <div className={styles.propertyTableContainer}>
      <div className={styles.tbl}>
        <table className={styles.propertyTable}>
          <thead>
            <tr>
              {cols.map((item, i) => (
                <th key={i + 1}>{item}</th>
              ))}
            </tr>
          </thead>
          {children}
        </table>
      </div>

      <div className={styles.tablePagination}>
        <div className={styles.paginationInfo}>
          نمایش {startIndex + 1} تا {currPage === totalPages ? total : endIndex}{" "}
          از {total} مورد
        </div>

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currPage}
            onPageChange={(page) => setCurrPage(page)}
          />
        )}
      </div>
    </div>
  );
}
