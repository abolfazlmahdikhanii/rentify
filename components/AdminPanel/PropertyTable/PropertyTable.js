"use client";

import EmptyList from "@/components/module/UserPanel/EmptyList/EmptyList";
import styles from "./propertyTable.module.css";

// Sample data
const data = [
  {
    id: "1",
    title: "آپارتمان ۲ خوابه در ونک",
    address: "تهران، ونک، خیابان ملاصدرا",
    type: "آپارتمان",
    area: 85,
    rooms: 2,
    price: 12500000,
    status: "اجاره داده شده",
    owner: "علی محمدی",
  },
  {
    id: "2",
    title: "خانه ویلایی ۳ خوابه در لواسان",
    address: "لواسان، خیابان باهنر",
    type: "ویلایی",
    area: 220,
    rooms: 3,
    price: 35000000,
    status: "قابل اجاره",
    owner: "محمد حسینی",
  },
  {
    id: "3",
    title: "آپارتمان ۱ خوابه در پونک",
    address: "تهران، پونک، بلوار عدل",
    type: "آپارتمان",
    area: 65,
    rooms: 1,
    price: 8900000,
    status: "قابل اجاره",
    owner: "زهرا رضایی",
  },
  {
    id: "4",
    title: "سوئیت مبله در فرمانیه",
    address: "تهران، فرمانیه، خیابان لادن",
    type: "سوئیت",
    area: 45,
    rooms: 1,
    price: 15200000,
    status: "اجاره داده شده",
    owner: "فاطمه کریمی",
  },
  {
    id: "5",
    title: "آپارتمان ۳ خوابه در سعادت آباد",
    address: "تهران، سعادت آباد، میدان کاج",
    type: "آپارتمان",
    area: 130,
    rooms: 3,
    price: 18700000,
    status: "قابل اجاره",
    owner: "حسین نوری",
  },
];

export function PropertyTable({ showData = false }) {
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
            
              <th>عنوان</th>
              <th>آدرس</th>
              <th>نوع ملک</th>
              <th>متراژ (متر مربع)</th>
              <th>تعداد اتاق</th>
              <th>اجاره ماهانه</th>
              <th>وضعیت</th>
              <th>مالک</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((property) => (
              <tr key={property.id}>
                
                <td className={styles.propertyTitle}>{property.title}</td>
                <td>{property.address}</td>
                <td>{property.type}</td>
                <td>{property.area} متر</td>
                <td>{property.rooms}</td>
                <td>{property.price.toLocaleString()} تومان</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      property.status === "قابل اجاره"
                        ? styles.available
                        : property.status === "اجاره داده شده"
                        ? styles.rented
                        : styles.maintenance
                    }`}
                  >
                    {property.status}
                  </span>
                </td>
                <td>{property.owner}</td>
                <td>
                  <div className={styles.tableActions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`} title="ویرایش">
                      <span className={`${styles.actionIcon} ${styles.edit}`}></span>
                    </button>
                    <button className={`${styles.actionButton} ${styles.deleteButton}`} title="حذف">
                      <span className={`${styles.actionIcon} ${styles.delete}`}></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tablePagination}>
        <div className={styles.paginationInfo}>۲ از ۵ ردیف انتخاب شده.</div>
        <div className={styles.paginationButtons}>
          <button className={styles.paginationButton}>قبلی</button>
          <button className={styles.paginationButton}>بعدی</button>
        </div>
      </div>
    </div>
  );
}
