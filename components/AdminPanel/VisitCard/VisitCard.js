import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./visit-card.module.css";
import { useState } from "react";

export default function VisitCard() {
    const [isMore,setIsMore] = useState(false);
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isMore ? styles.cardActive : ""}`}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.visitId}>کد بازدید: VST-001</div>
          <div className={styles.statusBadge}>برنامه‌ریزی شده</div>
        </div>

        {/* جزئیات ملک */}
        <div className={styles.section}>
          <div className={styles.propertyDetails}>
            <div className={styles.propertyImage}></div>
            <div className={styles.propertyInfo}>
              <div className={styles.propertyMeta}>
                <div>
                  <div className={styles.propertyHeader}>
                    <h4 className={styles.propertyTitle}>
                      آپارتمان مدرن مرکز شهر
                    </h4>
                    <span className={styles.propertyType}>آپارتمان</span>
                  </div>
                  <div className={styles.propertyAddress}>
                    <span className={styles.icon}>📍</span>
                    <span>تهران، خیابان ولیعصر، پلاک ۱۲۳</span>
                  </div>
                </div>
                <div className={styles.houseInfo}>
                  <div className={styles.specs}>۲ خواب • ۲ حمام • ۱۲۰ متر</div>
                  <div className={styles.price}>۵۰,۰۰۰,۰۰۰ تومان/ماه</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* برنامه بازدید */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>برنامه بازدید</h3>
          <div className={styles.scheduleItem}>
            <span className={styles.icon}>📅</span>
            <span>۱۵ دی ۱۴۰۳</span>
          </div>
          <div className={styles.scheduleItem}>
            <span className={styles.icon}>🕐</span>
            <span>ساعت ۱۴:۰۰ (۴۵ دقیقه)</span>
          </div>
        </div>

        {/* اطلاعات مالک و مشتری */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>اطلاعات مالک و مشتری</h3>
          <div className={styles.peopleRow}>
            {/* مالک */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}></div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>سارا احمدی</span>
                  <span className={styles.personType}>مالک</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>✉️</span>
                    <span>sara.ahmadi@email.com</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>📞</span>
                    <span>۰۹۱۸-۷۶۵-۴۳۲۱</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مشتری */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}></div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>احمد محمدی</span>
                  <span className={styles.personType}>مشتری</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>✉️</span>
                    <span>ahmad.mohammadi@email.com</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>📞</span>
                    <span>۰۹۱۲-۳۴۵-۶۷۸۹</span>
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
            مشتری علاقه‌مند به نقل مکان فوری است. واحدهای طبقه همکف را ترجیح
            می‌دهد.
          </div>
        </div>
        <div className={`${styles.moreBtn} ${isMore?styles.moreBtnActive:""}`} onClick={() => setIsMore(prev=>!prev)}>
          {
            !isMore?<ChevronDown size={16}/>:<ChevronUp size={16}/>
          }
        </div>
      </div>
    </div>
  );
}
