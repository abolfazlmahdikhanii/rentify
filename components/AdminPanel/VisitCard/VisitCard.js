import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import styles from "./visit-card.module.css";
import { useState } from "react";
import Image from "next/image";
import { getDate, getStatusText } from "@/helper/helper";

export default function VisitCard({
  title,
  location,
  status,
  owner_name,
  owner_lastName,
  owner_email,
  owner_phone,
  visitor_name,
  visitor_lastName,
  visitor_email,
  visit_date,
  visit_time,
  visit_phone,
  message,
  image,
  id,
  ejare_price,
}) {
  const [isMore, setIsMore] = useState(false);
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isMore ? styles.cardActive : ""}`}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.visitId}>
            کد بازدید: RNT-{id.toString().padStart(3, 0)}
          </div>
          <div className={styles.statusBadge}>{getStatusText(status)}</div>
        </div>

        {/* جزئیات ملک */}
        <div className={styles.section}>
          <div className={styles.propertyDetails}>
            <div className={styles.propertyImage}>
              <img
                src={`${image}` || "/images/empty-image.jpg"}
                alt="Property Image"
              />
            </div>
            <div className={styles.propertyInfo}>
              <div className={styles.propertyMeta}>
                <div>
                  <div className={styles.propertyHeader}>
                    <h4 className={styles.propertyTitle}>{title}</h4>
                    {/* <span className={styles.propertyType}>آپارتمان</span> */}
                  </div>
                  <div className={styles.propertyAddress}>
                    <span className={styles.icon}>
                      <MapPin size={16} />
                    </span>
                    <span> {location}</span>
                  </div>
                </div>
                <div className={styles.houseInfo}>
                  {/* <div className={styles.specs}>۲ خواب • ۲ حمام • ۱۲۰ متر</div> */}
                  <div className={styles.price}>
                    {ejare_price.toLocaleString()} تومان/ماه
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* برنامه بازدید */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>برنامه بازدید</h3>
          <div className={styles.scheduleItem}>
            <span className={styles.icon}>
              <Calendar size={17} />
            </span>
            <span>{getDate(visit_date.split("T")[0], "txt")}</span>
          </div>
          <div className={styles.scheduleItem}>
            <span className={styles.icon}>
              <Clock size={17} />
            </span>
            <span>ساعت {visit_time?.slice(0, 5)} </span>
          </div>
        </div>

        {/* اطلاعات مالک و مشتری */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>اطلاعات مالک و مشتری</h3>
          <div className={styles.peopleRow}>
            {/* مالک */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}>
                <img src="/images/profile.png" alt="profile" />
              </div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>
                    {owner_name} {owner_lastName}
                  </span>
                  <span className={styles.personType}>مالک</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Mail size={16} />
                    </span>
                    <span>{owner_email || "ندارد"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Phone size={16} />
                    </span>
                    <span>{owner_phone || "ندارد"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مشتری */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}>
                <img src="/images/profile.png" alt="profile" />
              </div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>
                    {visitor_name} {visitor_lastName}
                  </span>
                  <span className={styles.personType}>مشتری</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Mail size={16} />
                    </span>
                    <span>{visitor_email || "ندارد"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Phone size={16} />
                    </span>
                    <span>{visit_phone || "ندارد"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* یادداشت‌ها */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>یادداشت‌ها</h3>
          <div className={styles.notesBox}>
           {message||"هیچ یادداشتی برای این بازدید وجود ندارد"}
          </div>
        </div>
        <div
          className={`${styles.moreBtn} ${isMore ? styles.moreBtnActive : ""}`}
          onClick={() => setIsMore((prev) => !prev)}
        >
          {!isMore ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>
    </div>
  );
}
