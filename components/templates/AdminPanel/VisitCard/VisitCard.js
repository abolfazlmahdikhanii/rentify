import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  EllipsisVerticalIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import styles from "./visit-card.module.css";
import { useState } from "react";

import { getDate, getStatusText } from "@/helper/helper";
import { Image } from "@imagekit/next";

export default function VisitCard({
  title,
  location,
  status,
  owner,
  details,
  visitDate,
  visitTime,
  visit_phone,
  message,
  images,
  id,
  rentPrice,
  listingType,
  onChangeStatus,
  mortgagePrice,
  visitor,
  price,
}) {
  const [isMore, setIsMore] = useState(false);
  const [isShowDropdown, setIsShowDropdown] = useState(false);

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${isMore ? styles.cardActive : ""}`}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.visitId}>کد بازدید: RNT-{id?.slice(0, 6)}</div>
          <div className={styles.statusWrapper}>
            <div className={styles.statusBadge}>{getStatusText(status)}</div>
            {status === "pending" && (
              <>
                <p
                  className=""
                  onClick={() => {
                    setIsShowDropdown((prev) => !prev);
                  }}
                >
                  <EllipsisVerticalIcon size={14} />
                </p>
                <ul
                  className={`drop-down--tbl shadow-light
              ${isShowDropdown ? "active" : ""}`}
                  onMouseLeave={() => setIsShowDropdown(false)}
                >
                  <li
                    className="drop-down__btn"
                    onClick={() => {
                      onChangeStatus(id, "approved");
                      setIsShowDropdown(false);
                    }}
                  >
                    تایید
                  </li>
                  <li
                    className="drop-down__btn"
                    onClick={() => {
                      onChangeStatus(id, "rejected");
                      setIsShowDropdown(false);
                    }}
                  >
                    رد
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* جزئیات ملک */}
        <div className={styles.section}>
          <div className={styles.propertyDetails}>
            <div className={styles.propertyImage}>
              <Image
                urlEndpoint="https://ik.imagekit.io/wzuqfh7er/"
                width={80}
                height={80}
                src={images[0]?.imageUrl}
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
                    <span> {location.address}</span>
                  </div>
                </div>
                <div className={styles.houseInfo}>
                  <div className={styles.specs}>
                    {details.bedrooms} خواب • {details.bathrooms} حمام •{" "}
                    {details.buildingArea} متر
                  </div>
                  <div className={styles.price}>
                    {listingType === "sale" && (
                      <div className={styles.cardFooter__info}>
                        <span>فروش:</span>
                        <div className={styles.cardFooter__infoPrice}>
                          {price.toLocaleString()}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="9"
                            fill="none"
                            viewBox="0 0 13 7"
                          >
                            <path
                              fill="#73767C"
                              d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}
                    {listingType === "rent" && (
                      <div className={styles.cardFooter__info}>
                        <span>اجاره:</span>
                        <div className={styles.cardFooter__infoPrice}>
                          {rentPrice.toLocaleString()}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="9"
                            fill="none"
                            viewBox="0 0 13 7"
                          >
                            <path
                              fill="#73767C"
                              d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}
                    {listingType === "mortgage" && (
                      <div className={styles.cardFooter__info}>
                        <span> رهن:</span>
                        <div className={styles.cardFooter__infoPrice}>
                          {mortgagePrice.toLocaleString()}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="9"
                            fill="none"
                            viewBox="0 0 13 7"
                          >
                            <path
                              fill="#73767C"
                              d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                            ></path>
                            <path
                              fill="#73767C"
                              d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                            ></path>
                          </svg>
                        </div>
                        <div className={styles.cardFooter__info}>
                          اجاره
                          <div className={styles.cardFooter__infoPrice}>
                            {rentPrice.toLocaleString()}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="9"
                              fill="none"
                              viewBox="0 0 13 7"
                            >
                              <path
                                fill="#73767C"
                                d="M10.611 3.996h.996q.76 0 .76-.508 0-.2-.075-.598-.066-.405-.155-.789l.56-.147q.09.376.163.826.081.45.081.7 0 .31-.147.583a1.13 1.13 0 0 1-.45.435 1.54 1.54 0 0 1-.737.162h-.996zm.332-3.65h.737v.738h-.737zm1.32 0H13v.738h-.737z"
                              ></path>
                              <path
                                fill="#73767C"
                                d="M8.395 5.862q.516 0 .796-.126a.7.7 0 0 0 .398-.368q.11-.25.11-.664V4.66h-.81q-.62 0-1.003-.369-.376-.368-.376-1.032 0-.45.17-.818.176-.369.486-.583a1.25 1.25 0 0 1 .715-.213q.42 0 .737.206.318.207.487.575.17.361.17.833v.737h.412l.045.34-.044.324h-.413v.044q0 .84-.45 1.327-.443.495-1.43.494h-.79v-.663zm-.31-2.603q0 .405.192.575.19.162.611.162H9.7V3.26q0-.45-.207-.7-.207-.258-.612-.258a.72.72 0 0 0-.59.265q-.206.258-.206.693M3.63 5.827h.207q.347 0 .428-.31L4.5 4.67q.162-.575.501-.9.34-.331.819-.332.383 0 .678.229.295.22.457.605.162.375.162.818 0 .546-.155.9-.155.346-.405.5a.9.9 0 0 1-.516.163q-.28 0-.56-.11a9 9 0 0 1-.885-.413 1.1 1.1 0 0 1-.347.265.94.94 0 0 1-.413.096h-.206zm1.24-.287q.53.273.752.361.22.088.42.088.25 0 .376-.184.125-.192.125-.715 0-.464-.184-.723-.184-.264-.538-.265a.66.66 0 0 0-.465.184q-.192.185-.295.56z"
                              ></path>
                              <path
                                fill="#73767C"
                                d="M3.593 6.491q-.73 0-1.01-.39-.28-.399-.28-1.165l-.008-.772h.575l.007.772q0 .398.045.575a.4.4 0 0 0 .191.25q.148.067.48.067h.11l.037.339-.037.324z"
                              ></path>
                              <path
                                fill="#73767C"
                                d="M1.113.947Q.7 1.787.7 2.51q0 .67.324 1.076Q1.357 4 2.027 4h.79q.5 0 .78-.118a.7.7 0 0 0 .399-.361q.117-.243.118-.671V.534h.575v2.315q0 .855-.45 1.334t-1.423.48h-.789q-.611 0-1.04-.303a1.9 1.9 0 0 1-.648-.796A2.6 2.6 0 0 1 .125 2.51q0-.9.501-1.829zM2.219.512h.737v.737H2.22z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}{" "}
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
            <span>{getDate(visitDate, "txt")}</span>
          </div>
          <div className={styles.scheduleItem}>
            <span className={styles.icon}>
              <Clock size={17} />
            </span>
            <span>ساعت {visitTime} </span>
          </div>
        </div>

        {/* اطلاعات مالک و مشتری */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>اطلاعات مالک و مشتری</h3>
          <div className={styles.peopleRow}>
            {/* مالک */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}>
                <Image
                  width={40}
                  height={40}
                  src="/images/profile.png"
                  alt="profile"
                />
              </div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>
                    {owner.name} {owner.lastName}
                  </span>
                  <span className={styles.personType}>مالک</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Mail size={16} />
                    </span>
                    <span>{owner?.email || "ندارد"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Phone size={16} />
                    </span>
                    <span>{owner?.phone || "ندارد"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* مشتری */}
            <div className={styles.personInfo}>
              <div className={styles.avatar}>
                <Image
                  width={40}
                  height={40}
                  src="/images/profile.png"
                  alt="profile"
                />
              </div>
              <div className={styles.personDetails}>
                <div className={styles.personHeader}>
                  <span className={styles.personName}>
                    {visitor.name} {visitor.lastName}
                  </span>
                  <span className={styles.personType}>مشتری</span>
                </div>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Mail size={16} />
                    </span>
                    <span>{visitor.email || "ندارد"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.icon}>
                      <Phone size={16} />
                    </span>
                    <span>{visitor?.phone || "ندارد"}</span>
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
            {message || "هیچ یادداشتی برای این بازدید وجود ندارد"}
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
