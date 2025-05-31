"use client";

import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import styles from "./propertyTable.module.css";
import Pagination from "@/components/module/Pagination/Pagination";

// Sample data

export function PropertyTable({
  showData = false,
  cols = [],
  children,
  pageHandler,
  totalPages,
  currPage,
  startIndex,
  endIndex,
  total
}) {
  // If there's no data and showData is false, show the empty state
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
        <div className={styles.paginationInfo}>نمایش {startIndex+1} تا {currPage===totalPages?total:endIndex} از {total} مورد</div>

        <Pagination
          totalPages={totalPages}
          currentPage={currPage}
          type="tbl"
          onPageChange={pageHandler}
        />
      </div>
    </div>
  );
}
